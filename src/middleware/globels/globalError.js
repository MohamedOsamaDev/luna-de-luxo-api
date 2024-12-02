import chalk from "chalk";
import httpStatus from "../../assets/messages/httpStatus.js";
import SetCookie from "../../utils/SetCookie.js";

export const globalError = (error, req, res, next) => {
  const isDevMode = process.env.MODE === "dev";

  // Log the error in development mode
  if (isDevMode) {
    console.log(chalk.red(`❌  - Error - ${error?.message}`));
  }

  // Default error properties
  const code = error?.code || 500; // Default to 500 if no code is provided
  const message = error?.unhandledError
    ? "Something went wrong"
    : error?.message || "Something went wrong";
  const details = error?.details || {};

  // Handle specific error scenarios
  if (message === httpStatus.Forbidden.message) {
    const cookieOptions = SetCookie({ maxAge: 0 }); // Expire the cookie immediately
    res.cookie("token", "", cookieOptions);
    res.clearCookie("token", cookieOptions);
  }

  // Build the error response
  const errorResponse = {
    message,
    details,
    status: code,
  };

  // Include stack trace in development mode
  if (isDevMode) {
    errorResponse.stack = error.stack;
  }

  // Send the error response
  return res.status(code).json(errorResponse);
};
