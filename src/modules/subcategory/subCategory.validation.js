import Joi from "joi";
import { CategorySchemaVal } from "../category/category.validation.js";
import { relationFileVal } from "../file/file.validation.js";
import { ObjectIdVal, poster, publish } from "../commens/validation.js";

const subCategorySchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).required().trim(),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal),
  description: Joi.string().min(3).max(1500).required(),
  poster,
  _id: ObjectIdVal,
});
const UpdatesubCategorySchemaVal = Joi.object({
  id: ObjectIdVal,
  name: Joi.string().min(1).max(30).trim(),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal),
  description: Joi.string().min(3).max(1500),
  poster,
  publish,
  _id: ObjectIdVal,
});
export { subCategorySchemaVal, UpdatesubCategorySchemaVal,  };
