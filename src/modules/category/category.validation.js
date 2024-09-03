import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import { publish } from "../commens/validation.js";
let ObjectIdVal = Joi.string().hex().length(24);
let poster = Joi.alternatives().try(ObjectIdVal, relationFileVal);
const CategorySchemaVal = Joi.object({
  _id: ObjectIdVal,
  name: Joi.string().min(1).max(30).required().trim(),
  description: Joi.string().min(3).max(1500).required(),
  poster,
  publish,
});
const UpdateCategorySchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).trim(),
  id: ObjectIdVal,
  poster: poster.allow(null),
  description: Joi.string().min(3).max(1500),
  publish,
  _id: ObjectIdVal,
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});
export { CategorySchemaVal, UpdateCategorySchemaVal, paramsIdVal };
