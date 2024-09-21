import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { getUserAndVerify } from "../../modules/auth/auth.services.js";

export const protectedRoutes = AsyncHandler(async (req, res, next) => {
  // 1- Check if token exists
  const decodeReq = req.decodeReq;
  if (!decodeReq) return next(new AppError(httpStatus.unAuthorized));
  const user = await getUserAndVerify(decodeReq);
  if (!user) return next(new AppError(httpStatus.Forbidden));
  req.user = user;
  return next();
});
