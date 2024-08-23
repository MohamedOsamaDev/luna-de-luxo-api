import mongoose, { Schema } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema({
  name: {
    type: String,
    unique: [true, "name is required"],
    trim: true,
    required: true,
    minLength: [1, "too short name"],
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
  createdBy: { type: ObjectId, ref: "user" },
  updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  publish: { type: Boolean, default: false, default: false },
},{
  timestamps: true,
});

export const sizeModel = mongoose.model("size", schema);
