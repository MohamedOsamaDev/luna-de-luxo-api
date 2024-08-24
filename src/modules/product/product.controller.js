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

let config = {
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
  let data;
  if (type === "clothes") {
    data = new ClothesModel(req.body);
  } else if (type === "decor") {
    data = new DecorModel(req.body);
  } else {
    res.status(400).send("Invalid product type");
  }
  await data.save();
  data = {
    ...data?._doc,
    createdBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  res.status(200).json({
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

  let model;
  switch (product?.type) {
    case "decor":
      model = DecorModel;
      break;
    case "clothes":
      model = ClothesModel;
      break;
    default:
      model = productModel;
  }
  let data = await model
    .findByIdAndUpdate(req.params.id, req?.body, {
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
});
const getFilters = AsyncHandler(async (req, res, next) => {
  // let query = {
  //   publish: true,
  //   limit: 20,
  // };
  const colors = await colorModel.find().lean();
  const categories = await categoryModel.find().lean();
  const sizes = await sizeModel.find().lean();

  res.status(200).json({
    message: "success",
    colors,
    categories,
    sizes,
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
