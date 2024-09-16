import { influencerModel } from "../../database/models/influencer.model.js";

export const increamentInfluncerBalance = async (order) => {
  // Calculate discount amount and update influencer earnings
  const discountAmount =
    order?.totalOrderPrice * (order?.coupon?.discount / 100);
  return await influencerModel.findOneAndUpdate(
    {
      coupon: order?.coupon?.original_id,
    },
    {
      $inc: { totalEarned: discountAmount, totalSales: 1 },
    }
  );
};

export const populateInfluencer = [
  {
    path: "coupon",
    select: "_id code ",
  },
  {
    path: "relatedTo",
    select: "_id fullName",
  },
];
