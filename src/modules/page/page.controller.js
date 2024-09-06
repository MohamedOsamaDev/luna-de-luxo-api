import { SingleTypeModel } from "../../database/models/singleType.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { adminPopulate } from "../commens/populate.js";
import { allPagesModel } from "./page.services.js";

const insertPage = AsyncHandler(async (req, res, next) => {
  const key = req.params.key;
  const check = await SingleTypeModel.findOne({ key });
  if (check)
    return next(
      new AppError({ message: `page already exist with same title`, code: 401 })
    );

  let Model = allPagesModel[key];
  if (!Model) {
    return next(new AppError({ message: `Page not found`, code: 404 }));
  }

  req.body.key = key;
  const newPage = new Model(req.body);
  newPage.createdBy = req.user._id;
  await newPage.save();
  return res.status(201).send({
    message: "page saved successfully",
    data: newPage,
  });
});
const getPage = AsyncHandler(async (req, res, next) => {
  const populateOptions = req.user?.role === "admin" ? adminPopulate : [];
  let key = req.params.key;
  let Model = allPagesModel[key];
  if (!Model) {
    return next(new AppError({ message: `Page not found`, code: 404 }));
  }
  const query = { key };
  const document = await Model.findOne(query).populate(populateOptions).lean();
  if (!document) {
    return next(new AppError({ message: "Page not found", code: 404 }));
  }
  res.status(200).json(document);
});
const updatePage = AsyncHandler(async (req, res, next) => {
  // Find the single Model first to determine its type
  let key = req.params.key;
  let Model = allPagesModel[key];
  if (!Model) {
    return next(new AppError({ message: `Page is not found`, code: 404 }));
  }
  const populateOptions = req.user?.role === "admin" ? adminPopulate : [];
  const data = await Model.findOneAndUpdate(
    {
      key,
    },
    req?.body,
    {
      new: true,
    }
  ).populate(populateOptions);
  if (!data)
    return next(new AppError({ message: `Page is not found`, code: 404 }));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

export { insertPage, getPage, updatePage };
