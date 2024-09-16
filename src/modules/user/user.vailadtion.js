import Joi from "joi";

const ForgetPasswordVal = Joi.object({
  email: Joi.string().email().required(),
});
const userInsertVal = Joi.object({
  id: Joi.string().hex().length(24),
  fullName: Joi.string().min(1).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().messages(),
  phone: Joi.string().required().required(),
  password: Joi.string().min(8).max(50).required(),
  _id: Joi.string().hex().length(24),
  isblocked: Joi.boolean(),
  confirmEmail: Joi.boolean(),
});
const userUpdateVal = Joi.object({
  id: Joi.string().hex().length(24),
  fullName: Joi.string().min(1).max(30),
  email: Joi.string().email(),
  role: Joi.string(),
  phone: Joi.string().allow(''),
  password: Joi.string().min(8).max(50),
  _id: Joi.string().hex().length(24),
  isblocked: Joi.boolean(),
});
const updatePasswordVal = Joi.object({
  newpassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
  currentpassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
});
const authResetPasswordVal = Joi.object({
  token: Joi.string().min(100).max(400).required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
});
export {
  ForgetPasswordVal,
  updatePasswordVal,
  authResetPasswordVal,
  userInsertVal,
  userUpdateVal,
};
