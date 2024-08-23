import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short brand name"],
    },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    product: { type: mongoose.Types.ObjectId, ref: "product" },
    rate: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const reviewModel = mongoose.model("review", schema);
