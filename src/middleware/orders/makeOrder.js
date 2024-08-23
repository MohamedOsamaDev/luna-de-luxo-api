import { FindCouponWithVerfiy } from "../../modules/coupon/coupon.services.js";
import { orderServices } from "../../modules/order/services/order.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const makeOrder = AsyncHandler(async (req, res, next) => {
  const { user = {} } = req;
  const { cart = {} } = user; // cart is populated with user
  // Handle error cases
  if (!cart || !cart?.items?.length) {
    return next(
      new AppError({
        message: "Cart is empty",
        code: 400,
        details: { cart: [] },
      })
    );
  }
  // Handle verify coupon
  let coupon = undefined;
  if (req.body.coupon) {
    const findCoupon = await FindCouponWithVerfiy({
      filters: {
        _id: req.body.coupon,
      },
      user,
    });
    coupon = {
      original_id: findCoupon._id,
      code: findCoupon.code,
      discount: findCoupon?.discount,
    };
  }

  let totalOrderPrice = 0;
  const items = [];
  const bulkOperations = {};
  const onError = () => {
    return next(
      new AppError({
        message: "Some products are not available",
        code: 400,
        details: {
          cart: [...cart.items],
        },
      })
    );
  };
  cart?.items?.forEach((item) => {
    const { product, quantity, color, size } = item;
    let orderHelper = orderServices?.[product?.type];
    if (!orderHelper) return onError();
    const isValid = orderHelper({
      product,
      color,
      size,
      quantity,
      cart,
      bulkOperations,
      items,
    });
    if (!isValid) return onError();
    // Calculate order item price and add to total order price
    const itemPrice = product?.price * quantity;
    totalOrderPrice += itemPrice;
  });

  let order = {
    user: user._id,
    items,
    totalOrderPrice,
    ...req?.body,
  };
  if (coupon) {
    order.discount = coupon?.discount;
    order.coupon = coupon; // Pass the full coupon object
    order.totalOrderPrice -= totalOrderPrice * (coupon?.discount / 100);
  }
  order.shippingPrice = 50;
  order.totalOrderPrice += 50;
  req.order = {
    order,
    bulkOperations,
  };

  return next();
});
