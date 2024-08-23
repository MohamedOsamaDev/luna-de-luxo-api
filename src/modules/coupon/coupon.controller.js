import { couponModel } from "../../database/models/coupon.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import {
  deleteOne,
  FindAll,
  FindOne,
  InsertOne,
  updateOne,
} from "../handlers/crudHandler.js";
import { FindCouponWithVerfiy } from "./coupon.services.js";

const config = {
  model: couponModel,
  name: "coupon",
  uniqueFields: ["code"],
};
const addOneCoupon = InsertOne(config);
const updateOneCoupon = updateOne(config);
const getOneCoupon = FindOne(config);
const getAllCoupons = FindAll(config);
const deleteOneCoupon = deleteOne(config);
const verifyCoupon = AsyncHandler(async (req, res, next) => {

  
  const coupon = await FindCouponWithVerfiy({
    filters: {
      code: req?.query?.code,
    },
    user: req.user,
  });
  const data = {
    _id: coupon._id,
    code: coupon.code,
    discount: coupon.discount,
  };
  res.status(200).json(data);
});
export {
  addOneCoupon,
  updateOneCoupon,
  getOneCoupon,
  getAllCoupons,
  deleteOneCoupon,
  verifyCoupon,
};
