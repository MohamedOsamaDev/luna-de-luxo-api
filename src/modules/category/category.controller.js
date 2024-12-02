import { categoryModel } from "../../database/models/category.model.js";
import { Posterlookup } from "../commens/lookup.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
const config = {
  model: categoryModel,
  name: "category",
  slug: "name",
  pushToPipeLine: Posterlookup,
  options: {
    searchFeilds: [
      "slug",
      "name",
      "description",
    ],
  },
};
const addOneCategory = InsertOne(config);
const getAllCategoryies = FindAll(config);
const getOneCategory = FindOne(config);
const updateOneCategory = updateOne(config);
const deleteOneCategory = deleteOne(config);

export {
  addOneCategory,
  getAllCategoryies,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
};
