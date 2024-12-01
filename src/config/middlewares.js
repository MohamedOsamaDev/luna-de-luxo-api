import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AppError } from "../utils/AppError.js";
import { checkCache, clearCacheMiddleware } from "../middleware/cache/cache.js";
import { decodeToken } from "../middleware/auth/decodeToken.js";
import { FileModel } from "./../database/models/file.model.js";
import { colorModel } from "../database/models/color.model.js";
import { cartModel } from "../database/models/cart.model.js";
import { categoryModel } from "../database/models/category.model.js";
import { SubCategoryModel } from "../database/models/subcategory.model.js";
import { sizeModel } from "../database/models/size.model.js";
import { UserModel } from "../database/models/user.model.js";
import { couponModel } from "../database/models/coupon.model.js";
import { orderModel } from "../database/models/order.model.js";
import { influencerModel } from "../database/models/influencer.model.js";
import { couponhistoryModel } from "../database/models/coupon_history.js";
import { productModel } from "../database/models/product.model.js";
import { customProductModel } from "../database/models/customProduct.model.js";
import { SingleTypeModel } from "../database/models/singleType.js";
import { promises as fs } from 'fs';

import { contactModel } from "../database/models/contactUs.model.js";
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
export const welcome = async (req, res) => {
  const allModels = [
    cartModel,
    categoryModel,
    SubCategoryModel,
    colorModel,
    sizeModel,
    UserModel,
    couponModel,
    orderModel,
    influencerModel,
    couponhistoryModel,
    FileModel,
    productModel,
    SingleTypeModel,
    contactModel,
    customProductModel,
  ];

  allModels.forEach(async (model) => {
    const data = await model.find({});
    // Convert document to JSON
    const jsonContent = JSON.stringify(data, null, 2); // Pretty print JSON

    // Define file path
    const filePath = `./exports/${data.modelName}.json`;

    // Save to file
    await fs.writeFile(filePath, jsonContent, "utf8");

    
  });
  return res.status(200).json({
    status: "success",
    message: "Welcome to LUNADELUXO API",
  });
};

// Global middleware setup
export const globalMiddlewares = [
  cors(corsOptions), // Enable CORS with specified options
  helmet(), // Enhance security and handle XSS attacks
  bodyParser.urlencoded({ extended: true, limit: "50mb" }), // Handle URL-encoded data with size limit
  bodyParser.json({ limit: "50mb" }), // Handle JSON data with size limit
  cookieParser(), // Parse cookies
  decodeToken,
  checkCache,
  clearCacheMiddleware,
];
