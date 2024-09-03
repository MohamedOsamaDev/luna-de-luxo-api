import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";

export const  publish = Joi.boolean()

export let ObjectIdVal = Joi.string().hex().length(24);
export let poster = Joi.alternatives().try(ObjectIdVal, relationFileVal);
export const paramsIdVal = Joi.object({
    id: ObjectIdVal,
  });
