import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    coupon: { type: mongoose.Types.ObjectId, ref: "coupon" },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const couponhistoryModel = mongoose.model("couponhistory", schema);
