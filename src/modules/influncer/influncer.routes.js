import express from "express";
import {
  requestForBenfluencerVal,
  InfluncerVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
} from "./influncer.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  InsertOne,
  GetAll,
  requestForBenfluencer,
  Delete,
  Update,
  GetOne,
} from "./influncer.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";

const influncerRouter = express.Router();

influncerRouter
  .route("/request")
  .post(
    validation(requestForBenfluencerVal),
    protectedRoutes,
    requestForBenfluencer
  );

influncerRouter
  .route("/")
  .get(protectedRoutes, authorized(enumRoles.admin), AttributedTo, GetAll)
  .post(validation(InfluncerVal), protectedRoutes, AttributedTo, InsertOne);
influncerRouter
  .route("/:id")
  .get(protectedRoutes, GetOne)
  .put(
    validation(updateInfluncerSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Update
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Delete
  );

export default influncerRouter;
