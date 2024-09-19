import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import {
  productModel,
  ClothesModel,
  DecorModel,
} from "./../../database/models/product.model.js";
import { FindAll, FindOne, deleteOne } from "../handlers/crudHandler.js";
import { colorModel } from "../../database/models/color.model.js";
import { categoryModel } from "../../database/models/category.model.js";
import { sizeModel } from "../../database/models/size.model.js";
import { Posterlookup } from "../commens/lookup.js";
import { customQueryproduct as customQuery } from "./product.services.js";
import { SubCategoryModel } from "../../database/models/subcategory.model.js";
import { AppError } from "../../utils/AppError.js";
import responseHandler from "../../utils/responseHandler.js";

const allproductTypes = {
  clothes: ClothesModel,
  decor: DecorModel,
};
const config = {
  model: productModel,
  name: "product",
  slug: "title",
  customQuery,
  pushToPipeLine: Posterlookup,
};
const deleteproduct = deleteOne(config);
const getallproduct = FindAll(config);
const getOneproduct = FindOne(config);

const addproduct = AsyncHandler(async (req, res, next) => {
  const { type } = req.body;
  const check = await productModel.findOne({ name: req.body.name });
  if (check)
    return next(
      new AppError(
        responseHandler(
          "conflict",
          undefined,
          `product already exist with same name`
        )
      )
    );
  req.body.slug = slugify(req.body.name);
  req.body.createdBy = req.user._id;
  let Model = allproductTypes?.[type];
  if (!Model) return res.status(400).send("Invalid product type");
  let data = new Model(req.body);
  await data.save();
  data = {
    ...data?._doc,
    createdBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Added Sucessfully",
    data,
  });
});
const updateproduct = AsyncHandler(async (req, res, next) => {
  // Find the product first to determine its type
  const product = await productModel.findById(req.params.id);
  if (!product)
    return next(new AppError(responseHandler("NotFound", "product")));

  if (req.body.name) {
    // check is name is already in database to avoid duplicates
    const check = await productModel.findOne({
      name: req.body.name,
      _id: { $ne: product?._id },
    });
    if (check)
      return next(
        new AppError(
          responseHandler(
            "conflict",
            undefined,
            `product already exist with same name`
          )
        )
      );
    req.body.slug = slugify(req.body.name);
  }

  req.body.createdBy = req.user._id;
  let Model = allproductTypes?.[product?.type];
  if (!Model) return res.status(400).send("Invalid product type");
  let data = await Model.findByIdAndUpdate(req.params.id, req?.body, {
    new: true,
  })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };

  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
})
const getFilters = AsyncHandler(async (req, res, next) => {
  let query = {
    publish: true,
  };
  let limit = 30;
  const handlePromise = (promise) => {
    return promise.then((data) => data).catch((error) => []);
  };
  const [colors, categories, sizes,subcategories] = await Promise.all([
    handlePromise(colorModel.find(query).limit(limit).lean()),
    handlePromise(categoryModel.find(query).limit(limit).lean()),
    handlePromise(sizeModel.find(query).limit(limit).lean()),
    handlePromise(SubCategoryModel.find(query).limit(limit).lean()),
  ]);
  return res.status(200).json({
    message: "success",
    colors,
    categories,
    sizes,
    subcategories,
  });
});
export {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
  getFilters,
};
