import { FindCouponWithVerfiy } from "../../modules/coupon/coupon.services.js";
import { orderServices } from "../../modules/order/services/order.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const makeOrder = AsyncHandler(async (req, res, next) => {
  const { user = {} } = req;
  const { cart = {} } = user; // cart is populated with user
  // Handle error cases
  if (!cart || !cart?.items?.length) {
    return next(
      new AppError({
        message: "Cart is empty",
        code: 400,
        details: { cart: [] },
      })
    );
  }
  // Handle verify coupon
  let coupon = undefined;
  if (req.body.coupon) {
    const findCoupon = await FindCouponWithVerfiy({
      filters: {
        _id: req.body.coupon,
      },
      user,
    });
    coupon = {
      original_id: findCoupon._id,
      code: findCoupon.code,
      discount: findCoupon?.discount,
    };
  }
  // initialize order object
  let totalOrderPrice = 0;
  const items = [];
  const bulkOperations = {};
  // error response fro case any product not exist
  const onError = () => {
    return next(
      new AppError({
        message: "Some products are not available",
        code: 400,
        details: {
          cart: [...cart.items],
        },
      })
    );
  };
  // check product availability
  cart?.items?.forEach((item) => {
    const { product, quantity } = item;
    // call orderServices to handle select handler debend on product type
    let orderHelper = orderServices?.[item?.product?.type];
    // call Error() if orderHelper not recognize on product type
    if (!orderHelper) return onError();
    const isValid = orderHelper({
      ...item,
      bulkOperations,
      items,
    });
    // call Error() any product is not Valid
    if (!isValid) return onError();
    // if everything is valid then continue to next step
    // Calculate order item price and add to total order price
    const itemPrice = product?.price * quantity;
    totalOrderPrice += itemPrice;
  });
  // create order object for nect controller
  let order = {
    user: user?._id,
    items,
    totalOrderPrice,
    ...req?.body,
  };
  // handle if order has coupon
  if (coupon) {
    order.discount = coupon?.discount;
    order.coupon = coupon; // Pass the full coupon object
    order.totalOrderPrice -= totalOrderPrice * (coupon?.discount / 100);
  }
  // handle shipping fee
  order.shippingPrice = 50;
  order.totalOrderPrice += 50;
  // pass order object to next controller
  req.makeOrder = {
    order,
    bulkOperations,
  };
  // call next middleware to continue to next controller
  return next();
});
