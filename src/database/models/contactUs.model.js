import mongoose, { Schema } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, trim: true, required: true },
    mobile: { type: String, required: true },
    message: {
      type: String,
      trim: true,
      minLength: [2, "too short"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const contactModel = mongoose.model("contact", schema);
