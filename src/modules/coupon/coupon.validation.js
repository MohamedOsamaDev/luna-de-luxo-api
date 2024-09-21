import Joi from "joi";
import { publish } from "../commens/validation.js";
let objectIdVal = Joi.string().hex().length(24);
const couponSchemaVal = Joi.object({
  code: Joi.string().min(5).max(30).required().trim(),
  expires: Joi.date().required(),
  discount: Joi.number().integer().options({ convert: false }).required(),
  commission: Joi.number().integer().options({ convert: false }).required(),
  count: Joi.number().integer().options({ convert: false }).required(),
  publish,
  _id: objectIdVal,
});
const updateCouponSchemaVal = Joi.object({
  id: objectIdVal,
  _id: objectIdVal,
  count: Joi.number().integer().options({ convert: false }).optional(),
  publish,
  code: Joi.string().min(5).max(30).trim().optional(),
  expires: Joi.date().optional(),
  discount: Joi.number().integer().options({ convert: false }).optional(),
  commission: Joi.number().integer().options({ convert: false }).optional(),
});
const paramsIdVal = Joi.object({
  id: objectIdVal,
  _id: objectIdVal,
});
export { couponSchemaVal, updateCouponSchemaVal, paramsIdVal };
