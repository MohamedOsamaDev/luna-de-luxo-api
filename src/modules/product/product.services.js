export const preFindproduct = function (next) {
  if (this.options.disablePrepopulate) return next();
  this.populate([
    {
      path: "colors.color",
      model: "color",
      options: { strictPopulate: false },
      select: "_id code name",
    },
    {
      path: "colors.images",
      model: "file",
      options: { strictPopulate: false },
      select: "_id url mimetype",
    },
    {
      path: "poster",
      model: "file",
      options: { strictPopulate: false },
      select: "_id url mimetype",
    },
    {
      path: "colors.sizes.size",
      model: "size",
      select: "_id name",
      options: { strictPopulate: false },
    },
    {
      path: "category",
      model: "category",
      select: "_id name slug -poster",
      options: { strictPopulate: false },
    },
    {
      path: "subcategory",
      model: "subcategory",
      select: "_id name slug -poster",
      options: { strictPopulate: false },
    },
  ]);
  next();
};

export let customQueryproduct = [
  {
    field: "size",
    fromCollection: "sizes",
    localField: "colors.sizes.size",
    foreignField: "_id",
    matchField: "name",
  },
  {
    field: "color",
    fromCollection: "colors",
    localField: "colors.color",
    foreignField: "_id",
    matchField: "name",
  },
  {
    field: "category",
    fromCollection: "categories",
    localField: "category",
    foreignField: "_id",
    matchField: "slug",
  },
  {
    field: "subcategory",
    fromCollection: "subcategories",
    localField: "subcategory",
    foreignField: "_id",
    matchField: "slug",
  },
];

export let colorsLookup = [
  // Lookup for category
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $unwind: {
      path: "$category",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Lookup for subcategory
  {
    $lookup: {
      from: "subcategories",
      localField: "subcategory",
      foreignField: "_id",
      as: "subcategory",
    },
  },
  {
    $unwind: {
      path: "$subcategory",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Lookup for poster
  {
    $lookup: {
      from: "files",
      localField: "poster",
      foreignField: "_id",
      as: "poster",
    },
  },
  {
    $unwind: {
      path: "$poster",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Unwind colors array for nested lookups
  {
    $unwind: {
      path: "$colors",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Lookup the image details using the image IDs
  {
    $lookup: {
      from: "files", // The images collection
      localField: "colors.images", // Field in the colors array
      foreignField: "_id", // Field in the images collection
      as: "colors.images", // Output array field containing image details
    },
  },
  // Lookup for colors.color
  {
    $lookup: {
      from: "colors",
      localField: "colors.color",
      foreignField: "_id",
      as: "colors.color",
    },
  },
  {
    $unwind: {
      path: "$colors.color",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Unwind sizes array for nested lookup
  {
    $unwind: {
      path: "$colors.sizes",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Lookup for colors.sizes.size
  {
    $lookup: {
      from: "sizes",
      localField: "colors.sizes.size",
      foreignField: "_id",
      as: "colors.sizes.size",
    },
  },
  {
    $unwind: {
      path: "$colors.sizes.size",
      preserveNullAndEmptyArrays: true,
    },
  },
  // Re-group the sizes array within each color
  {
    $group: {
      _id: {
        colorId: "$colors._id",
        rootId: "$_id",
      },
      sizes: {
        $push: "$colors.sizes",
      },
      stock: {
        $first: "$colors.stock",
      },
      images: {
        $first: "$colors.images",
      },
      color: { $first: "$colors.color" },
      root: { $first: "$$ROOT" },
    },
  },
  // Re-group the colors array at the root level
  {
    $group: {
      _id: "$_id.rootId",
      colors: {
        $push: {
          color: "$color",
          images: "$images",
          stock: {
            $cond: [{ $eq: ["$root.type", "decor"] }, "$stock", "$$REMOVE"],
          },
          sizes: {
            $cond: [{ $eq: ["$root.type", "clothes"] }, "$sizes", "$$REMOVE"],
          },
        },
      },
      root: { $first: "$root" },
    },
  },
  // Merge the root document fields with the new colors array
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ["$root", { colors: "$colors" }],
      },
    },
  },
];

const decoreCase = (product, selectedOptions = {}) => {
try {
  const { color } = selectedOptions;

  const iColorVaild = product?.colors?.find(
    (val) => val?.color?._id?.toString() === color?.toString()
  );
  return !!iColorVaild
} catch (error) {
  
}
return false
};

const clothesCase = (product, selectedOptions) => {
  try {
    const { color, size } = selectedOptions;
  
    const iColorVaild = product?.colors?.find(
      (val) => val?.color?._id?.toString() === color?.toString()
    );
    const iSizeVaild = iColorVaild?.sizes?.find(
      (val) => val?.size?._id?.toString() === size?.toString()
    );
    return !!iSizeVaild
  } catch (error) { 
  }
  return false
};
export const allproductTypes = {
  decor: decoreCase,
  clothes: clothesCase,
};
