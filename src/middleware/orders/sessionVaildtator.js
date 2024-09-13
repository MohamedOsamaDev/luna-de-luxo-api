import { cancelSession } from "../../modules/order/services/order.services";
import { makeSessionExpirated } from "../../services/payments/stripe/session";
import { AppError } from "../../utils/AppError";
import { AsyncHandler } from "../globels/AsyncHandler";

export const sessionVaildtator = AsyncHandler(async (req, res, next) => {
  const { user } = req;

  const session = await getwaySessionModel
    .findOne({
      user: user._id,
    })
    .lean();

  if (session) {
    // Get the difference in milliseconds
    const differenceInMs = Math.abs(new Date() - session?.createdAt);

    // Convert milliseconds to minutes (1 minute = 60,000 milliseconds)
    const isvalid = Math.floor(differenceInMs / (1000 * 60)) > 5;
    if (isvalid) {
      return next(
        new AppError({
          message: "you already have an active session",
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
});
