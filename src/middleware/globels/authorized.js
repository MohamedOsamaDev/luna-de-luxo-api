import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const authorized = (...permissions) => {
  const permissionsAfterFormated = permissions?.filter(Boolean);
  return AsyncHandler(async (req, res, next) => {
    const role = req?.user?.role || enumRoles.public;
    if (!permissionsAfterFormated.includes(role))
      return next(new AppError(httpStatus.unAuthorized));
    next();
  });
};
