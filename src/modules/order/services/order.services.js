import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { makeSessionExpirated } from "../../../services/payments/stripe/session.js";
import { removeCouponRecord } from "../../coupon/coupon.services.js";
import { makeMultibulkWrite } from "../../handlers/crudHandler.js";
import {
  clothesPrepareForMakeOrder,
  decorPrepareForMakeOrder,
  decorPrepareReStock,
  clothesPrepareReStock,
} from "./order.prepare.js";

export const prepareForRestock = (order, bulkOp = {}) => {
  const bulkOperations = { ...bulkOp };
  const reStcockTypes = {
    decor: decorPrepareReStock,
    clothes: clothesPrepareReStock,
  };
  try {
    order?.items?.forEach((item) => {
      const { type } = item;
      const helper = reStcockTypes[type];
      if (helper) helper(item, bulkOperations);
    });
  } catch (error) {}
  return bulkOperations;
};
export const orderServices = {
  decor: decorPrepareForMakeOrder,
  clothes: clothesPrepareForMakeOrder,
  reStock: prepareForRestock,
};
export const insertOrder = async (order) => {
  let newOrder = new orderModel(order);
  return newOrder.save();
};

export const cancelSession = async (session) => {
  const isProviderAcceptedRequest = await makeSessionExpirated(
    session?.session?.id
  );
  if (isProviderAcceptedRequest) {
    await orderFiled(session?.order);
  }
  return true;
};
export const OrderCompleted = async (_id) => {
  const order = await orderModel
    .findByIdAndUpdate(_id, { status: "completed" }, { new: true })
    .populate("user");
  if (!order) return null;
  await cartModel.findOneAndUpdate(
    { user: order?.user?._id },
    {
      items: [],
    }
  );
  return order;
};
export const orderFiled = async (_id) => {
  const bulkwriteOperations = {};
  const order = await orderModel.findById(_id);
  if (!order) return null;
  prepareForRestock(order, bulkwriteOperations);
  await makeMultibulkWrite(bulkwriteOperations);
  // handle coupon case
  await removeCouponRecord(order);
  return true;
};
