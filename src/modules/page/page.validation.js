// landing create
import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import { UpdateCategorySchemaVal } from "../category/category.validation.js";
import { UpdateproductSchemaVal } from "../product/product.validation.js";
import { commensVal } from "../commens/validation.js";
export const landingCreateVal = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  sliderLanding: Joi.array()
    .min(1)
    .items(
      Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        poster: relationFileVal,
      })
    ),
  topCategories: Joi.array().min(1).items(UpdateCategorySchemaVal),
  featuredProducts: Joi.array().min(1).items(UpdateproductSchemaVal),
  newIn: Joi.object({
    title: Joi.string().trim().required(),
    linkTitle: Joi.string().trim().required(),
    linkHref: Joi.string().trim().required(),
    poster: relationFileVal,
  }),
  customProduct: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    poster: relationFileVal,
  }),
});
// landing update
export const landingUpdateVal = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  sliderLanding: Joi.array()
    .min(1)
    .items(
      Joi.object({
        title: Joi.string().trim(),
        description: Joi.string().trim(),
        poster: relationFileVal,
        ...commensVal,
      })
    ),
  topCategories: Joi.array().min(1).items(UpdateCategorySchemaVal),
  featuredProducts: Joi.array().min(1).items(Joi.any()),
  newIn: Joi.object({
    title: Joi.string().trim(),
    linkTitle: Joi.string().trim(),
    linkHref: Joi.string().trim(),
    poster: relationFileVal,
    ...commensVal,
  }),
  customProduct: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    poster: relationFileVal,
    ...commensVal,
  }),
  ...commensVal,
});
