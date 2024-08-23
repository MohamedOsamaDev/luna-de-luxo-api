import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import colorsRouter from "./colors/colors.routes.js";
import sizesRouter from "./sizes/sizes.routes.js";
import influncerRouter from "./influncer/influncer.routes.js";
import singleTypeRouter from "./singleType/singleType.routes.js";
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
export const bootstrap = (app, express) => {
  const mainroute = "/api"; // main route
  globalMiddlewares.forEach((mw) => app.use(mw));
  // start  Endpoints ----------------------------------------- |
  app.get(mainroute, welcome);
  app.use(`${mainroute}/auth`, AuthRouter);
  app.use(`${mainroute}/users`, UserRouter);
  app.use(`${mainroute}/files`, fileRouter);
  app.use(`${mainroute}/carts`, cartRouter);
  app.use(`${mainroute}/categories`, categoryRouter);
  app.use(`${mainroute}/subcategories`, subCategoryRouter);
  app.use(`${mainroute}/products`, productRouter);
  app.use(`${mainroute}/orders`, orderRouter);
  app.use(`${mainroute}/sizes`, sizesRouter);
  app.use(`${mainroute}/colors`, colorsRouter);
  app.use(`${mainroute}/coupons`, couponRouter);
  app.use(`${mainroute}/influencers`, influncerRouter);
  app.use(`${mainroute}/single-type`, singleTypeRouter);
  app.use(`${mainroute}/custom-product`, customProductRouter);
  // End  Endpoints ------------------------------------------- |
  scheduleTasksHandler(scheduleTasks); // cron jobs
  databaseConnection(); // database connection
  app.use("*", notfound); // not found handler
  app.use(globalError); // error center
};
