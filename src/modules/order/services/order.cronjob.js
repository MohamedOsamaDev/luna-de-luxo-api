import { timeToMillis } from "../../../utils/formateTime.js";
import { prepareForRestock } from "./order.services.js";
import { perpareForDeleteCouponsRecord } from "../../coupon/coupon.services.js";
import { couponhistoryModel } from "../../../database/models/coupon_history.js";
import { orderModel } from "../../../database/models/order.model.js";

export const cleanCanceledOrders = async () => {
  const canceledOrders = await orderModel
    .find({
      paymentType: "getway",
      paid: false,
      createdAt: {
        $lt: new Date(new Date().getTime() - timeToMillis("15m")), // 30 days ago
      },
    })
    .limit(20);

  if (canceledOrders?.length) {
    let removedList = [];
    let bulkwriteOperations = {};
    let coupontasks = [];
    canceledOrders?.forEach(async (order) => {
      removedList.push(order?._id);
      bulkwriteOperations = prepareForRestock(order, bulkwriteOperations);
      coupontasks = perpareForDeleteCouponsRecord(order, coupontasks);
    });
    bulkwriteOperations.couponhistory = {
      model: couponhistoryModel,
      tasks: coupontasks,
    };
    await makeMultibulkWrite(bulkwriteOperations);
    await orderModel.deleteMany({ _id: { $in: removedList } });
  }
};
