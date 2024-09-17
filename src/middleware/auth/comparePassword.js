import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";
import responseHandler from "../../utils/responseHandler.js";

export const comparePassword = async (req, res, next) => {
  const { newpassword, currentpassword } = req.body;
  if (!bcrypt.compareSync(currentpassword, req?.user?.password))
    return next(
      new AppError(
        responseHandler("badRequest", undefined, "current password wrong.")
      )
    );
  if (bcrypt.compareSync(newpassword, req?.user?.password))
    return next(
      new AppError(
        responseHandler(
          "conflict",
          undefined,
          "The password cannot be changed because it is the same as the current password"
        )
      )
    );
  return next();
};
