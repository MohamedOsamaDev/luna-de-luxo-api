import { SubCategoryModel } from "./../../database/models/subcategory.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
import { populate } from "dotenv";
import mongoose from "mongoose";

const config = {
  model: SubCategoryModel,
  name: "subcategory",
  slug: "name",
  margeParam: "category",
  populate: [
    {
      path: "category",
      select: " _id name ", // select only the name field from the category model
    },
  ],
  customPiplineFN: (pipline, req) => {
    let { query } = req;
    if (query?.filters?.category) {
      pipline.push({
        $match: {
          category: new mongoose.Types.ObjectId(query?.filters?.category),
        },
      });
      delete query?.filters?.category 
    }
    //return pipline;
  },
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
