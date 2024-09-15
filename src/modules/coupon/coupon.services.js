import mongoose from "mongoose";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "../../database/models/coupon.model.js";
import { increamentInfluncerBalance } from "../influncer/influncer.services.js";
import { couponhistoryModel } from "../../database/models/coupon_history.js";

export const FindCouponWithVerfiy = async ({ filters, user }) => {
  let matchCondition = {
    expires: { $gt: new Date() },
    publish: true,
  };
  if (filters._id) {
    // Convert _id to ObjectId if it exists in filters
    matchCondition._id = new mongoose.Types.ObjectId(filters._id);
  } else if (filters.code) {
    // Add code to matchCondition if it exists in filters
    matchCondition.code = filters.code;
  }

  const result = await couponModel.aggregate([
    {
      $match: matchCondition,
    },
    {
      $lookup: {
        from: "couponhistories",
        localField: "_id",
        foreignField: "coupon",
        as: "history",
      },
    },
    {
      $project: {
        _id: 1,
        code: 1,
        expires: 1,
        discount: 1,
        isUsedBefore: {
          $in: [user._id, "$history.user"],
        },
      },
    },
  ]);
  const [coupon = null] = result;
  if (!coupon) throw new AppError(httpStatus.NotFound);
  if (coupon?.isUsedBefore)
    throw new AppError({ message: "the coupon is used before", code: 409 });
  return coupon;
};

export const upsertCouponRecord = async (order) => {
  if (order?.user || !order?.coupon?.original_id) return;
  return await couponhistoryModel
    .findOneAndUpdate(
      { user: order?.user, coupon: order?.coupon?.original_id },
      { user: order?.user, coupon: order?.coupon?.original_id },
      { upsert: true, new: true }
    )
    .exec();
};
export const handleSubmitUseCoupon = async (order) => {
  if (!order?.coupon?.original_id) return;
  await upsertCouponRecord(order);
  // Calculate discount amount and update influencer earnings
  const discountAmount = order?.totalOrderPrice * (order?.coupon?.discount / 100);
  await increamentInfluncerBalance(
    {
      coupon: order?.coupon?.original_id,
    },
    discountAmount
  );
};

export const removeCouponRecord = async (order) => {
  if (!order?.coupon?.original_id) return;
  
  return await couponhistoryModel.deleteOne({
    user: order?.user,
    coupon: order?.coupon?.original_id, // Store only ObjectId
  });
};

export const perpareForDeleteCouponsRecord = (order, list = []) => {
  if (!order?.coupon?.original_id) return list;
  return [
    ...list,
    {
      deleteOne: {
        filter: { coupon: order?.coupon?.original_id, user: order?.user }, // Delete all documents where value < 10
      },
    },
  ];
};
