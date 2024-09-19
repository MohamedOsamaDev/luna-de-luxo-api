import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const schema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedAt: Date,
    phone: { type: String, trim: true },
    OTP: { type: Number },
    isresetPassword: { type: Date },
    role: {
      type: String,
      enum: [...Object.values(enumRoles)],
      default: enumRoles?.user,
    },
    confirmEmail: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    addresses: [
      {
        street: String,
        phone: String,
        city: String,
      },
    ],
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  next();
});
schema.pre("findOneAndUpdate", async function (next) {
  // Check if password is being updated
  const update = this.getUpdate();
  if (update && update?.password) {
    update.password = bcrypt.hashSync(update.password, 8);
  }
  next();
});

// Virtual populate for cart
schema.virtual("cart", {
  ref: "cart",
  localField: "_id",
  foreignField: "user",
  justOne: true, // Ensures the virtual field returns an object instead of an array
});

// Virtual populate for influencer
schema.virtual("influencer", {
  ref: "influencer",
  localField: "_id",
  foreignField: "relatedTo",
  justOne: true, // Ensures the virtual field returns an object instead of an array
});

// Ensure virtual fields are serialized
schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

// Middleware to populate related fields on find queries
const autoPopulateFields = function (next) {
  this.populate({
    path: "updatedBy",
    select: "fullName _id",
  });
  next();
};

//schema.pre(/^find/, autoPopulateFields);

export const UserModel = mongoose.model("user", schema);
