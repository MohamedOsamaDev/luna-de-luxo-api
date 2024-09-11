import { orderModel } from "../../../database/models/order.model.js";
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

