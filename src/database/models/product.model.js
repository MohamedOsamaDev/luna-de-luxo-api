import mongoose from "mongoose";
import { productTypes } from "../../assets/enums/productTypes.js";
import { preFindproduct } from "../../modules/product/product.services.js";

const ObjectId = mongoose.Schema.Types.ObjectId;

// Main Product Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [1, "too short brand name"],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    additionalInfo: [
      {
        title: {
          type: String,
          trim: true,
          required: true,
          minLength: [1, "too short info name"],
        },
      },
    ],
    sold: Number,
    rateRange:{
      type: Number,
      default: 1,
      max: 100000,
      min: 0,
    },
    isFeatured: { type: Boolean, default: false },
    publish: { type: Boolean, default: false },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    subcategory: { type: ObjectId, ref: "subcategory" },
    category: { type: ObjectId, ref: "category" },
    isDeleted: { type: Boolean, default: false },
    rateRange: { type: Number, default: 1, max: 100, min: 0 },
    poster: {
      type: ObjectId,
      ref: "file",
    },
    type: {
      type: String,
      enum: Object.values(productTypes),
    },
  },
  { timestamps: true }
);
// Pre-find hook to populate fields
schema.pre(/^find/, preFindproduct);
// Post-find hook to update stock
// Decor Schema
const DecorSchema = new mongoose.Schema({
  colors: [
    {
      color: { type: ObjectId, ref: "color" },
      images: [{ type: ObjectId, ref: "file" }],
      stock: { type: Number, min: 0, default: 0 },
    },
  ],
});
// Clothes Schema
const clothesSchema = new mongoose.Schema({
  colors: [
    {
      color: { type: ObjectId, ref: "color" },
      images: [{ type: ObjectId, ref: "file" }],
      sizes: [
        {
          size: { type: ObjectId, ref: "size" },
          stock: { type: Number, default: 0, min: 0 },
        },
      ],
    },
  ],
});
// Main product schema
export const productModel = mongoose.model("product", schema);
// Define discriminators for product types
export const DecorModel = productModel.discriminator("decor", DecorSchema);
export const ClothesModel = productModel.discriminator(
  "clothes",
  clothesSchema
);
