// Import the cache instance from the configuration file
import cache from "../../config/cache.js";
import {
  cachePath,
  getCachedPath,
  revaildatePath,
} from "../../utils/cachHandlers.js";
import { timeToSeconds } from "../../utils/formateTime.js";
// Middleware to cache the JSON response after all other middlewares have finished
export const cacheResponse = ({ stdTTL } = {}) => {
  let ttlInSeconds = stdTTL ? timeToSeconds(stdTTL) : undefined;
  return (req, res, next) => {
    // Decode the JWT from the request (if any) and extract user information
    if (req?.decodeReq?.role !== "admin") {
      // Save the original res.json method
      const originalJson = res.json;
      // Override the res.json method
      res.json = function (body) {
        // Check if caching should occur based on conditions
        if (req?.method?.toUpperCase() === "GET" && res?.statusCode === 200) {
          // Cache the JSON response body
          cachePath(req?.originalUrl, body, ttlInSeconds);
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
  if (req?.decodeReq?.role !== "admin") {
    const cachedResponse = getCachedPath(req?.originalUrl);
    // If the JWT is present, the user is an admin, and a cached response exists
    if (cachedResponse) {
      req.cached = true;
      return res.json(cachedResponse);
    }
  }
  // Continue to the next middleware or route handler
  return next();
};
const filterMatchingPaths = (target, paths) => {
  // Use an empty array instead of Set to maintain order
  const filteredUrls = [];

  // Extract core segment from the target URL once
  const coreSegment = target?.match(/^\/api\/([^\/\?\s]+)/)?.[1] || "";
  console.log("🚀 ~ filterMatchingPaths ~ coreSegment:", coreSegment);

  if (!coreSegment) return filteredUrls;

  // Precompute special conditions
  const specialConditions = new Set([target]);

  // Iterate through paths and filter
  for (const url of paths || []) {
    if (
      specialConditions.has(url) ||
      (url.includes(`/${coreSegment}`) &&
        (url.includes(`/${coreSegment}/`) || url.includes(`/${coreSegment}?`)))
    ) {
      filteredUrls.push(url);
    }
  }

  return filteredUrls;
};
// Middleware to invalidate the cache for a specific URL when a DELETE, PUT, or PATCH request is made
export const clearCacheMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (
      ["DELETE", "PUT", "PATCH"].includes(req.method.toUpperCase()) &&
      res?.statusCode === 200
    ) {
      req.cached = true;
      // if (req.method.toUpperCase() === "DELETE") {
      //   updatetTTL(req.originalUrl, "1h");
      // } else {
      //   revaildatePath(req.originalUrl);
      // }
      revaildatePath(filterMatchingPaths(req.originalUrl, cache.keys()));
      // Call the original res.json method to send the response
      console.log(cache.keys());
    }
    return originalJson.call(this, body);
  };

  return next();
};
