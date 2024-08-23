import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      process.env.NODE_ENV !== "production";
      next(
        new AppError({
          message:
            process.env.NODE_ENV === "production"
              ? "something went wrong"
              : error,
          code: 500,
        })
      );
    });
  };
}
