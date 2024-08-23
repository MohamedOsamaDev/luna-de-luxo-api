import { SubCategoryModel } from "./../../database/models/subcategory.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";


const config = {
  model: SubCategoryModel,
  name: "subcategory",
  uniqueFields: ["name"],
};
const addOneSubCategory = InsertOne(config);
const updateOneSubCategory = updateOne(config);
const getOneSubCategory = FindOne(config);
const getAllSubCategories = FindAll(config);
const deleteOneSubCategory = deleteOne(config);

export {
  addOneSubCategory,
  updateOneSubCategory,
  getOneSubCategory,
  getAllSubCategories,
  deleteOneSubCategory,
};
