import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      const message =
        process.env.NODE_ENV === "production" ? "something went wrong" : error;
      next(
        new AppError({
          message,
          code: 500,
        })
      );
    });
  };
}
