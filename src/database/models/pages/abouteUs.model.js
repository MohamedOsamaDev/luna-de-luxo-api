import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";
import { FilePopulate, pageMetadata, pageMetadataPopulate } from "../../Commons.js";

// about_us_Page Schema
const aboutUsSchema = new mongoose.Schema({
  pageMetadata,
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Title is required"],
    maxLength: [150, "Title cannot exceed 150 characters"],
  },
  subtitle: {
    type: String,
    trim: true,
    maxLength: [150, "Subtitle cannot exceed 150 characters"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Description is required"],
    maxLength: [5000, "Description cannot exceed 5000 characters"],
  },
  mission: {
    missionStatement: {
      type: String,
      trim: true,
      minLength: [1, "Mission statement is required"],
      maxLength: [2000, "Mission statement cannot exceed 2000 characters"],
    },
    missionPoster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
      required: false,
      message: "Mission poster image is optional",
    },
  },
  vision: {
    visionStatement: {
      type: String,
      trim: true,
      minLength: [1, "Vision statement is required"],
      maxLength: [500, "Vision statement cannot exceed 500 characters"],
    },
    visionPoster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
      required: false,
      message: "Vision poster image is optional",
    },
  },
  poster: { type: ObjectId, ref: "file" },
});
aboutUsSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "mission.missionPoster",
      ...FilePopulate,
    },
    {
      path: "poster",
      ...FilePopulate,
    },
    {
      path: "vision.visionPoster",
      ...FilePopulate,
    },
    pageMetadataPopulate,
  ]);
  next();
});
export const aboutPageModel = SingleTypeModel.discriminator(
  "about_us",
  aboutUsSchema
);
