
import { orderModel } from "../../../database/models/order.model.js";
import {
  clothesPrepareForMakeOrder,
  decorPrepareForMakeOrder,
  decorPrepareReStock,
  clothesPrepareReStock,
} from "./order.prepare.js";

export const prepareForRestock = (order, bulkOp = {}) => {
  const bulkOperations = { ...bulkOp };
  try {
    order?.items?.forEach((item) => {
      const { type } = item;
      switch (type) {
        case "decor":
          decorPrepareReStock(item, bulkOperations);
          break;
        case "clothes":
          clothesPrepareReStock(item, bulkOperations);
          break;
        default:
          console.warn(`Unknown item type: ${type}`);
      }
    });
  } catch (error) {
    console.error("Error while releasing stock:", error);
  }
  return bulkOperations;
};

export const insertOrder = async (order) => {
  let newOrder = new orderModel(order);
  await newOrder.save();
  return newOrder;
};
export const orderServices = {
  decor: decorPrepareForMakeOrder,
  clothes: clothesPrepareForMakeOrder,
  reStock: prepareForRestock,
};
