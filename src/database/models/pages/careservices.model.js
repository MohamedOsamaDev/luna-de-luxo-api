import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";
import { FilePopulate, pageMetadata,pageMetadataPopulate } from "../../Commons.js";

const careServiceSchema = new mongoose.Schema(
  {
    pageMetadata,
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Title is required"],
      maxLength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Description is required"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    categories: [
      {
        category: {
          type: ObjectId,
          ref: "category",
          required: true,
        },
        poster: {
          type: ObjectId,
          ref: "file",
          required: true,
        },
        content: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Part title is required"],
            },
            description: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Part description is required"],
            },
            image: {
              type: ObjectId,
              ref: "file",
              required: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
careServiceSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "categories.poster",
      ...FilePopulate,
    },
    {
      path: "categories.category",
      model: "category",
      select: "_id name description", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    },
    {
      path: "categories.content.image",
      ...FilePopulate,
    },
    pageMetadataPopulate,
  ]);
  next();
});
export const CareServiceModel = SingleTypeModel.discriminator(
  "care_service",
  careServiceSchema
);
