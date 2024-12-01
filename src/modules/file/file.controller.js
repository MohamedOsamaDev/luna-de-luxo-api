import { FileModel } from "../../database/models/file.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { Uploader, cloudinary, deleteFileCloudinary } from "../../utils/cloudnairy.js";
import { FindAll, FindOne } from "../handlers/crudHandler.js";

const Errormassage = "file not found";
const Insert = AsyncHandler(async (req, res, next) => {
  const { file } = req.files;
  const result = await Uploader(file.path);
  let newFile = {
    ...result,
    filename: file?.filename,
    size: file?.size,
    mimetype: file?.mimetype,
    originalname: file?.originalname,
  };
  const data = await FileModel.create(newFile);
  return res.status(201).json({
    data,
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
};
const GetAll = FindAll(config);
const GetOne =  FindOne(FileModel, Errormassage)
const postTikets = AsyncHandler(async (req, res, next) => {
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

export { Insert, GetAll, GetOne, Delete, postTikets };

// if (!files || files === 0) {
//   return next(new AppError("No files uploaded", 400));
// }
// let failedfiles = [];
// let uploadResults = await Promise.all(
//   files.map(async (file) => {
//     try {
//       const result = await Uploader(file.path);
//       return {
//         ...result,
//         filename: file?.filename,
//         size: file?.size,
//         mimetype: file?.mimetype,
//         originalname: file?.originalname,
//       };
//     } catch (error) {
//       failedfiles.push(file.originalname);
//       return null; // Return null or handle the error as needed
//     }
//   })
// );

// uploadResults = uploadResults?.filter(Boolean);

// if (!uploadResults?.length) return next(new AppError("upload failed", 400));
