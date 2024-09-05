import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";

const legalSchema = new mongoose.Schema({
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
    contentBlocks: [
      {
        header: {
          type: String,
          required: true,
          trim: true,
          minLength: [1, "Header is required"],
        },
        body: {
          type: String,
          required: true,
          trim: true,
          minLength: [1, "Body content is required"],
        },
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
  
  export const legalPageModel = SingleTypeModel.discriminator(
    "legal",
    legalSchema
  );