import Joi from "joi";
import { publish } from "../commens/validation.js";
let ObjectIdVal = Joi.string().hex().length(24);
const couponSchemaVal = Joi.object({
  code: Joi.string().min(5).max(30).required().trim(),
  expires: Joi.date().required(),
  discount: Joi.number().integer().options({ convert: false }).required(),
  count: Joi.number().integer().options({ convert: false }).required(),
  publish,
  _id: ObjectIdVal,
});
const updateCouponSchemaVal = Joi.object({
  id: ObjectIdVal,
  _id: ObjectIdVal,
  count: Joi.number().integer().options({ convert: false }).optional(),
  publish,
  code: Joi.string().min(5).max(30).trim().optional(),
  expires: Joi.date().optional(),
  discount: Joi.number().integer().options({ convert: false }).optional(),
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
  _id: ObjectIdVal,
});
export { couponSchemaVal, updateCouponSchemaVal, paramsIdVal };
