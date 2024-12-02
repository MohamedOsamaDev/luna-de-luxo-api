import multer from "multer";
import { v4 as uuid } from "uuid";
export const Upload = () => {
  const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //   cb(null, "uploads/");
    // },
    // filename: (req, file, cb) => {
    //   cb(null, uuid() + "-" + file.originalname);
    // },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("image only", 401), false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
    // limits: { fileSize: 100000 /* bytes */ },
  });
  return upload;
};
export const fileUploadSingle = (feildname) => Upload().single(feildname);
export const fileUploadArray = (array, max = 10000000000) =>
  Upload().array(array, max);
export const fileUploadfields = (fields) => Upload().fields(fields);
