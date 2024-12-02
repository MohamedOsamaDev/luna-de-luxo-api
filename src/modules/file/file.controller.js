import { FileModel } from "../../database/models/file.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  Uploader,
  cloudinary,
  deleteFileCloudinary,
} from "../../utils/cloudnairy.js";
import { FindAll, FindOne } from "../handlers/crudHandler.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const savedFileDocuments = await FileModel.create(req?.body);
  return res.status(201).json({
    savedFileDocuments,
    message: "file uploaded successfully",
  });
});
const Delete = AsyncHandler(async (req, res, next) => {
  const deletedFile = await FileModel.findByIdAndDelete(req.params.id);

  if (!deletedFile) {
    return next(new AppError("file not found", 404));
  }
  await deleteFileCloudinary(deletedFile?.public_id);
  return res.status(200).json({
    message: "File deleted successfully",
  });
});
let config = {
  model: FileModel,
  name: "file",
  options: {
    searchFeilds: ["filename"],
  },
};
const GetAll = FindAll(config);
const GetOne = FindOne(config);
const postTiket = AsyncHandler(async (req, res, next) => {
  const timestamp = Math?.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    cloudinary.config().api_secret
  );
  return res.status(201).json({
    signature,
    api_key: cloudinary.config().api_key,
    cloud_name: cloudinary.config().cloud_name,
    timestamp,
  });
});

export { Insert, GetAll, GetOne, Delete, postTiket };
