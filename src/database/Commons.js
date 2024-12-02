import mongoose, { Schema } from "mongoose";

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const publish = { type: Boolean, default: false, default: false };
export const poster = { type: ObjectId, ref: "file" };
export const mainCard = {
  poster,
  title: String,
  description: String,
};

export const FilePopulate = {
  model: "file",
  options: { strictPopulate: false },
  select: "_id url mimetype thumbnail", // Example fields to select from the 'color' model
};
export const strictPopulate = { options: { strictPopulate: false } };
export const mongtext = {
  type: String,
  maxlength: 500,
};
export const mongeDescription = {
  type: String,
  maxlength: 20000,
};
export const attrbuitedTo = {
  createdBy: { type: ObjectId, ref: "user" },
  updatedBy: { type: ObjectId, ref: "user" },
};

export const schemaCommens = {
  publish: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: ObjectId, ref: "user" },
  updatedBy: { type: ObjectId, ref: "user" },
};

export const pageMetadata = new Schema({
  title: String,
  description: String,
  keywords: [String],
  images: [poster],
});
export const pageMetadataPopulate = {
  path: "pageMetadata.images",
  ...FilePopulate,
};
