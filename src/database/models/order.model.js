import mongoose, { Schema } from "mongoose";
import {  allPaymentsTypes } from "./../../config/payments.js";

export const ObjectId = mongoose.Schema.Types.ObjectId;
const items = new Schema({
  original_id: { type: ObjectId, ref: "product" },
  name: String,
  price: { type: Number, default: 0 }, // Price at the time of ordering
  discount: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  poster: String,
  selectedOptions: {},
  id: { type: ObjectId },
  type: String,
});
const couponSchema = new Schema({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  original_id: { type: ObjectId, ref: "coupon", required: true },
});

const overviewPricesSchema = new Schema({
  subtotal: { type: Number, min: 0, default: 0 }, // Total of all item prices before any discounts
  discount: { type: Number, min: 0, default: 0 }, // Total discount applied
  shipping: { type: Number, min: 0, default: 0 }, // Shipping cost
  total: { type: Number, min: 0, default: 0 }, // Total price after all calculations
  finalTotal: { type: Number, min: 0, default: 0 }, // Final amount to be paid
});

const schema = new Schema(
  {
    user: { type: ObjectId, ref: "user", required: true },
    items: [items],
    totalOrderPrice: { type: Number, min: 0, default: 0, required: true },
    overviewPrices: overviewPricesSchema,
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
    },
    paymentType: {
      type: String,
      enum: Object.keys(allPaymentsTypes),
      default: allPaymentsTypes.COD,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "delivered", "canceled"],
      default: "pending",
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    paidAt: Date,
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    coupon: couponSchema,
    notes: {
      type: String,
      default: "",
      max: 500,
    }
  },
  { timestamps: true }
);
export const orderModel = mongoose.model("order", schema);
