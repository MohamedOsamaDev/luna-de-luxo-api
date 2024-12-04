import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";

export const publish = Joi.boolean();

export let objectIdVal = Joi.string().hex().length(24);
export let poster = Joi.alternatives().try(objectIdVal, relationFileVal);
export const paramsIdVal = Joi.object({
  id: objectIdVal,
});

export const SmString = Joi.string().max(10000).trim();
export const LrString = Joi.string().max(20000).trim();

export const commensVal = {
  id: objectIdVal,
  _id: objectIdVal,
};
