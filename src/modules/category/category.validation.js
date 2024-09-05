import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import { commensVal, publish } from "../commens/validation.js";
let objectIdVal = Joi.string().hex().length(24);
let poster = Joi.alternatives().try(objectIdVal, relationFileVal);
const CategorySchemaVal = Joi.object({
  _id: objectIdVal,
  name: Joi.string().min(1).max(30).required().trim(),
  description: Joi.string().min(3).max(1500).required(),
  poster,
  publish,
});
const UpdateCategorySchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).trim(),
  id: objectIdVal,
  poster: poster.allow(null),
  description: Joi.string().min(3).max(1500),
  publish,
  ...commensVal
});
const paramsIdVal = Joi.object({
  id: objectIdVal,
});
export { CategorySchemaVal, UpdateCategorySchemaVal, paramsIdVal };
