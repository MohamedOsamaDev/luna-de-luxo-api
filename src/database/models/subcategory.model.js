import mongoose from "mongoose";
import { FilePopulate } from "../Commons.js";
const ObjectId = mongoose.Types.ObjectId;
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
    category: [{ type: mongoose.Types.ObjectId, ref: "category" }],
    poster: { type: ObjectId, ref: "file" },
    publish: { type: Boolean, default: false, default: false },
    isDeleted: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  
  this.populate({
    path: "poster",
   ...FilePopulate
  });
  next();
});
export const SubCategoryModel = mongoose.model("subcategory", schema);
