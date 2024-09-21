import express from "express";
import {
  sizeSchemaVal,
  updatesizeSchemaVal,
  
} from "./sizes.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addOneSize,
  updateOneSize,
  getOneSize,
  getAllSizes,
  deleteOneSize,
} from "./sizes.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
import { paramsIdVal } from "../commens/validation.js";

const sizesRouter = express.Router();

sizesRouter
  .route("/")
  .post(
    validation(sizeSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addOneSize
  )
  .get(    tokenDetector({
    admin: true,
  }), getAllSizes);

sizesRouter
  .route("/:id")
  .get(    tokenDetector({
    admin: true,
  }), getOneSize)
  .put(
    validation(updatesizeSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateOneSize
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteOneSize
  );

export default sizesRouter;
