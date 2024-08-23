import mongoose from "mongoose";
export const handleQuerySlugOrid = (val) => {
  if (mongoose.Types.ObjectId.isValid(val)) {
    return { _id: val };
  } else {
    return { slug: val };
  }
};
export const convrtQueryToIn = (val) => {
  if (typeof val === "string" && val?.includes(",")) {
    val = { $in: val?.split(",").filter(Boolean) };
  }
  return val;
};
export const handleFilterwithLookUp = (filters = [], searchQuery = {}) => {
  let pipeline = [];
  try {
    filters?.map((val) => {
      const {
        field = "",
        fromCollection = "",
        localField = "",
        foreignField = "",
        matchField = "",
        unwind = false,
      } = val;
      if (searchQuery[field]) {
        pipeline.push({
          $lookup: {
            from: fromCollection,
            localField: localField,
            foreignField: foreignField,
            as: field,
          },
        });
        if (unwind) {
          pipeline.push({ $unwind: `$${field}` });
        }
        pipeline.push({
          $match: {
            [`${field}.${matchField}`]: convrtQueryToIn(searchQuery[field]),
          },
        });
        delete searchQuery[field];
      }
    });
  } catch (e) {
  }
  return pipeline;
};
export const handleArrayInQuery = (obj = {}, remove = []) => {
  // Create a new object to store the converted values
  const convertedObj = {};

  // Loop through each key-value pair in the object
  for (const key in obj) {
    // Check if the key should be removed
    if (!remove.includes(key)) {
      const value = obj[key];

      // Check if the value is a string and contains commas
      if (typeof value === "string" && value.includes(",")) {
        // Split the string into an array using commas as delimiters
        convertedObj[key] = value.split(",");
      } else {
        // If not a string with commas, keep the original value
        convertedObj[key] = value;
      }
    }
  }

  return convertedObj;
};
