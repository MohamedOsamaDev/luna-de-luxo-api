import httpStatus from "../../assets/messages/httpStatus.js";
import { allPagesConfig } from "../../modules/page/page.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const pageVaildtion = AsyncHandler(async (req, res, next) => {
  const key = req?.params?.key;
  const mode = req?.method?.toUpperCase() === "POST" ? "create" : "update";
  const schema = allPagesConfig?.[key]?.validation?.[mode];
  if (!schema) return next(new AppError(httpStatus.NotFound));
  const { error } = schema.validate({ ...req.body }, { abortWarly: false });
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
});
