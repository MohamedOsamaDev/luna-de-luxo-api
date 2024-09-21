import jwt from "jsonwebtoken";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { UserModel } from "../../database/models/user.model.js";
import { getUserAndVerify } from "../../modules/auth/auth.services.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

export const tokenDetector = (config = {}) =>
  AsyncHandler(async (req, res, next) => {
    const checkIfRoleUser = config?.user;
    const checkIfRoleAdmin = config?.admin;
    // 1-token is exist or not
    let decodeReq = req.decodeReq;
    // 2-verfiy decodeReq

    const requireAuth =
      (decodeReq?.role === enumRoles.admin && checkIfRoleAdmin) ||
      (decodeReq?.role === enumRoles.user && checkIfRoleUser);  
    if (decodeReq && requireAuth) {
      const user = await getUserAndVerify(decodeReq);
      if (!user) return next(new AppError(httpStatus.Forbidden));
      req.user = user;
      return next();
    } else {
      return next();
    }
  });
