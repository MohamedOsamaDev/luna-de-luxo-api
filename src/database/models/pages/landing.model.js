import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";

// landing_Page Schema
const landingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: [1, "too short brand name"],
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
  sliderLanding: [
    {
      title: {
        type: String,
        trim: true,
        required: true,
        minLength: [1, "too short brand name"],
      },
      description: {
        type: String,
        trim: true,
        minLength: [1, "too short brand name"],
        required: true,
      },
      poster: { type: ObjectId, ref: "file" },
      linkTitle: {
        type: String,
        trim: true,
      },
      linkHref: {
        type: String,
        trim: true,
      },
    },
  ],
  topCategoriesSection: {
    title: { 
      type: String, 
      required: true 
    },
    topCategories: [{ type: ObjectId, ref: "category" }],
  },
  featuredProductsSection: {
    title: { 
      type: String, 
      required: true 
    },
    featuredProducts: [{ type: ObjectId, ref: "product" }],
  },
  // topCategories: [{ type: ObjectId, ref: "category" }],
  // featuredProducts: [{ type: ObjectId, ref: "product" }],
  newIn: {
    poster: { type: ObjectId, ref: "file" },
    title: {
      type: String,
      trim: true,
    },
    linkTitle: {
      type: String,
      trim: true,
    },
    linkHref: {
      type: String,
      trim: true,
    },
  },
  customProduct: {
    title: {
      type: String,
      trim: true,
      required: true,
      minLength: [1, "Custom product title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minLength: [1, "Custom product description is required"],
    },
    poster: { type: ObjectId, ref: "file" },
  },
});
landingSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "topCategoriesSection.topCategories",
      model: "category",
      select: "_id name poster slug", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    },
    {
      path: "featuredProductsSection.featuredProducts",
      model: "product",
      select: "_id name slug poster",
      options: { strictPopulate: false },
      match: { isFeatured: true }, // Only include products that are featured
    },
    {
      path: "sliderLanding.poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    },
    {
      path: "newIn.poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    },
    {
      path: "customProduct.poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    },
  ]);
  next();
});
export const landingPageModel = SingleTypeModel.discriminator(
  "landing",
  landingSchema
);
