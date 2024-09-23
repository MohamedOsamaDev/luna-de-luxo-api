import { cartModel } from "../../database/models/cart.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  deleteOne,
  FindAll,
  makeMultibulkWrite,
  updateOne,
} from "./../handlers/crudHandler.js";
import {
  cancelSession,
  insertOrder,
  mainFilterOrder,
  OrderCompleted,
  orderFiled,
} from "./services/order.services.js";
import { upsertCouponRecord } from "../coupon/coupon.services.js";
import { orderModel } from "../../database/models/order.model.js";
import { createGetwaySession } from "../sessionGetway/sessionGetway.services.js";
import { createStripeSession } from "../../services/payments/stripe/session.js";
import { createJwt, verifyJwt } from "../../utils/jwt.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { getwaySessionModel } from "../../database/models/getwaySession.model.js";
//cash flow
const createOrder = AsyncHandler(async (req, res, next) => {
  const { order, bulkOperations } = req.makeOrder;
  // Handle order creation
  const newOrder = await insertOrder(order);

  // Handle clear cart
  await cartModel.findByIdAndUpdate(req?.user?.cart?._id, { items: [] });
  return res.status(201).json({
    message: "Order created successfully",
  });
});
// crud operations
const getSpecificOrder = AsyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const isAdmin = user.role === "admin";
  let populate = [];
  if (isAdmin) {
    populate = [
      { path: "user", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
      { path: "updatedBy", select: "fullName email" },
    ];
  }
  const order = await orderModel
    .findOne({
      _id: id,
      ...mainFilterOrder,
    })
    .populate(populate);
  if (!order || (order.user.toString() !== user._id.toString() && !isAdmin)) {
    return next(new AppError(httpStatus.NotFound));
  }

  return res.json(order);
});
const config = {
  model: orderModel,
  name: "order",
  publish: false,
  pushToPipeLine: [
    {
      $match: mainFilterOrder,
    },
  ],
  customPiplineFN: (pipeline, req, res, next) => {
    if (req?.user?.role !== "admin") {
      pipeline.push({
        $match: {
          user: { $eq: req?.user?._id },
        },
      });
    }
  },
};
const getAllOrders = FindAll(config);
const updateOrder = updateOne(config);
const deleteOrder = deleteOne(config);
// paymentsGetway
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
      expiresIn: "32m",
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
    getwayProvidor: "stripe",
    session: {
      id: session?.id,
      url: session?.url,
    },
  });

  // Update stock products
  await makeMultibulkWrite(bulkOperations);
  // Handle coupon usage
  await upsertCouponRecord(order);
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
    const payload = verifyJwt(sig, process.env.SECRETKEY);
    if (!payload) {
      return next(new AppError(httpStatus.sessionExpired));
    }
    const { user, order } = payload;
    const foundOrder = await orderModel.findById(order);
    if (!foundOrder) {
      return next(new AppError(httpStatus.NotFound));
    }
    return res.json({
      message: "Order completed successfully",
    });
  },
  {
    onError: httpStatus.unAuthorized,
  }
);
const cancelCheckOutSession = AsyncHandler(async (req, res, next) => {
  const sessionid = req.params?.session;
  const user = req.user;
  const session = await getwaySessionModel.findOne({
    user: user?._id,
    _id: sessionid,
  });

  if (!session) {
    return next(new AppError(httpStatus.NotFound));
  }

  await cancelSession(session);
  return res.json({
    message: "Checkout session cancelled successfully",
  });
});
// webhook
const webhookOrders_Stripe = AsyncHandler(async (req, res, next) => {
  const { event } = req.webhook;
  const allEvenets = {
    "checkout.session.completed": OrderCompleted,
    "checkout.session.expired": orderFiled,
    default: () => {},
  };
  const handler = allEvenets?.[event?.type];
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
  webhookOrders_Stripe,
  verfiyOrder,
  cancelCheckOutSession,
  deleteOrder,
};
