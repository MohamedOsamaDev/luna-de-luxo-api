import mongoose from "mongoose";
const customProductSchema = new mongoose.Schema(
  {
    poster: {
      url: {
        type: String, // Storing URL or file identifier
        required: true,
        message: "Reference image is required",
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Description is required"],
      maxLength: [5000, "Description cannot exceed 5000 characters"],
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

export const customProductModel = mongoose.model(
  "customProduct",
  customProductSchema
);
