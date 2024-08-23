import jwt from "jsonwebtoken";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { UserModel } from "../../database/models/user.model.js";
import { getUserAndVerify } from "../../modules/auth/auth.services.js";

export const tokenDetector = AsyncHandler(async (req, res, next) => {
  // 1-token is exist or not
  let token = req.headers.token || req.cookies.token;
  // 2-verfiy token
  if (token) {
    const user = await getUserAndVerify(token);
    if (!user) return next(new AppError(httpStatus.Forbidden));
    req.user = user;
    return next();
  } else {
    return next();
  }
});
