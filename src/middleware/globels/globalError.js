import chalk from "chalk";
import httpStatus from "../../assets/messages/httpStatus.js";
import SetCookie from "../../utils/SetCookie.js";

export const globalError = (error, req, res, next) => {
  process.env.MODE === "dev"
    ? console.log(chalk.red(`❌  - Error  - ${error?.message}`))
    : "";

  let code = error?.code || 500;
  let message = error?.message || "something went wrong";
  let details = error?.details || {};
  if (message === httpStatus.Forbidden.message) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Use the same secure options as when you set it
      sameSite: 'strict',
    });
  }

  if (process.env.MODE === "dev") {
    return res.status(code).json({ message, details, stack: error.stack });
  } else {
    return res.status(code).json({ message, details });
  }
};
