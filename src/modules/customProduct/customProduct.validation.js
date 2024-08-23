import Joi from "joi";
import { fileVal } from "../file/file.validation.js";

let ObjectIdVal = Joi.string().hex().length(24);

const CutomProductSchemaVal = Joi.object({
  _id: ObjectIdVal,
  file: fileVal.required(),
  description: Joi.string().min(3).max(1500).required(),
});

const UpdateCutomProductSchemaVal = Joi.object({
  _id: ObjectIdVal,
  file: fileVal.required(),
  description: Joi.string().min(3).max(1500).required(),
});

const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});

export { CutomProductSchemaVal, UpdateCutomProductSchemaVal, paramsIdVal };
