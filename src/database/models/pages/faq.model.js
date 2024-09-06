// Q&A_Page Schema

import mongoose from "mongoose";
import { SingleTypeModel } from "../singleType.js";
import { ObjectId } from "../order.model.js";

// FAQ Schema
const faqSchema = new mongoose.Schema({
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

// FAQ Model
export const faqPageModel = SingleTypeModel.discriminator("faq", faqSchema);
