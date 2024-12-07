import mongoose from "mongoose";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { UserModel } from "../../database/models/user.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { removeSpecificText } from "../../utils/handletypes.js";
import responseHandler from "../../utils/responseHandler.js";
import { deleteOne, FindAll } from "../handlers/crudHandler.js";
import { clearUserCacheIfAdmin } from "../auth/auth.services.js";

const createuser = AsyncHandler(async (req, res, next) => {
  let cheackUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (cheackUser)
    return next(
      new AppError(
        responseHandler("conflict", undefined, "user already exists")
      )
    );
  const user = new UserModel(req.body);
  await user.save();
  return res.json({
    message: "sucess",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isblocked: user.isblocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: { fullName: req.user.fullName, _id: req.user._id },
    },
  });
});
const updateuser = AsyncHandler(async (req, res, next) => {
  if (req.body.email) {
    let user = await UserModel.findOne({
      email: req.body.email,
      _id: {
        $ne: req?.params?.id,
      },
    });
    if (user) return next(new AppError(responseHandler("conflict", "email")));
  }

  let data = await UserModel.findByIdAndUpdate(req?.params?.id, req?.body, {
    new: true,
  })
    .lean()
    .populate("createdBy", "fullName")
    .select("-password");
  if (!data) next(new AppError(responseHandler("NotFound", "user")));
  data = {
    ...data,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  clearUserCacheIfAdmin(user);
  return res.status(200).json({ message: "Updated Sucessfully", data });
});
const deleteUser = deleteOne({
  model: UserModel,
  name: "user",
});
const getAllUsers = FindAll({
  model: UserModel,
  customFiltersFN: (req, res, next) => {
    if (!req.query?.filters?.role) {
      req.query.filters = {
        ...(req?.query?.filters ? req?.query?.filters : {}),
        role: { $ne: enumRoles.admin },
      };
    }

    let fields = removeSpecificText(req.query?.fields, [
      "password",
      "-password",
    ]);

    req.query.fields = `${fields ? `${fields}` : "-password"}`;
    return req.query;
  },
  customPiplineFN: (pipeline, query, user) => {
    let $match = {
      _id: { $ne: new mongoose.Types.ObjectId(user?._id) },
    };
    pipeline.push({ $match });
  },
});
const findOneUser = AsyncHandler(async (req, res, next) => {
  if (req?.user?._id?.toString() === req?.params?.id.toString()) {
    if (!document) return next(new AppError(httpStatus.NotFound));
  }
  const document = await UserModel.findById({ _id: req.params.id })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName")
    .select("-password");
  if (!document) return next(new AppError(httpStatus.NotFound));
  return res.status(200).json(document);
});
export { updateuser, deleteUser, createuser, getAllUsers, findOneUser };
