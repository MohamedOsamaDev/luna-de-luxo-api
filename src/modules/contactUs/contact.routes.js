import express from "express";
import {
  ContactVal,
  paramsIdVal,
} from "./contact.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addOneContact,
  getOneContact,
  getAllContacts,
  deleteOneContact,
} from "./contact.controller.js";

import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";

const contactRouter = express.Router();

contactRouter
  .route("/")
  .post(
    validation(ContactVal),
    addOneContact
  )
  .get(
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    getAllContacts
  );


  contactRouter
  .route("/:id")
  .get(protectedRoutes,  authorized(enumRoles.admin), getOneContact)
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    deleteOneContact
  );


export default contactRouter;
