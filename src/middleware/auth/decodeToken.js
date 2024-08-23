//

import { detectJwtAndDecodeJwtFromRequest } from "../../modules/auth/auth.services.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const decodeToken = AsyncHandler(async (req, res, next) => {
  const decodeReq = detectJwtAndDecodeJwtFromRequest(req);
  if (decodeReq) {
    req.decodeReq = decodeReq;
  }
  next();
});
