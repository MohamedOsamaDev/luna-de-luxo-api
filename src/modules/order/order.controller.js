import { cartModel } from "../../database/models/cart.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  FindAll,
  makeMultibulkWrite,
  updateOne,
} from "./../handlers/crudHandler.js";
import { insertOrder } from "./services/order.services.js";
import { handleSubmitUseCoupon } from "../coupon/coupon.services.js";
import { orderModel } from "../../database/models/order.model.js";
import { createGetwaySession } from "../sessionGetway/sessionGetway.services.js";

import { createStripeSession } from "../../services/payments/stripe/session.js";

const createCheckOutSession = AsyncHandler(async (req, res) => {
  // create getway session and return the session id
  const { order, bulkOperations } = req.makeOrder;
  //create
  const newOrder = await insertOrder(order);
  // perpare Session payload
  const payload = {
    user: req.user,
    order: newOrder,
    shippingAddress: req.body.shippingAddress,
  };
  // create stripe Session
  const session = await createStripeSession(payload);
  // create record getway Session into database
  await createGetwaySession({
    user: req.user?._id,
    order: newOrder._id,
    getwayProvidor: order?.paymentType,
    session: session?.id,
  });
  // Update stock products
  await makeMultibulkWrite(bulkOperations);
  return res.json({
    message: "Checkout session created successfully",
    session: session?.url,
  });
});

const createOrder = AsyncHandler(async (req, res, next) => {
  const { order, bulkOperations } = req.makeOrder;
  // Handle order creation
  const newOrder = await insertOrder(order);
  // Handle coupon usage
  await handleSubmitUseCoupon(newOrder);
  // Handle clear cart
  await cartModel.findByIdAndUpdate(req?.user?.cart?._id, { items: [] });
  return res.status(201).json({
    message: "Order created successfully",
  });
});

const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const isAdmin = user.role === "admin";

  let query = orderModel.findById(id);

  if (isAdmin) {
    query = query.populate([
      { path: "user", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
      { path: "updatedBy", select: "fullName email" },
    ]);
  }

  const order = await query;

  if (!order || (order.user.toString() !== user._id.toString() && !isAdmin)) {
    return next(new AppError({ message: "Order not found", code: 404 }));
  }

  return res.json(order);
});

const config = {
  model: orderModel,
  name: "order",
  publish: false,
  customFiltersFN: (req) => {
    let user = req.user;
    let query = req.query;
    if (!user.role === "admin") {
      query = { user: user?._id };
    }
    return query;
  },
};
const getAllOrders = FindAll(config);
const updateOrder = updateOne(config);
const webhookOrders = AsyncHandler(async (req, res, next) => {
  let { event } = req.webhook;
  const allEvenets = {
    "checkout.session.completed": () => {},
    "payment.intent.payment_failed": () => {},
    default: () => {},
  };
  const handler = allEvenets[event];
  console.log("🚀 ~ webhookOrders ~ event:", event)
  if (handler) {
    handler();
    
  } else {
    console.log(`Unhandled event type ${event}`);
  }
  res.json({ received: true });
});
export {
  createOrder,
  getSpecificOrder,
  createCheckOutSession,
  getAllOrders,
  updateOrder,
  webhookOrders,
};
