import Joi from "joi";
import { fileVal } from "../file/file.validation.js";

let objectIdVal = Joi.string().hex().length(24);

const CutomProductSchemaVal = Joi.object({
  _id: objectIdVal,
  file: fileVal.required(),
  description: Joi.string().min(3).max(1500).required(),
});

const UpdateCutomProductSchemaVal = Joi.object({
  _id: objectIdVal,
  file: fileVal.required(),
  description: Joi.string().min(3).max(1500).required(),
});

const paramsIdVal = Joi.object({
  id: objectIdVal,
});

export { CutomProductSchemaVal, UpdateCutomProductSchemaVal, paramsIdVal };
