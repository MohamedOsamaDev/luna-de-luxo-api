import Joi from "joi";
const fileVal = Joi.object({
  _id: Joi.string().hex().length(24),
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  destination: Joi.string(),
  path: Joi.string(),
  filename: Joi.string(),
  public_id: Joi.string(),
  url: Joi.string(),
  mimetype: Joi.string()
    .valid("image/jpeg", "image/png", "image/gif", "image/webp")
    .required(),
  size: Joi.number()
    .max(1024 * 1024 * 10)
    .required(), // 10 MB size limit
});
const uploadSchema = Joi.object({
  file: fileVal.required(),
});

const deleteSchema = Joi.object({
  id: Joi.string().required(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
const relationFileVal = Joi.object({
  _id: Joi.string().hex().length(24),
  filename: Joi.string(),
  public_id: Joi.string(),
  originalname: Joi.string(),
  filename: Joi.string(),
  url: Joi.string(),
  mimetype: Joi.string()
  .valid("image/jpeg", "image/png", "image/gif", "image/webp"),
  size: Joi.number(),
});
export { uploadSchema, paramsIdVal, deleteSchema, fileVal,relationFileVal };
