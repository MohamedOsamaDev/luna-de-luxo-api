import express from "express";

import {
  CutomProductSchemaVal,
  UpdateCutomProductSchemaVal,
  paramsIdVal,
} from "./customProduct.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import {
  addCustomProduct,
  deleteCustomProduct,
  getallCustomProducts,
  getOneCustomProduct,
  updateCustomProduct,
} from "./customProduct.controller.js";
import { fileUploadSingle } from "../../utils/FileUpload.js";

const customProductRouter = express.Router();

customProductRouter
  .route("/")
  .post(
    fileUploadSingle("file"),
    validation(CutomProductSchemaVal),
    protectedRoutes,
    AttributedTo,
    addCustomProduct
  )
  .get(getallCustomProducts);
customProductRouter
  .route("/:id")
  .get(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    getOneCustomProduct
  )
  .put(
    validation(UpdateCutomProductSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateCustomProduct
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteCustomProduct
  );
export { customProductRouter };
