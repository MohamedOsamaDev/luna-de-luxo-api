import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short brand name"],
    },
    publish: { type: Boolean, default: false, default: false },
    expires: Date,
    discount: { type: Number, default: 0, required: true, min: 0, max: 100 },
    commission: { type: Number, default: 0, required: true, min: 0, max: 100 },
    count: { type: Number, default: 0, required: true, min: 0 },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: ObjectId, ref: "user" },
    isDeleted:{ type: Boolean,default: false },
  },
  { timestamps: true }
);
schema.virtual("influencer", {
  ref: "influencer",
  localField: "_id",
  foreignField: "coupon",
  justOne: true, // Ensures the virtual field returns an object instead of an array
});
// Ensure virtual fields are serialized
schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export const couponModel = mongoose.model("coupon", schema);
