import { cartModel } from "../../database/models/cart.model.js";
import { orderModel } from "../../database/models/order.model.js";
import { productModel } from "../../database/models/product.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const createCashOrder = AsyncHandler(async (req, res, next) => {
  //1- get cart --> cartId
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found"));
  //2- total order price
  let totalOrderPrice = cart?.totalPriceAfterDiscount
    ? cart?.totalPriceAfterDisc
    : cart?.totalPrice;
  //3- create order --> cash
  let order = new orderModel({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  await order.save();
  //4- increment sold && decrement Qty
  let options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
      },
    };
  });
  await productModel.bulkWrite(options);
  //5- clear cart
  await cartModel.findByIdAndDelete(req.params.id);

  res.json(order);
});
const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  const isAdmin = user.role === "admin";
  let order = await orderModel.findById(params.id).populate("user", "fullName");
  let checker = order?.user?.toString() !== user._id.toString() && !isAdmin;
  if (!order || checker) {
    return next(new AppError({ message: "Order not found", code: 404 }));
  }
  if (!order)
    return next(
      new AppError({
        message: "not found order",
        code: 404,
      })
    );

  res.json(order);
});
const getAllOrders = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    orderModel.find({ user: req.user._id }),
    req.query
  );
  apiFetcher.filter().search().sort().select();
  // Execute the modified query and get total count
  const total = await orderModel.countDocuments(apiFetcher.queryOrPipeline);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    success: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});
const createCheckoutSession = AsyncHandler(async (req, res, next) => {
  //1- get cart --> cartId
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found"));
  //2- total order price
  let totalOrderPrice = cart?.totalPriceAfterDiscount
    ? cart?.totalPriceAfterDiscount
    : cart?.totalPrice;
  //3- create session for the payment transaction
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://route-comm.netlify.app/#/", // to home page or orders page
    cancel_url: "https://route-comm.netlify.app/#/cart", // to cart
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json(session);
});

export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckoutSession,
};
