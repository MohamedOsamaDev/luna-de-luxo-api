import { influencerModel } from "../../database/models/influencer.model.js";

export const increamentInfluncerBalance = async (order) => {
  if (!order?.coupon?.discount || !order?.coupon?.original_id) return;

  try {
    // Calculate the commission amount based on the total order price and the coupon's commission percentage
    const commissionAmount = order.totalOrderPrice * (order?.coupon?.commission / 100);
    
    // Update influencer's total earned and total sales
    let influencerAfterUpdate = await influencerModel.findOneAndUpdate(
      {
        coupon: order?.coupon?.original_id,
      },
      {
        $inc: { totalEarned: commissionAmount, totalSales: 1 },
      }
    );
    
    return influencerAfterUpdate;
  } catch (e) {
    console.error("Error updating influencer balance", e);
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
