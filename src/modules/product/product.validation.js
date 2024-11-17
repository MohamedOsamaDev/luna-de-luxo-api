import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import {
  updateColorSchemaVal,
} from "../colors/colors.validation.js";
import { UpdateCategorySchemaVal } from "../category/category.validation.js";
let objectIdVal = Joi.string().hex().length(24);
let imagesVal = Joi.array().items(
  Joi.alternatives().try(objectIdVal, relationFileVal)
); // Validate ObjectId
let colorVal = Joi.alternatives().try(objectIdVal, updateColorSchemaVal);
const clothesVal = Joi.array().items(
  Joi.object({
    color: colorVal,
    images: imagesVal,
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.any(), // Validate ObjectId
        stock: Joi.number().min(0),
        _id: objectIdVal,
      })
    ),
    _id: objectIdVal,
  })
);
const decorVal = Joi.array()
  .items(
    Joi.object({
      color: colorVal,
      images: imagesVal,
      stock: Joi.number().min(0).default(0),
      _id: objectIdVal,
    })
  ).optional();
  
  const additionalInfo = Joi.object({
    title: Joi.string().min(1).max(300).required().trim(),
    _id: objectIdVal,
  });

const ProductSchemaVal = Joi.object({
  _id: objectIdVal,
  name: Joi.string().min(1).max(300).required().trim(),
  description: Joi.string().min(3).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  publish: Joi.boolean(),
  rateRange: Joi.number().min(0).max(100000).default(1).optional(),
  additionalInfo: Joi.array().items(additionalInfo),
  poster: Joi.alternatives().try(objectIdVal, relationFileVal),
  category: Joi.alternatives()
    .try(objectIdVal, UpdateCategorySchemaVal)
    .required(),
  subcategory: Joi.alternatives()
    .try(objectIdVal, UpdateCategorySchemaVal)
    .required(),
  type: Joi.string().valid("clothes", "decor").required(),
  colors: Joi.when("type", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }),
});
const UpdateproductSchemaVal = Joi.object({
  id: objectIdVal,
  _id: objectIdVal,
  name: Joi.string().min(1).max(300).trim(),
  description: Joi.string().min(1).max(1500),
  price: Joi.number().min(0),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  publish: Joi.boolean(),
  additionalInfo: Joi.array().items(additionalInfo),
  poster: Joi.alternatives().try(objectIdVal, relationFileVal),
  category: Joi.alternatives().try(objectIdVal, UpdateCategorySchemaVal),
  subcategory: Joi.alternatives().try(objectIdVal, UpdateCategorySchemaVal),
  type: Joi.string().valid("clothes", "decor"),
  colors: Joi.alternatives().try(clothesVal, decorVal),
  rateRange:Joi.number().min(0).max(100000).optional()
});
const paramsIdVal = Joi.object({
  id: objectIdVal,
});
const paramsSlugVal = Joi.object({
  id: Joi.alternatives()
    .try(
      Joi.string().min(1).max(300).required(),
      Joi.string().hex().length(24).required()
    )
    .required(),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal, paramsSlugVal };
