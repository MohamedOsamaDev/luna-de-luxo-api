import express from "express";
import {
  colorSchemaVal,
  updateColorSchemaVal,
  paramsIdVal,
} from "./colors.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addOneColor,
  DeleteOneColor,
  GetAllColors,
  UpdateOneColor,
  getOneColor,
} from "./colors.controller.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";

const colorsRouter = express.Router();

colorsRouter
  .route("/")
  .post(
    validation(colorSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addOneColor
  )
  .get(
    tokenDetector({
      admin: true,
    }),
    GetAllColors
  );

colorsRouter
  .route("/:id")
  .get(
    tokenDetector({
      admin: true,
    }),
    getOneColor
  )
  .put(
    validation(updateColorSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    UpdateOneColor
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    DeleteOneColor
  );

export default colorsRouter;
