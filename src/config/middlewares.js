import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { logger } from "../middleware/globels/logger.js";
import cookieParser from "cookie-parser";
import { AppError } from "../utils/AppError.js";
import {
  cacheResponse,
  checkCache,
  clearCacheMiddleware,
} from "../middleware/cache/cache.js";
import { decodeToken } from "../middleware/auth/decodeToken.js";

// Load environment variables
dotenv.config();

// CORS options configuration
export const corsOptions = {
  origin: process.env.DOMAINS.split(","), // List of allowed origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: [
    "Content-Type", // Required for POST requests with JSON or XML bodies
    "Authorization", // Required if using authorization headers
    "Access-Control-Allow-Origin",
    "X-Requested-With", // Required for XMLHttpRequests
    "X-File-Name", // Required for file uploads
    "X-File-Size", // Required for chunked uploads
    "X-File-Type", // Required for chunked uploads
    "Content-Disposition", // Required for file uploads
  ],
};

// Middleware to handle undefined routes
export const notfound = (req, res, next) => {
  return next(
    new AppError({
      message: `Endpoint not found: ${req.originalUrl}`,
      code: 404,
    })
  );
};

// Welcome message handler
export const welcome = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to LUNADELUXO API",
  });
};

// Global middleware setup
export const globalMiddlewares = [
  logger(), // Log requests in the terminal
  cors(corsOptions), // Enable CORS with specified options
  helmet(), // Enhance security and handle XSS attacks
  bodyParser.urlencoded({ extended: true, limit: "50mb" }), // Handle URL-encoded data with size limit
  bodyParser.json({ limit: "50mb" }), // Handle JSON data with size limit
  cookieParser(), // Parse cookies
  decodeToken,
  checkCache,
  clearCacheMiddleware,
];
