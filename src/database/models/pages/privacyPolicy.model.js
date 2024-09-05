import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";

const privacyPolicySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Title is required"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Description is required"],
    },
    parts: [
      {
        partTitle: {
          type: String,
          required: true,
          trim: true,
          minLength: [1, "Part title is required"],
        },
        partDescription: {
          type: String,
          required: true,
          trim: true,
          minLength: [1, "Part description is required"],
        },
        subSections: [
          {
            subSectionTitle: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Sub-section title is required"],
            },
            subSectionContent: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Sub-section content is required"],
            },
          },
        ],
      },
    ],
    updatedBy: {
      type: ObjectId,
      ref: "user",
    },
    createdBy: {
      type: ObjectId,
      ref: "user",
    },
  });
  
  export const privacyPolicyPageModel = SingleTypeModel.discriminator(
    "privacy_policy",
    privacyPolicySchema
  );