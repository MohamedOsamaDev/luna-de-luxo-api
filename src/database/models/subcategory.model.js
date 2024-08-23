import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    description: {
      type: String,
      trim: true,
      minLength: [1, "too short brand name"],
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    publish: { type: Boolean, default: false, default: false },
    poster: { type: ObjectId, ref: "file" },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

// Pre-find hook to automatically populate images field
schema.pre(/^find/, function (next) {
  this.populate({
    path: "poster",
    model: "file",
    select: "_id url mimetype", // Example fields to select from the 'color' model
  });
  next();
});

export const SubCategoryModel = mongoose.model("subcategory", schema);
