import couponRouter from "./coupon/coupon.routes.js";
import contactRouter from "./contactUs/contact.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import colorsRouter from "./colors/colors.routes.js";
import sizesRouter from "./sizes/sizes.routes.js";
import influncerRouter from "./influncer/influncer.routes.js";
import { UserRouter } from "./user/user.routes.js";
import { categoryRouter } from "./category/category.routes.js";
import { AuthRouter } from "./auth/auth.routes.js";
import { globalError } from "../middleware/globels/globalError.js";
import { productRouter } from "./product/product.routes.js";
import { fileRouter } from "./file/file.routes.js";
import { subCategoryRouter } from "./subcategory/subCategory.routes.js";
import { customProductRouter } from "./customProduct/customProduct.routes.js";
import { scheduleTasksHandler } from "../utils/scheduleTasksHandler.js";
import { globalMiddlewares, notfound, welcome } from "../config/middlewares.js";
import { scheduleTasks } from "../config/cronjob.js";
import { databaseConnection } from "../config/database.js";
import pageRouter from "./page/page.routes.js";
import webHookRouter from "./webhook/webhook.routes.js";
import { logger } from "../middleware/globels/logger.js";
import { delay } from "../utils/delay.js";
export const bootstrap = (app, express) => {
  const routeverion = "/api"; // main route
  // webhooks
  app.use(logger());
  app.use(`${routeverion}/webhook`, webHookRouter);
  globalMiddlewares.forEach((mw) => app.use(mw));
  // start  Endpoints ----------------------------------------- |
  app.get(routeverion, welcome);
  app.use(`${routeverion}/auth`, AuthRouter);
  app.use(`${routeverion}/users`, UserRouter);
  app.use(`${routeverion}/files`, fileRouter);
  app.use(`${routeverion}/carts`, cartRouter);
  app.use(`${routeverion}/categories`, categoryRouter);
  app.use(`${routeverion}/subcategories`, subCategoryRouter);
  app.use(`${routeverion}/products`, productRouter);
  app.use(`${routeverion}/orders`, orderRouter);
  app.use(`${routeverion}/sizes`, sizesRouter);
  app.use(`${routeverion}/colors`, colorsRouter);
  app.use(`${routeverion}/coupons`, couponRouter);
  app.use(`${routeverion}/influencers`, influncerRouter);
  app.use(`${routeverion}/pages`, pageRouter);
  app.use(`${routeverion}/custom-product`, customProductRouter);
  app.use(`${routeverion}/contact-us`, contactRouter);
  // End  Endpoints ------------------------------------------- |
  scheduleTasksHandler(scheduleTasks); // cron jobs
  databaseConnection(); // database connection
  app.use("*", notfound); // not found handler
  app.use(globalError); // error center
};
