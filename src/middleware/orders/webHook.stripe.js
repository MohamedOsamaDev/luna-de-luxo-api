import stripe from "../../services/payments/stripe/main.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const webhookStripe = AsyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"].toString();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.stripe_Signing_Secret
    );
  } catch (err) {
    console.log("🚀 ~ webhookStripe ~ err:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  req.webhook = { event };
});
