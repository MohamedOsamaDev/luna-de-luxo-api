import { AsyncHandler } from "../globels/AsyncHandler.js";

export const keyHandler = (key) => {
  return AsyncHandler(async (req, res, next) => {
    req.key = key;
    return next();
  });
};
