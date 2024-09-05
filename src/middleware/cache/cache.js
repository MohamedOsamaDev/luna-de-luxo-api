import {
  cachePath,
  cachPathes,
  getCachedPath,
  getCoresegment,
  revaildatePath,
} from "../../utils/cacheHandlers.js";
import { timeToSeconds } from "../../utils/formateTime.js";
// Middleware to cache the JSON response after all other middlewares have finished
export const cacheResponse = ({ stdTTL, group = false } = {}) => {
  let ttlInSeconds = stdTTL ? timeToSeconds(stdTTL) : undefined;
  return (req, res, next) => {
    // Decode the JWT from the request (if any) and extract user information

    if (req?.decodeReq?.role !== "admin") {
      let key = req?.originalUrl;
      // Save the original res.json method
      const originalJson = res.json;
      // Override the res.json method
      res.json = function (body) {
        // Check if caching should occur based on conditions
        if (
          req?.method?.toUpperCase() === "GET" &&
          res?.statusCode < 309 &&
          res?.statusCode > 99
        ) {
          // Cache the JSON response body
          if (group) {
            cachPathes(key, body, ttlInSeconds);
          } else {
            cachePath(key, body, ttlInSeconds);
          }
        }

        // Call the original res.json method to send the response
        return originalJson.call(this, body);
      };
    }

    return next();
  };
};
// Middleware to check if the request has a valid JWT and if the user is an admin
export const checkCache = (req, res, next) => {
  if (req?.decodeReq?.role !== "admin" && req.method.toUpperCase() === "GET") {
    const cachedResponse = getCachedPath(req?.originalUrl);
    // If the JWT is present, the user is an admin, and a cached response exists
    if (cachedResponse) {
      req.cached = true;
      return res.status(200).json(cachedResponse);
    }
  }
  // Continue to the next middleware or route handler
  return next();
};
// Middleware to invalidate the cache for a specific URL when a DELETE, PUT, or PATCH request is made
export const clearCacheMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (
      ["DELETE", "PUT", "PATCH"].includes(req.method.toUpperCase()) &&
      res?.statusCode < 309 &&
      res?.statusCode > 99
    ) {
      req.revaildatecache = true;
      const corekey = getCoresegment(req?.originalUrl);
      const keys = [req.originalUrl, corekey];
      if (body?.data?.slug) keys.push(`/api/${corekey}/${body?.data?.slug}`);
      revaildatePath(keys);
      // Call the original res.json method to send the response
    }
    return originalJson.call(this, body);
  };

  return next();
};
