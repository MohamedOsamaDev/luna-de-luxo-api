import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartItemSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "product", required: true },
  quantity: { type: Number, default: 1, min: 1 },
  color: { type: ObjectId, ref: "color" }, // Optional: to track specific color variants
  size: { type: ObjectId, ref: "size" }, // Optional: to track specific size variants
});

const schema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "user" },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

schema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
    model: "product",
    options: { strictPopulate: false },
  })
    .populate({
      path: "items.color",
      model: "color",
      options: { strictPopulate: false },
    })
    .populate({
      path: "items.size",
      model: "size",
      options: { strictPopulate: false },
    });
  next();
});

export const cartModel = mongoose.model("cart", schema);
