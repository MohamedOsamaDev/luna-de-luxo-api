
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFileCloudinary, Uploader } from "../../utils/cloudnairy.js";

import { customProductModel } from '../../database/models/customProduct.model.js';
import {
  FindAll,
  FindOne,
  updateOne,
} from "../handlers/crudHandler.js";

const Errormassage = "Custom Product not found";
const addCustomProduct = AsyncHandler(async (req, res, next) => {
  const { file } = req.files;
  const result = await Uploader(file.path);

  let customProduct = {
   poster: {
    ...result
    },
    description: req.body.description
  };

  const document = new customProductModel(customProduct);
  await document.save();

  res.status(200).json({
    message: "Sucessfully Requested! We will message you :)",
  });
});

let config = {
  model: customProductModel,
  name: "customProduct",
};
const getallCustomProducts = FindAll(config);
const getOneCustomProduct = FindOne(customProductModel, Errormassage);
const updateCustomProduct = updateOne(customProductModel, Errormassage, "name");
const deleteCustomProduct = AsyncHandler(async (req, res, next) => {
  const deletedFile = await customProductModel.findByIdAndDelete(req.params.id);

  if (!deletedFile) {
    return next(new AppError("file not found", 404));
  }
  await deleteFileCloudinary(deletedFile?.poster.public_id);
  res.status(200).json({
    message: "File deleted successfully",
  });
});

export {
  addCustomProduct,
  getallCustomProducts,
  getOneCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
};
