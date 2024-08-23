import Joi from "joi";

const createOrderVal = Joi.object({
  paymentMethod: Joi.string(),
  notes: Joi.string().max(500).optional(),
  shippingAddress: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    email: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    fullName: Joi.string().trim().required(),
  }).required(),
});
const updateOrderVal = Joi.object({
  user: Joi.object({
    email: Joi.string().email().optional(),
    fullName: Joi.string().trim().optional(),
    id: Joi.string().hex().length(24).optional(),
    _id: Joi.string().hex().length(24).optional(),
  }).optional(),
  notes: Joi.string().max(500).optional(),
  shippingAddress: Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    phone: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    postalCode: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
  }).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        original_id: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        discount: Joi.number().min(0).optional(),
        quantity: Joi.number().min(1).required(),
        poster: Joi.string().uri().optional(),
        selectedOptions: Joi.object({
          color: Joi.object().optional(),
          size: Joi.object().optional(),
        }).optional(),
        _id: Joi.string().optional(),
      })
    )
    .optional(),
  totalOrderPrice: Joi.number().min(0).optional(),
  orderStatus: Joi.string()
    .valid("pending", "accepted", "delivered", "canceled")
    .optional(),
  isRefunded: Joi.boolean().optional(),
  discount: Joi.number().min(0).optional(),
  id: Joi.string().hex().length(24).optional(),
  _id: Joi.string().hex().length(24).optional(),
  paidAt: Joi.date().optional(),
  deliveredAt: Joi.date().optional(),
});

export { createOrderVal, updateOrderVal };
