import { getwaySessionModel } from "../../database/models/getwaySession.model.js";
import { cancelSession } from "../../modules/order/services/order.services.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const sessionVaildtator = AsyncHandler(async (req, res, next) => {
  const { user } = req;

  const session = await getwaySessionModel
    .findOne({
      user: user._id,
    })
    .lean();
  console.log("session 1");

  if (session) {
    // Get the difference in milliseconds
    const differenceInMs = Math.abs(new Date() - session?.createdAt);
    // Convert milliseconds to minutes (1 minute = 60,000 milliseconds)
    const isvalid = Math.floor(differenceInMs / (1000 * 60)) < 24;
    if (isvalid) {
      return next(
        new AppError({
          message: " already have an active session",
          code: 409,
          details: {
            session,
          },
        })
      );
    } else {
      await cancelSession(session);
    }
  }
  console.log("session 2");

  return next();
});
