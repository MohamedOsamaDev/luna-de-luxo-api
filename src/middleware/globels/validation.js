import { AppError } from "../../utils/AppError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let files = {};
    if (req.files || req.file) {
      files = req.files ? req.files : { [req.file.fieldname]: req.file };
      req.files = files;
    }  
    if (req?.files && Object.values(req?.files).length === 0)
      req.files = undefined;
    const { error } = schema.validate(
      { ...files, ...req.body, ...req.params, ...req.query },
      { abortWarly: false }
    );
    if (process.env.NODE_ENV === "dev") {
      console.log(error);
    }
    if (!error) {
      return next();
    } else {
      let message = [];
      error.details.forEach((val) => {
        message.push(val.message);
      });
      return next(new AppError({ message, code: 400 }));
    }
  };
};
