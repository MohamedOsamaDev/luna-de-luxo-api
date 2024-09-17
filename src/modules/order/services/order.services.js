import { allPaymentsTypes } from "../../../config/payments.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { makeSessionExpirated } from "../../../services/payments/stripe/session.js";
import { removeCouponRecord } from "../../coupon/coupon.services.js";
import { makeMultibulkWrite } from "../../handlers/crudHandler.js";
import { increamentInfluncerBalance } from "../../influncer/influncer.services.js";
import { deleteGetwaySession } from "../../sessionGetway/sessionGetway.services.js";
import {
  clothesPrepareForMakeOrder,
  decorPrepareForMakeOrder,
  decorPrepareReStock,
  clothesPrepareReStock,
} from "./order.prepare.js";
export const mainFilterOrder = {
  $or: [
    {
      isPaid: true,
    },
    {
      paymentType: allPaymentsTypes.COD,
    },
    {
      isPaid: false,
      paymentType: {
        $ne: allPaymentsTypes.getway,
      },
    },
  ],
};
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
export const OrderCompleted = async (_id) => {
  const order = await orderModel
    .findByIdAndUpdate(
      _id,
      { isPaid: true, orderStatus: "accepted" },
      { new: true }
    )
    .populate({
      path: "user",
      select: "name email",
      populate: {
        path: "cart",
        select: "items",
      },
    });
  if (!order) return null;
  await deleteGetwaySession({
    order: _id,
  });

  await increamentInfluncerBalance(order);
  const cart = order?.user?.cart || {};
  let cartItems = cart?.items || [];
  const orderitems = order?.items || [];
  cartItems = cartItems?.filter(
    (cartItem) =>
      !orderitems?.find(
        (item2) => cartItem?._id?.toString() === item2?.id?.toString()
      )
  );
  await cartModel.findByIdAndUpdate(cart?._id, {
    items: cartItems,
  });

  return order;
};
export const orderFiled = async (_id) => {
  const order = await orderModel.findByIdAndDelete(_id, {
    new: true,
  });
  if (!order) return null;
  await deleteGetwaySession({
    order: _id,
  });
  let bulkwriteOperations = prepareForRestock(order);
  await makeMultibulkWrite(bulkwriteOperations);
  // handle coupon case
  await removeCouponRecord(order);
  return true;
};
export const cancelSession = async (session) => {
  const isProviderAcceptedRequest = await makeSessionExpirated(
    session?.session?.id
  );
  return true;
};
