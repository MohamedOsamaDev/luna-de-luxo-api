import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const authorized = (permissions) => {
  return AsyncHandler(async (req, res, next) => {
    if (!permissions.includes(req.user.role))
      return next(new AppError(httpStatus.unAuthorized));
    next();
  });
};
