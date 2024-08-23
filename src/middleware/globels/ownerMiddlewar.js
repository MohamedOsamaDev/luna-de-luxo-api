import { productModel } from "../../database/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const ownerMiddlewar = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id); // find the product
  if (!product) return next(new AppError("product not found", 401)); // if product is not found
  res.locals.schema = product;
  const chekcer = product.brand.havePermission.find(
    (val) => val.toString() === req.user._id.toString()
  );
  //check if this user has permission to update this product
  if (
    product.createdBy.toString() !== req.user._id.toString() &&
    !chekcer &&
    req.user.role !== "super_admin"
  )
    return next(
      new AppError("you are not have permission to access this product", 401)
    );
  return next(); // if this user is owner then return next to update or delete this product
});
