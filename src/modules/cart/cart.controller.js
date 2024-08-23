import { cartModel } from "../../database/models/cart.model.js";
import { productModel } from "../../database/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "../../database/models/coupon.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import jwt from "jsonwebtoken";
import httpStatus from "../../assets/messages/httpStatus.js";
import responseHandler from "../../utils/responseHandler.js";

const addToCart = AsyncHandler(async (req, res, next) => {
  let product = await productModel.findById(req?.body?.product);
  if (!product)
    return next(new AppError(responseHandler("NotFound", "product")));
  const { color = null, size = null, quantity = null } = req.body;
  let cart = req?.cart;
  const item = cart.items.find(
    (v) =>
      v?.product?._id?.toString() === product?._id?.toString() &&
      v?.color?._id?.toString() === color?.toString() &&
      v?.size?._id?.toString() === size?.toString()
  );
  if (item) {
    item.quantity = quantity || +item?.quantity + 1;
  } else {
    cart.items.push({
      product: req?.body?.product,
      color,
      size,
    });
  }
  const data = await cartModel.findByIdAndUpdate(
    cart?._id,
    { ...cart },
    {
      new: true,
    }
  );
  res.status(200).json(data);
});
const removeItemCart = AsyncHandler(async (req, res, next) => {
  let query = req?.user?._id ? { user: req.user._id } : null;
  if (!query) {
    jwt.verify(
      req.cookies.cart,
      process.env.SECRETKEY,
      async (err, decoded) => {
        if (decoded?.cart) {
          query = {
            _id: decoded?.cart,
          };
        }
      }
    );
  }
  if (!query) return next(new AppError(httpStatus.internalServerError));
  let cart = await cartModel.findOneAndUpdate(
    query,
    { $pull: { items: { _id: req?.params?.id } } },
    { new: true }
  );

  if (!cart) return next(new AppError(httpStatus.internalServerError));
  res.status(200).json(cart);
});
const getLoggedCart = AsyncHandler(async (req, res, next) => {
  let cart = req?.cart;
  res.json(cart);
});
const clearCart = AsyncHandler(async (req, res, next) => {
  let cart = req?.cart;
  cart.items = [];
  await cart.save();
  if (!cart) return next(new AppError(httpStatus.internalServerError));
  res.json(cart);
});
const applyCoupon = AsyncHandler(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.coupon,
    expires: { $gte: Date.now() },
  });
  if (!coupon)
    return next(new AppError({ message: "invalid coupon", code: 401 }));
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError(responseHandler("NotFound", "coupon")));
  let totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  cart.discount = coupon.discount;
  await cart.save();
  res.json({ message: "success", cart });
});
const boundary = AsyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "success" });
});

export {
  addToCart,
  removeItemCart,
  getLoggedCart,
  clearCart,
  applyCoupon,
  boundary,
};
