import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType";

const careServiceSchema = new mongoose.Schema(
  {
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

export const CareServiceModel = SingleTypeModel.discriminator(
  "care_service",
  careServiceSchema
);
