import express from "express";
import {
  couponSchemaVal,
  updateCouponSchemaVal,
  paramsIdVal,
} from "./coupon.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addOneCoupon,
  updateOneCoupon,
  getOneCoupon,
  getAllCoupons,
  deleteOneCoupon,
  verifyCoupon,
} from "./coupon.controller.js";

import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
const couponRouter = express.Router();

couponRouter.get("/verify", protectedRoutes, verifyCoupon);

couponRouter
  .route("/")
  .post(
    validation(couponSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    addOneCoupon
  )
  .get(
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    getAllCoupons
  );


couponRouter
  .route("/:id")
  .get(protectedRoutes, getOneCoupon)
  .put(
    validation(updateCouponSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateOneCoupon
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    deleteOneCoupon
  );


export default couponRouter;
