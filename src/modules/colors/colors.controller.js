import { colorModel } from "../../database/models/color.model.js";
import {
  deleteOne,
  FindAll,
  FindOne,
  InsertOne,
  updateOne,
} from "../handlers/crudHandler.js";

const config = {
  model: colorModel,
  name: "color",
  slug: "name",
  uniqueFields: ["name", "code"],
  options: {
    searchFeilds: ["name", "code"],
  },
};
const addOneColor = InsertOne(config);
const UpdateOneColor = updateOne(config);
const getOneColor = FindOne(config);
const GetAllColors = FindAll(config);
const DeleteOneColor = deleteOne(config);

export {
  addOneColor,
  GetAllColors,
  DeleteOneColor,
  UpdateOneColor,
  getOneColor,
};
