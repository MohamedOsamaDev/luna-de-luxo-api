// Import the cache instance from the configuration file
import cache from "../../config/cache.js";

// Import a utility function to detect and decode JWTs from the incoming request
import { detectJwtAndDecodeJwtFromRequest } from "../../modules/auth/auth.services.js";
import { cachePath, getCachedPath } from "../../utils/cachHandlers.js";
import { timeToSeconds } from "../../utils/formateTime.js";
// Middleware to cache the JSON response after all other middlewares have finished
export const cacheResponse = ({ stdTTL } = {}) => {
  return (req, res, next) => {
    if (stdTTL) stdTTL = timeToSeconds(stdTTL);
    let key = req?.originalUrl;
    if (req?.decodeReq?.role === "admin") {
      key = `admin${key}`;
    } else {
      key = `public${key}`;
    }
    // Save the original res.json method
    const originalJson = res.json;
    // Override the res.json method
    res.json = function (body) {
      // Check if caching should occur based on conditions
      if (req?.method?.toUpperCase() === "GET" && res?.statusCode === 200) {
        // Cache the JSON response body
        cachePath(key, body, stdTTL);
      }
      // Call the original res.json method to send the response
      return originalJson.call(this, body);
    };

    return next();
  };
};
// Middleware to check if the request has a valid JWT and if the user is an admin
export const checkCache = (req, res, next) => {
  // Decode the JWT from the request (if any) and extract user information
  const decodeReq = detectJwtAndDecodeJwtFromRequest(req);
  let key = req?.originalUrl;
  if (decodeReq.role === "admin") {
    key = `admin${key}`;
  } else {
    key = `public${key}`;
  }
  const cachedResponse = getCachedPath(key);
  // If the JWT is present, the user is an admin, and a cached response exists
  if (cachedResponse) {
    req.cached = true;
    return res.json(cachedResponse);
  }

  // If no valid cached response, attach the decoded JWT info to the request
  req.jwtDecoded = decodeReq;
  // Continue to the next middleware or route handler
  return next();
};

export const clearCacheMiddleware = (req, res, next) => {
  let key = req?.originalUrl;
  const originalJson = res.json;
  if (
    ["DELETE", "PUT", "PATCH"].includes(req.method.toUpperCase()) &&
    res?.statusCode === 200
  ) {
    if (req?.decodeReq?.role === "admin") {
      key = `admin${key}`;
    } else {
      key = `public${key}`;
    }
    // Invalidate cache for the generated key
    revaildatePath(key);
    req.cached = true;
    res.json = function (body) {
      // Call the original res.json method to send the response
      return originalJson.call(this, body);
    };
  }

 return next();
};
