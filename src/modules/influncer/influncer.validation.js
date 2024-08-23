import Joi from "joi";
import { influencers } from "../../assets/enums/influeners.js";
import { updateCouponSchemaVal } from "../coupon/coupon.validation.js";

const requestForBenfluencerVal = Joi.object({
  socialAccount: Joi.string().min(1).max(30),
});

const InfluncerVal = Joi.object({
  id: Joi.string().hex().length(24),
  socialAccount: Joi.string().min(1).max(30).optional(),
  state: Joi.string()
    .valid(...Object.values(influencers))
    .optional(),
  coupon: updateCouponSchemaVal,
  relatedTo: Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    fullName: Joi.string(),
    id: Joi.string().hex().length(24),
  }),
  count: Joi.number().integer().options({ convert: false }).optional(),
  totalSales: Joi.number().options({ convert: false }).optional(),
});
const updateInfluncerSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  _id: Joi.string().hex().length(24),
  socialAccount: Joi.string().min(1).max(30).optional(),
  totalSales: Joi.number().options({ convert: false }).optional(),
  state: Joi.string()
    .valid(...Object.values(influencers))
    .optional(),
  coupon: updateCouponSchemaVal.allow(null),
  relatedTo: Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    fullName: Joi.string(),
    id: Joi.string().hex().length(24),
  }).allow(null),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export {
  requestForBenfluencerVal,
  InfluncerVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
};
