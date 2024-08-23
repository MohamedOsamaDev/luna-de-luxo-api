import mongoose, { Schema } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    publish: { type: Boolean, default: false, default: false },
  },
  {
    timestamps: true,
  }
);


export const colorModel = mongoose.model("color", schema);
