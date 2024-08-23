import Joi from "joi";

const colorSchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).required().trim(),
  code: Joi.string()
    .regex(new RegExp("^#[a-fA-F0-9]{6}$"))
    .default("#ffff")
    .messages({
      "string.pattern.base": "Color must be a valid hex code (e.g. #FFFFFF)",
    })
    .required()
    .trim(),
  _id: Joi.string().hex().length(24),
});
const updateColorSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  _id: Joi.string().hex().length(24),
  name: Joi.string().min(1).max(30).trim(),
  code: Joi.string()
    .regex(new RegExp("^#[a-fA-F0-9]{6}$"))
    .default("#ffff")
    .messages({
      "string.pattern.base": "Color must be a valid hex code (e.g. #FFFFFF)",
    })
    .trim(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { colorSchemaVal, updateColorSchemaVal, paramsIdVal };
