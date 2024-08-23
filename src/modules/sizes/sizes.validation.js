import Joi from "joi";
import { publish } from "../commens/validation.js";

const sizeSchemaVal = Joi.object({
  _id: Joi.string().hex().length(24),
  name: Joi.string().min(1).max(10).required().trim(),
  description: Joi.string().min(1).max(30).trim().required(),
  publish,
});
const updatesizeSchemaVal = Joi.object({
  name: Joi.string().min(1).max(10).trim(),
  description: Joi.string().min(1).max(30).trim(),
  id: Joi.string().hex().length(24),
  _id: Joi.string().hex().length(24),
  publish,
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { sizeSchemaVal, updatesizeSchemaVal, paramsIdVal };
