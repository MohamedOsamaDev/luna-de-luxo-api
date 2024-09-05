import Joi from "joi";
import { publish } from "../commens/validation.js";
let objectIdVal = Joi.string().hex().length(24);


const ContactVal = Joi.object({
  name: Joi.string().min(2).max(30).required().trim(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required().min(11).max(15),
  message: Joi.string().min(3).max(500).required(),
});

const paramsIdVal = Joi.object({
  id: objectIdVal,
  _id: objectIdVal,
});
export { ContactVal, paramsIdVal };
