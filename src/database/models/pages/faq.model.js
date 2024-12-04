// Q&A_Page Schema

import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";
import { pageMetadata, pageMetadataPopulate } from "../../Commons.js";

// FAQ Schema
const faqSchema = new mongoose.Schema({
  pageMetadata,
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
  categories: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Category name is too short"],
      },
      questions: [
        {
          question: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Question is too short"],
          },
          answer: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Answer is too short"],
          },
        },
      ],
    },
  ],

});
faqSchema.pre(/^find/, function (next) {
  this.populate([
    pageMetadataPopulate
  ]);
  next();
});

// FAQ Model
export const faqPageModel = SingleTypeModel.discriminator("faq", faqSchema);
