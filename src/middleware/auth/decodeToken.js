//

import { detectJwtAndDecodeJwtFromRequest } from "../../modules/auth/auth.services.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const decodeToken = AsyncHandler(async (req, res, next) => {
  const { decoded = null, token = null } =
    detectJwtAndDecodeJwtFromRequest(req);
  if (decoded) {
    req.decodeReq = decoded;
    req.token = token;
  }
  next();
});
