import express from "express";
import { validation } from "../../middleware/globels/validation.js";
import {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
  getFilters,
} from "./product.controller.js";
import {
  ProductSchemaVal,
  UpdateproductSchemaVal,
  paramsIdVal,
  paramsSlugVal,
} from "./product.validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
import { cacheResponse } from "../../middleware/cache/cache.js";

const productRouter = express.Router();
// productRouter.use(cacheResponse()); // this is way to cache globally for product router
productRouter
  .route("/")
  .post(
    validation(ProductSchemaVal), // check validation
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addproduct
  )
  .get(cacheResponse({ stdTTL: "2h" }), tokenDetector, getallproduct);

productRouter.get("/filters", cacheResponse({ stdTTL: "4h" }), getFilters);

productRouter
  .route("/:id")
  .put(
    validation(UpdateproductSchemaVal), // check validation
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateproduct // finally update product
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteproduct
  )
  .get(
    cacheResponse(),
    validation(paramsSlugVal),
    tokenDetector,
    getOneproduct
  );

export { productRouter };
