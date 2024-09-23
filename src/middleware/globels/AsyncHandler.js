import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun, { onError = null } = {}) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      const message =
        process.env.NODE_ENV === "production" ? "something went wrong" : error;
      let errorResponse = {
        message,
        code: 500,
        unhandledError: true,
      };
      if (onError) {
        errorResponse = onError;
      }
      next(new AppError(errorResponse));
    });
  };
}
