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
function extractFromValues(pipeline) {
  const result = [];
  for (const step of pipeline) {
    if (step.$lookup?.from) {
      result.push(step.$lookup.from);
    }
  }
  return result;
}
export const handleFilterwithLookUp = (
  filters = [],
  searchQuery = {},
  currentPipline = []
) => {
  let pipeline = [];
  const current = extractFromValues(currentPipline);
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
        if (!current?.includes(fromCollection)) {
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
        }
        pipeline.push({
          $match: {
            [`${field}.${matchField}`]: convrtQueryToIn(searchQuery[field]),
          },
        });
        delete searchQuery[field];
      }
    });
  } catch (e) {}

  return pipeline;
};
