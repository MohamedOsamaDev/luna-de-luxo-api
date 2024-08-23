import mongoose, { Schema, model } from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    sessionID: {
      type: String,
    },
    getwayProvidor: {
      type: String,
      enum: ["paybal", "stripe"],
    },
    cartItems: [{}],
    order: {},
    user: { type: ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);
export const getwaySessionModel = mongoose.model("getwaySession", schema);
// after create getway Session
// hold on target orderItems and target product qty
