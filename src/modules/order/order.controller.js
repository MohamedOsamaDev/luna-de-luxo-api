import { cartModel } from "../../database/models/cart.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  FindAll,
  makeMultibulkWrite,
  updateOne,
} from "./../handlers/crudHandler.js";
import {
  insertOrder,
  OrderCompleted,
  orderFiled,
} from "./services/order.services.js";
import { handleSubmitUseCoupon } from "../coupon/coupon.services.js";
import { orderModel } from "../../database/models/order.model.js";
import { createGetwaySession } from "../sessionGetway/sessionGetway.services.js";

import { createStripeSession } from "../../services/payments/stripe/session.js";
import { createJwt, verifyJwt } from "../../utils/jwt.js";
import httpStatus from "../../assets/messages/httpStatus.js";

const createCheckOutSession = AsyncHandler(async (req, res) => {
  // create getway session and return the session id
  const { order, bulkOperations } = req.makeOrder;
  //create
  const newOrder = await insertOrder(order);
  // perpare Session payload
  const secureSignature = createJwt(
    {
      user: req.user._id,
      order: newOrder._id,
    },
    {
      expiresIn: "15m",
    }
  );

  const payload = {
    user: req.user,
    order: newOrder,
    shippingAddress: req.body.shippingAddress,
    secureSignature,
  };
  // create stripe Session
  const session = await createStripeSession(payload);
  // create record getway Session into database
  await createGetwaySession({
    user: req.user?._id,
    order: newOrder._id,
    getwayProvidor: order?.paymentType,
    session: session?.id,
  });

  // Update stock products
  await makeMultibulkWrite(bulkOperations);
  return res.json({
    message: "Checkout session created successfully",
    session: session?.url,
  });
});
const verfiyOrder = AsyncHandler(
  async (req, res) => {
    const { sig = null } = req.query;
    if (!sig) {
      return next(new AppError(httpStatus.unAuthorized));
    }
    const payload = verifyJwt(sig, process.env.JWT_SECRET);
    if (!payload) {
      return next(new AppError(httpStatus.sessionExpired));
    }
    const { user, order } = payload;
    const foundOrder = await orderModel.findById(order);
    if (!foundOrder || !foundOrder?.orderSession) {
      return next(new AppError(httpStatus.NotFound));
    }
    foundOrder.orderSession = true;
    await orderModel.findByIdAndUpdate(foundOrder._id, foundOrder);
    return res.json({
      message: "Order completed successfully",
    });
  },
  {
    onError: httpStatus.unAuthorized,
  }
);

const createOrder = AsyncHandler(async (req, res, next) => {
  const { order, bulkOperations } = req.makeOrder;
  // Handle order creation
  const newOrder = await insertOrder(order);
  // Handle coupon usage
  await handleSubmitUseCoupon(newOrder);
  // Handle clear cart
  await cartModel.findByIdAndUpdate(req?.user?.cart?._id, { items: [] });
  return res.status(201).json({
    message: "Order created successfully",
  });
});

const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const isAdmin = user.role === "admin";

  let query = orderModel.findById(id);

  if (isAdmin) {
    query = query.populate([
      { path: "user", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
      { path: "updatedBy", select: "fullName email" },
    ]);
  }

  const order = await query;

  if (!order || (order.user.toString() !== user._id.toString() && !isAdmin)) {
    return next(new AppError({ message: "Order not found", code: 404 }));
  }

  return res.json(order);
});

const config = {
  model: orderModel,
  name: "order",
  publish: false,
  customFiltersFN: (req) => {
    let user = req.user;
    let query = req.query;
    if (!user.role === "admin") {
      query = { user: user?._id };
    }
    return query;
  },
};
const getAllOrders = FindAll(config);
const updateOrder = updateOne(config);
const webhookOrders = AsyncHandler(async (req, res, next) => {
  let { event } = req.webhook;
  const allEvenets = {
    "checkout.session.completed": OrderCompleted,
    "payment.intent.payment_failed": orderFiled,
    default: () => {},
  };
  const handler = allEvenets[event.type];
  //client_reference_id is ref to order id
  if (handler) {
    await handler(event?.data.object?.client_reference_id);
  } else {
    console.log(`Unhandled event type ${event}`);
  }
  return res.json({ received: true });
});
export {
  createOrder,
  getSpecificOrder,
  createCheckOutSession,
  getAllOrders,
  updateOrder,
  webhookOrders,
  verfiyOrder,
};

// let testdata = {
//   id: "evt_1PxvFi2MB7cIzNR0cFl0xjEk",
//   object: "event",
//   api_version: "2024-06-20",
//   created: 1726079214,
//   data: {
//     object: {
//       id: "cs_test_a1JIPffnXQlGqszdGTZkfAcbGxBUxcT5MkeDzVHGV6sftaQxFBrvlE5myT",
//       object: "checkout.session",
//       after_expiration: null,
//       allow_promotion_codes: null,
//       amount_subtotal: 55000,
//       amount_total: 55000,
//       automatic_tax: [Object],
//       billing_address_collection: null,
//       cancel_url: "https://www.lunadeluxo.com/checkout",
//       client_reference_id: "66cvdv4re5gERGv4TGRgb",
//       client_secret: null,
//       consent: null,
//       consent_collection: null,
//       created: 1726079206,
//       currency: "usd",
//       currency_conversion: null,
//       custom_fields: [],
//       custom_text: [Object],
//       customer: null,
//       customer_creation: "if_required",
//       customer_details: [Object],
//       customer_email: "mohamedosdama10085@gmail.com",
//       expires_at: 1726165606,
//       invoice: null,
//       invoice_creation: [Object],
//       livemode: false,
//       locale: null,
//       metadata: [Object],
//       mode: "payment",
//       payment_intent: "pi_3PxvFh2MB7cIzNR00ejpK3c0",
//       payment_link: null,
//       payment_method_collection: "if_required",
//       payment_method_configuration_details: null,
//       payment_method_options: [Object],
//       payment_method_types: [Array],
//       payment_status: "paid",
//       phone_number_collection: [Object],
//       recovered_from: null,
//       saved_payment_method_options: null,
//       setup_intent: null,
//       shipping_address_collection: null,
//       shipping_cost: null,
//       shipping_details: null,
//       shipping_options: [],
//       status: "complete",
//       submit_type: null,
//       subscription: null,
//       success_url: "https://www.lunadeluxo.com/profile/my-purchases",
//       total_details: [Object],
//       ui_mode: "hosted",
//       url: null,
//     },
//   },
//   livemode: false,
//   pending_webhooks: 1,
//   request: { id: null, idempotency_key: null },
//   type: "checkout.session.completed",
// };
