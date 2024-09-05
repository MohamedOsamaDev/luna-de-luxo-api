import mongoose from "mongoose";
import { SingleTypeModel } from "./singleType";

// products_Page Schema
const warningSchema = new mongoose.Schema({
    publish: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  });
  export const warningPageModel = SingleTypeModel.discriminator(
    "warning",
    warningSchema
  );