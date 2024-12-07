import express from "express";

import {
  updateuser,
  deleteUser,
  createuser,
  getAllUsers,
  findOneUser,
} from "./user.controller.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";

import { userInsertVal, userUpdateVal } from "./user.vailadtion.js";
import { checkEmailuser } from "../../middleware/auth/checkUser.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { cacheResponse } from "../../middleware/cache/cache.js";
const UserRouter = express.Router();

UserRouter.route("/")
  .post(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(userInsertVal),
    AttributedTo,
    checkEmailuser,
    createuser
  )
  .get(
    protectedRoutes,
    authorized(enumRoles?.admin),
    cacheResponse({ stdTTL: "4h", group: true }),
    getAllUsers
  );
UserRouter.route("/:id")
  .get(
    protectedRoutes,
    authorized(enumRoles.admin),
    cacheResponse({ stdTTL: "4h", group: true }),
    findOneUser
  )
  .put(
    validation(userUpdateVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateuser
  ) // update user
  .delete(protectedRoutes, authorized(enumRoles.admin), deleteUser); // delete user

export { UserRouter };
