import Joi from "joi";

const signupschemaVal = Joi.object({
  fullName: Joi.string().min(1).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    // .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
});
const signinSchemaVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    // .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
});

const ForgetPasswordVal = Joi.object({
  email: Joi.string().email().required(),
});
const updateVal = Joi.object({
  fullName: Joi.string().min(1).max(30),
  phone: Joi.string().min(8).max(30),
});
const updatePasswordVal = Joi.object({
  newpassword: Joi.string()
   // .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/)
    .required(),
  currentpassword: Joi.string()
 //   .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/)
    .required(),
});
const authResetPasswordVal = Joi.object({
  token: Joi.string().min(100).max(400).required(),
  newPassword: Joi.string()
   // .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
});
export {
  updateVal,
  updatePasswordVal,
  ForgetPasswordVal,
  authResetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
};
