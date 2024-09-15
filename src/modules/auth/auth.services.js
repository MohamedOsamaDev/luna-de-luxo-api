import jwt from "jsonwebtoken";
import { cartModel } from "../../database/models/cart.model.js";
import { productModel } from "../../database/models/product.model.js";
import SetCookie from "../../utils/SetCookie.js";
import { UserModel } from "../../database/models/user.model.js";
import { delay } from "../../utils/delay.js";

const handleMerageCartItems = (items1 = [], items2 = []) => {
  let array = [...items1, ...items2];
  array.forEach((val, ind) => {
    let isDeublicated = array.find(
      (val2, ind2) =>
        val?.product?._id.toString() === val2?.product?._id.toString() &&
        val?.color?._id.toString() === val2?.color?._id.toString() &&
        val?.size?._id.toString() === val2?.size?._id.toString() &&
        ind !== ind2
    );
    if (isDeublicated) {
      isDeublicated.quantity += val?.quantity;
      array.splice(ind, 1);
    }
  });

  array.forEach((val, ind) => {
    // val.product = val?.product?.id || null;
    delete val["_id"];
  });

  return array;
};
const handleproductIsAvailable = async (items) => {
  if (!items || items.length === 0) return [];

  const productIds = items.map((item) => item.product?._id);
  const products = await productModel.find({ _id: { $in: productIds } });

  return items.map((item) => {
    const product = products.find((product) =>
      product._id.equals(item.product._id)
    );
    return product ? { ...item, product } : item;
  });
};
export const handleConnectCart = async (user, req, res) => {
  let cart = user?.cart;
  if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      if (decoded?.cart) {
        const localCart = await cartModel.findByIdAndDelete(decoded.cart, {
          new: true,
        });
        if (localCart) {
          cart = await cartModel.findByIdAndUpdate(
            cart?._id,
            {
              items: handleMerageCartItems(localCart?.items, cart?.items),
              user,
            },
            {
              new: true,
            }
          );
          res.cookie("cart", "", SetCookie({ maxAge: 0 }));
          return cart;
        }
      }
    } catch (err) {}
  }
  return cart;
};
export const handleCartSignIn = async (user, req, res) => {
  let cart = null;
  if (req.cookies.cart) {
    try {
      const decoded = jwt.verify(req.cookies.cart, process.env.SECRETKEY);
      cart = cartModel.findByIdAndUpdate(
        decoded?.cart,
        { user: user._id },
        { new: true }
      );
      res.cookie("cart", "", SetCookie({ maxAge: 0 }));
    } catch (error) {}
  }
  if (!cart) {
    cart = await cartModel.create({ user });
  }
  return cart;
};
export const decodeJwt = (key = "", signature = "") => {
  try {
    // Verify token
    return jwt.verify(key, signature);
  } catch (error) {
    // Token verification failed or some other error occurred
    return false;
  }
};
export const detectJwtAndDecodeJwtFromRequest = (req) => {
  const token =
    req?.headers?.token || req?.params?.token || req?.cookies?.token;
  if (!token) return false;
  // Verify token
  const decoded = decodeJwt(token, process.env.SECRETKEY);
  // Check if token is expired
  if (!decoded) return false;
  return { decoded, token };
};
export const getUserAndVerify = async (decodeReq) => {
  try {
    if (!decodeReq) return false;
    // Check if user exists
    const user = await UserModel.findById(decodeReq._id)
      .populate([{ path: "cart" }, { path: "influencer", populate: { path: 'coupon', select: ' expires code discount' } }])
      .lean()
      .exec();
    // Check if user exists, is not blocked, and has a valid token
    if (!user || user.isblocked) return false;

    if (user.passwordChangedAt) {
      const passwordChangedAtTime = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );
      if (passwordChangedAtTime > decoded.iat) return false;
    }

    return user;
  } catch (error) {
    // Token verification failed or some other error occurred
    return false;
  }
};
