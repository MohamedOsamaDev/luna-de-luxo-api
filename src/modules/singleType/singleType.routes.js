import express from "express";
import {
  PageSchemaVal,
  updatePageSchemaVal,
  paramsIdVal,
} from "./singleType.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { insert, getPage, updatePage } from "./singleType.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { keyHandler } from "../../middleware/singleType/singleType.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
import { cacheResponse } from "../../middleware/cache/cache.js";
const singleTypeRouter = express.Router();
// get rouets

// post routes
singleTypeRouter.post(
  "/landing",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("landing"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/about_us",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("about_us"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/warning",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("warning"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/faq",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("faq"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/privacy_policy",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("privacy_policy"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/legal",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("legal"),
  AttributedTo,
  insert
);
singleTypeRouter.post(
  "/care_service",
  protectedRoutes,
  authorized(enumRoles.admin),
  keyHandler("care_service"),
  AttributedTo,
  insert
);

// put toutes
singleTypeRouter.put(
  "/landing",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("landing"),
  updatePage
);
singleTypeRouter.put(
  "/about_us",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("about_us"),
  updatePage
);
singleTypeRouter.put(
  "/warning",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("warning"),
  updatePage
);
singleTypeRouter.put(
  "/faq",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("faq"),
  updatePage
);
singleTypeRouter.put(
  "/privacy_policy",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("privacy_policy"),
  updatePage
);
singleTypeRouter.put(
  "/legal",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("legal"),
  updatePage
);
singleTypeRouter.put(
  "/care_service",
  protectedRoutes,
  authorized(enumRoles.admin),
  AttributedTo,
  keyHandler("care_service"),
  updatePage
);

singleTypeRouter.get(
  "/:key",
  cacheResponse({ stdTTL: "1y" }),
  tokenDetector,
  getPage
);
export default singleTypeRouter;
