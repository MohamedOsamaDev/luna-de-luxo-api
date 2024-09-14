import stripe from "./main.js";
/**
 * Creates a Stripe checkout session.
 *
 * This function generates a Stripe checkout session for a user's order, including
 * order details, user information, and payment data.
 *
 * @param {Object} payload - The data required to create a checkout session.
 * @param {Object} payload.user - User information.
 * @param {string} payload.user.fullName - The name of the user placing the order.
 * @param {string} payload.user.email - The user's email address.
 * @param {Object} payload.order - Order information.
 * @param {string} payload.order._id - The unique ID of the order.
 * @param {number} payload.order.totalOrderPrice - The total price of the order.
 * @param {Object} payload.shippingAddress - The user's shipping address.
 *
 * @returns {Promise<Object>} The Stripe session object.
 *
 * @throws Will throw an error if the session creation fails.
 */
export const createStripeSession = async (payload = {}) => {
  const expires_at = new Date(new Date().getTime() + 31 * 60000); // Add 30 minutes (30 * 60000 ms)
  const newPayload = {
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: payload?.order?.totalOrderPrice * 100,
          product_data: {
            name: payload.user.fullName,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.DOMAIN_client}/checkout/success?sig=${payload?.secureSignature}`, // to home page or orders page
    cancel_url: `${process.env.DOMAIN_client}/redirect?to_=checkout`, // to cart
    customer_email: payload.user.email,
    client_reference_id: payload?.order?._id?.toString(),
    metadata: payload.shippingAddress,
    expires_at,
  };
  const session = await stripe.checkout.sessions.create(newPayload);
  return session;
};
export const makeSessionExpirated = async (id) => {
  try {
    const session = await stripe.checkout.sessions.expire(id);
    return session;
  } catch (error) {}
  return null;
};
// Retrieve a Checkout Session
// Retrieves an existing Checkout Session using its ID.
const allstripeMethods = async () => {
  // 1 Create a Checkout Session
  // Creates a new Checkout Session.
  stripe.checkout.sessions.create(newPayload);
  // 2. Retrieve a Checkout Session
  // Retrieves an existing Checkout Session using its ID.
  stripe.checkout.sessions.retrieve("session_id");
  // 3. Expire a Checkout Session
  // Expires a Checkout Session, meaning it can no longer be used to complete a purchase.
  stripe.checkout.sessions.expire("session_id");
  //   4. List All Checkout Sessions
  // Lists all sessions filtered by optional parameters.
  stripe.checkout.sessions.list({
    limit: 3,
    customer: "customer_id", // Optionally filter by customer
  });
};
// Webhook endpoint for handling Checkout events
const Webhook = () => {
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          // Fulfill the purchase...
          break;
        // Other event types...
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    }
  );
};
