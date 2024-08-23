import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const handleRemoveRelationField = AsyncHandler(
  async (req, res, next) => {
    const replaceNullWithUnset = (obj) => {
      // Helper function to process an object recursively
      function process(obj) {
        const result = {};

        for (const key in obj) {
          if (obj[key] === null) {
            result.$unset = result.$unset || {};
            result.$unset[key] = "";
          } else if (Array.isArray(obj[key])) {
            result[key] = obj[key].map((item) => {
              return typeof item === "object" && item !== null
                ? process(item)
                : item;
            });
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = process(obj[key]);
          } else {
            result[key] = obj[key];
          }
        }

        return result;
      }

      return process(obj);
    };
    try {
      req.body = replaceNullWithUnset(req.body);
    } catch (error) {}
    next();
  }
);
