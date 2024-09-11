import express from "express";
import {
  createCheckOutSession,
  createOrder,
  getAllOrders,
  getSpecificOrder,
  updateOrder,
  verfiyOrder,
  webhookOrders,
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

const orderRouter = express.Router();
orderRouter.route("/").get(protectedRoutes, getAllOrders);

orderRouter.post("/getway", protectedRoutes, makeOrder, createCheckOutSession);
orderRouter
  .route("/:id")
  .get(protectedRoutes, getSpecificOrder)
  .put(
    validation(updateOrderVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updateOrder
  );
  orderRouter.get("/checkout/success", verfiyOrder)
// webhook
webHookRouter.post("/orders/stripe", webhookStripe, webhookOrders);

export default orderRouter;
