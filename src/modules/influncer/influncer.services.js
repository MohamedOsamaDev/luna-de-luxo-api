import { influencerModel } from "../../database/models/influencer.model.js";

export const increamentInfluncerBalance = async (query, totalEarned) => {
  // Calculate discount amount and update influencer earnings
  return await influencerModel.findOneAndUpdate(query, {
    $inc: { totalEarned, totalSales: 1 },
  });
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
]