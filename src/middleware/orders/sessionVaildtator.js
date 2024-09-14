import { getwaySessionModel } from "../../database/models/getwaySession.model.js";
import { cancelSession } from "../../modules/order/services/order.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const sessionVaildtator = AsyncHandler(async (req, res, next) => {
  const { user } = req;
  const now = new Date();
  const twentyFiveMinutesAgo = new Date(now.getTime() - 25 * 60 * 1000);

  const getwaySession = await getwaySessionModel
    .findOne({
      user: user._id,
      createdAt: {
        $gte: twentyFiveMinutesAgo,
        $lte: now,
      },
    })
    .lean()
    .populate({
      path: "order",
      select: "items",
    });
  if (getwaySession) {
    return next(
      new AppError({
        message: " already have an active session",
        code: 409,
        details: {
          session: {
            ...getwaySession?.session,
            _id: getwaySession?._id,
            preview: getwaySession?.order?.items || [],
          },
        },
      })
    );
  }

  return next();
});
// /Model.schema.index({ createdAt: 1 });
