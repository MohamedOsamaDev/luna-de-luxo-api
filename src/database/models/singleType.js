import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true, // Ensure key is unique
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    createdBy: { type: ObjectId, ref: "user" },
    updatedBy: { type: ObjectId, ref: "user" },
    publish: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// schema.pre(/^find/, function (next) {
//   this.populate({
//     path: "topCategoriesSection.topCategories",
//     model: "category",
//     select: "_id name poster slug", // Example fields to select from the 'color' model
//     options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//   })
//     .populate({
//       path: "sliderLanding.poster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "newInPoster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "customProductPoster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "poster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "visionPoster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "missionPoster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "categories.poster",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "categories.category",
//       model: "category",
//       select: "_id name description", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "categories.content.image",
//       model: "file",
//       select: "_id url", // Example fields to select from the 'color' model
//       options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
//     })
//     .populate({
//       path: "featuredProductsSection.featuredProducts",
//       model: "product",
//       select: "_id name poster price discount slug",
//       options: { strictPopulate: false },
//       match: { isFeatured: true }, // Only include products that are featured
//     });
//   next();
// });
export const SingleTypeModel = mongoose.model("singletype", schema);
