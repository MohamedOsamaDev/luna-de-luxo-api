import express from "express";
import {
  createCheckOutSession,
  cancelCheckOutSession,
  getAllOrders,
  getSpecificOrder,
  updateOrder,
  verfiyOrder,
  webhookOrders_Stripe,
} from "./order.controller.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { makeOrder } from "../../middleware/orders/makeOrder.js";
import { validation } from "../../middleware/globels/validation.js";
import { updateOrderVal } from "./order.validation.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { webhookStripe } from "../../middleware/orders/webHook.stripe.js";
import webHookRouter from "../webhook/webhook.routes.js";
import { sessionVaildtator } from "../../middleware/orders/sessionVaildtator.js";

const orderRouter = express.Router();
orderRouter.route("/").get(protectedRoutes, getAllOrders);

orderRouter
  .route("/:id")
  .all(protectedRoutes) // This applies the `protectedRoutes` middleware to all HTTP methods for this route
  .get(getSpecificOrder)
  .put(
    validation(updateOrderVal),
    authorized(enumRoles.admin),
    AttributedTo,
    updateOrder
  );
// getway endpoints
orderRouter
  .route("/getway")
  .all(protectedRoutes) // This applies the `protectedRoutes` middleware to all HTTP methods for this route
  .post(sessionVaildtator, makeOrder, createCheckOutSession);
orderRouter.delete("/getway/:session", protectedRoutes, cancelCheckOutSession);
orderRouter.get("/checkout/success", verfiyOrder);
// webhook
webHookRouter.post("/orders/stripe", webhookStripe, webhookOrders_Stripe);

export default orderRouter;
