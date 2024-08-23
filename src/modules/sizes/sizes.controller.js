import { sizeModel } from "../../database/models/size.model.js";
import {
  deleteOne,
  FindAll,
  FindOne,
  InsertOne,
  updateOne,
} from "../handlers/crudHandler.js";
const config = {
  model: sizeModel,
  name: "size",
  uniqueFields: ["name"],
};
const addOneSize = InsertOne(config);
const updateOneSize = updateOne(config);
const getOneSize = FindOne(config);
const getAllSizes = FindAll(config);
const deleteOneSize = deleteOne(config);

export { 
  addOneSize,
  updateOneSize,
  getOneSize,
  getAllSizes,
  deleteOneSize,
 };
