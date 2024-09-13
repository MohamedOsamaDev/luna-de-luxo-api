import mongoose, { Schema, model } from "mongoose";
import { allPayments } from "../../config/payments.js";
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    session: {
     id:{
      type: String,
     },
     url:{
      type: String,
     }
    },
    getwayProvidor: {
      type: String,
      enum:allPayments,
    },
    order :{ type: ObjectId, ref: "user" },
    user: { type: ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);
export const getwaySessionModel = mongoose.model("getwaySession", schema);
// after create getway Session
// hold on target orderItems and target product qty
