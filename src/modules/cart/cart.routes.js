import express from "express";
import {
  addToCart,
  clearCart,
  getLoggedCart,
  removeItemCart,
} from "./cart.controller.js";
import { addCartVal, paramsIdVal } from "./cart.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { checkCart } from "../../middleware/cart/checkCart.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
const cartRouter = express.Router();
const authConfig = {
  admin: true,
  user: true,
}
cartRouter
  .route("/")
  .post(
    tokenDetector(authConfig),
    authorized(enumRoles.public, enumRoles.user),
    validation(addCartVal),
    checkCart,
    addToCart
  )
  .get(
    tokenDetector({
      user: true,
    }),
    authorized(enumRoles.public, enumRoles.user),
    checkCart,
    getLoggedCart
  )
  .patch(
    tokenDetector(authConfig),
    authorized(enumRoles.public, enumRoles.user),
    checkCart,
    clearCart
  );

cartRouter.route("/:id").put(
  tokenDetector(authConfig),
  authorized(enumRoles.public, enumRoles.user),
  validation(paramsIdVal),
  removeItemCart
);

export default cartRouter;
