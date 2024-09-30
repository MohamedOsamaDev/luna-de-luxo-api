import { cartModel } from "../../database/models/cart.model.js";
import SetCookie from "../../utils/SetCookie.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const checkCart = AsyncHandler(async (req, res, next) => {
  let cart = null;
  if (req?.user) {
    cart = req?.user?.cart;
  } else if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      cart = await cartModel.findOne({ _id: decoded?.cart }).lean();
    } catch (error) {}
  }

  if (!cart) {
    cart = new cartModel({
      items: [],
    });
    if (req?.user?._id) {
      cart.user = req?.user?._id;
    } else {
      res.cookie("cart", jwt.sign({ cart: cart._id }, process.env.SECRETKEY),SetCookie());
    }
    await cart.save();
  }
  req.cart = cart;
  return next();
});
