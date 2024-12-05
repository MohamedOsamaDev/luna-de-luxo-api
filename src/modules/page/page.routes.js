import express from "express";

import { insertPage, getPage, updatePage } from "./page.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/globels/AttributedTo.js";
import { keyHandler } from "../../middleware/singleType/singleType.js";
import { tokenDetector } from "../../middleware/auth/tokenDetector.js";
import { cacheResponse } from "../../middleware/cache/cache.js";
import { pageVaildtion } from "../../middleware/page/vaildtion.js";
const pageRouter = express.Router();

pageRouter
  .route("/:key")
  .post(
    pageVaildtion,
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    insertPage
  )
  .put(
    pageVaildtion,
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    updatePage
  )
  .get(
    // cacheResponse({ stdTTL: "6h" }),
    tokenDetector({
      admin: true,
    }),
    getPage
  );

export default pageRouter;
