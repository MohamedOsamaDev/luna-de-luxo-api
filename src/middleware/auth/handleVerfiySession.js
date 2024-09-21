import { cartModel } from "../../database/models/cart.model.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const handleVerfiySession = AsyncHandler(async (req, res, next) => {
  const token = req.headers.token || req.params.token || req.cookies.token;
  if (!token) {
    let cart = [];
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      if (decoded?.cart) {
        cart = await cartModel.findById(decoded?.cart);
      }
    } catch (error) {}
    return res.status(200).json({ cart });
  }
  return next();
});
