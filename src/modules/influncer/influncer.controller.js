import { influencerModel } from "../../database/models/influencer.model.js";
import { UserModel } from "../../database/models/user.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import responseHandler from "../../utils/responseHandler.js";
import { FindAll, FindOne } from "../handlers/crudHandler.js";

const Errormassage = "influencer not found";

const InsertOne = AsyncHandler(async (req, res, next) => {
  let check = await influencerModel.findOne({
    socialAccount: req.body.socialAccount,
  });
  if (check)
    return next(
      new AppError(
        responseHandler(
          "NotFound",
          undefined,
          `Influncer social name is already in use`
        )
      )
    );
  req.body.influencer = req.user._id;
  let data = new influencerModel(req.body);
  await data.save();
  await UserModel.findByIdAndUpdate(req.user._id, {
    influencer: data._id,
  });
  data = {
    ...data?._doc,
    createdBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Added Sucessfully",
    data,
  });
});
const requestForBenfluencer = AsyncHandler(async (req, res, next) => {
  let check = await influencerModel.findOne({
    socialAccount: req.body.socialAccount,
  });
  if (check)
    return next(
      new AppError(
        responseHandler("conflict", undefined, ` social name is already in use`)
      )
    );
  req.body.relatedTo = req.user._id;
  const influencer = new influencerModel(req.body);
  await influencer.save();

  // await UserModel.findByIdAndUpdate(req.user._id, {
  //   influencer: influencer._id,
  // });

  return res.status(200).json({
    message: "Send Sucessfully",
    data: influencer,
  });
});
const Delete = AsyncHandler(async (req, res, next) => {
  const document = await influencerModel.findByIdAndDelete(req.params?.id);
  if (!document)
    return next(new AppError(responseHandler("NotFound", "Influncer")));
  
  return res.status(200).json({
    message: "Deleted Sucessfully",
  });
});

const Update = AsyncHandler(async (req, res, next) => {
  if (req.body.socialAccount) {
    let check = await influencerModel.findOne({
      socialAccount: req.body.socialAccount,
      _id: { $ne: req.params?.id }
    });
    if (check)
      return next(
        new AppError(
          responseHandler(
            "conflict",
            undefined,
            `social name is already in use`
          )
        )
      );
  }
  let data = await influencerModel
    .findByIdAndUpdate({ _id: req.params?.id }, req.body)
    .populate("createdBy", "fullName")
  if (!data)
    return next(new AppError(responseHandler("NotFound", `Influncer`)));
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

let config = {
  model: influencerModel,
  name: "influencer",
};
const GetAll = FindAll(config);
const GetOne =  FindOne(config)

export { InsertOne, GetAll, requestForBenfluencer, Delete, Update, GetOne };
