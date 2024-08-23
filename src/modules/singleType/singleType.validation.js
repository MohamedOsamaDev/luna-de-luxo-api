import Joi from "joi";
import { influencers } from "../../assets/enums/influeners.js";

const PageSchemaVal = Joi.object({

});
const updatePageSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  state: Joi.string().valid(...Object.values(influencers)).optional(),
  coupon: Joi.string().hex().length(24).optional(),
  count: Joi.number().integer().options({ convert: false }).optional(),
  balance: Joi.number().options({ convert: false }).optional(),
  _id: Joi.string().hex().length(24),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { PageSchemaVal, updatePageSchemaVal, paramsIdVal };
