import mongoose from "mongoose";
import { productModel } from "./product.model.js";

const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    description: {
      type: String,
      trim: true,
      minLength: [1, "too short brand name"],
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    poster: { type: ObjectId, ref: "file" },
    publish: { type: Boolean, default: false, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: "poster",
    model: "file",
    select: "url",
  });
  next();
});
export const categoryModel = mongoose.model("category", schema);
