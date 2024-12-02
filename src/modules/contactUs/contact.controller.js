import { contactModel } from "../../database/models/contactUs.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { deleteOne, FindAll } from "../handlers/crudHandler.js";
import responseHandler from "./../../utils/responseHandler.js";
import { AppError } from "../../utils/AppError.js";

const config = {
  model: contactModel,
  name: "contact",
  options: {
    searchFeilds: ["name", "email", "mobile", "message"],
  },
};

const addOneContact = AsyncHandler(async (req, res, next) => {
  const data = new contactModel(req.body);
  await data.save();

  return res.status(200).json({
    message: "send Sucessfully",
  });
});

const getOneContact = AsyncHandler(async (req, res, next) => {
  let data = null;
  data = await contactModel.findById(req.params?.id).lean();
  if (!data) return next(new AppError(responseHandler("NotFound", "Form")));
  return res.status(200).json(data);
});

const getAllContacts = FindAll(config);
const deleteOneContact = deleteOne(config);

export { addOneContact, getOneContact, getAllContacts, deleteOneContact };
