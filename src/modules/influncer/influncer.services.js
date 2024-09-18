import { influencerModel } from "../../database/models/influencer.model.js";

export const increamentInfluncerBalance = async (order) => {
  if (!order?.coupon?.discount || !order?.coupon?.original_id) return;
  try {
    // Calculate discount amount and update influencer earnings
    const discountAmount =
      order?.totalOrderPrice * (order?.coupon?.discount / 100);
    let influencerAfterUpdate = await influencerModel.findOneAndUpdate(
      {
        coupon: order?.coupon?.original_id,
      },
      {
        $inc: { totalEarned: discountAmount, totalSales: 1 },
      }
    );
    return influencerAfterUpdate;
  } catch (e) {
    
  }
  return null;
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
