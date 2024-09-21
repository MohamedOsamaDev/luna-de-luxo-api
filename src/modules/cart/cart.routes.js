import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getLoggedCart,
  removeItemCart,
  boundary,
} from "./cart.controller.js";
import { addCartVal, paramsIdVal } from "./cart.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { checkCart } from "../../middleware/cart/checkCart.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
const cartRouter = express.Router();
cartRouter
  .route("/")
  .post(
    tokenDetector({
      user: true,
    }),
    validation(addCartVal),
    checkCart,
    addToCart
  )
  .get(
    tokenDetector({
      user: true,
    }),
    checkCart,
    getLoggedCart
  )
  .patch(
    tokenDetector({
      user: true,
    }),
    checkCart,
    clearCart
  );

cartRouter
  .route("/:id")
  .put(tokenDetector, validation(paramsIdVal), removeItemCart);

export default cartRouter;
