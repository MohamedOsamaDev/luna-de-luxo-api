import { cartModel } from "../../database/models/cart.model.js";

import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  FindAll,
  makeMultibulkWrite,
  updateOne,
} from "./../handlers/crudHandler.js";
import { insertOrder, prepareForRestock } from "./services/order.services.js";
import { getwaySessionModel } from "../../database/models/getwaySession.model.js";
import {
  handleSubmitUseCoupon,
  removeCouponRecord,
} from "../coupon/coupon.services.js";
import { orderModel } from "../../database/models/order.model.js";
const createOrder = AsyncHandler(async (req, res, next) => {
  const { order, bulkOperations } =  req.makeOrder;
  // Update stock products
  await makeMultibulkWrite(bulkOperations);
  // Handle order creation
  const newOrder = await insertOrder(order);
  // Handle coupon usage
  await handleSubmitUseCoupon(newOrder);
  // Handle clear cart
  await cartModel.findByIdAndUpdate(req?.user?.cart?._id, { items: [] });
  res.status(201).json({
    message: "Order created successfully",
  });
});
const cancelOrder = AsyncHandler(async (req, res) => {
  // remove session from getway sessions
  // find order and delete
  // release hold qty
  const { id } = req.params;
  const getwaySession = await getwaySessionModel
    .findByIdAndDelete(id)
    .populate("order")
    .lean();
  let order = getwaySession?.order;
  if (order) {
    await makeMultibulkWrite(prepareForRestock(order));
    await orderModel.findByIdAndDelete(order?._id);
    await removeCouponRecord(order);
  }
  res.status(201).json({
    message: "Order cancelled successfully",
  });
});
const confirmOrder = AsyncHandler(async (req, res) => {
  // update order status to confirmed
  // remove session from getway sessions
  // find order and update status
  const getwaySession = await getwaySessionModel
    .findByIdAndDelete(req.params.id)
    .populate("order")
    .lean();
  const order = getwaySession?.order;
  if (order) {
    await orderModel.findByIdAndUpdate(order?._id, {
      paid: true,
    });
    await handleSubmitUseCoupon(order);
  }
  res.status(201).json({
    message: "Order confirmed successfully",
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

  res.json(order);
});
const createCheckOutSession = AsyncHandler(async (req, res) => {
  // create getway session and return the session id
  const { order, bulkOperations } =  req.makeOrder;
  // 1 
  // Update stock products
  await makeMultibulkWrite(bulkOperations);
  // Handle order creation
  const newOrder = await insertOrder(order);
  const getwaySession = new getwaySessionModel({ order: newOrder._id });
  await getwaySession.save();
  res.status(201).json({
    message: "Getway session created successfully",
    session: getwaySession._id,
  });
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
export {
  createOrder,
  getSpecificOrder,
  createCheckOutSession,
  cancelOrder,
  confirmOrder,
  getAllOrders,
  updateOrder,
};
