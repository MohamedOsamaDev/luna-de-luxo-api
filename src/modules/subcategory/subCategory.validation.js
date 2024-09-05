import Joi from "joi";
import { UpdateCategorySchemaVal } from "../category/category.validation.js";
import { objectIdVal, poster, publish } from "../commens/validation.js";

const subCategorySchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).required().trim(),
  category: Joi.alternatives()
    .try(objectIdVal, UpdateCategorySchemaVal)
    .allow(null),
  description: Joi.string().min(3).max(1500).required(),
  poster,
  _id: objectIdVal,
});
const UpdatesubCategorySchemaVal = Joi.object({
  id: objectIdVal,
  name: Joi.string().min(1).max(30).trim(),
  category: Joi.array().items(
    Joi.alternatives().try(objectIdVal, UpdateCategorySchemaVal).allow(null)
  ),
  description: Joi.string().min(3).max(1500),
  poster,
  publish,
  _id: objectIdVal,
});
export { subCategorySchemaVal, UpdatesubCategorySchemaVal };
