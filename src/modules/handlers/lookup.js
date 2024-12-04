export const imageLookup = (key = "poster") => {
  return [
    {
      $lookup: {
        from: "files", // Assuming 'files' is the collection where posters are stored
        localField: key,
        foreignField: "_id",
        as: key,
        pipeline: [
          {
            $project: { url: 1, _id: 0 },
          },
        ],
      },
    },
    {
      $addFields: {
        [key]: { $arrayElemAt: [`$${key}`, 0] },
      },
    },
  ];
};



export const adminPopulatePipeline = [
  {
    // Lookup for the createdBy field
    $lookup: {
      from: "users", // Assuming 'users' is the collection where createdBy is stored
      localField: "createdBy",
      foreignField: "_id",
      as: "createdBy",
    },
  },
  {
    // Unwind the createdBy array (since lookup returns an array)
    $unwind: {
      path: "$createdBy",
      preserveNullAndEmptyArrays: true, // In case createdBy is null
    },
  },
  {
    // Lookup for the updatedBy field
    $lookup: {
      from: "users", // Assuming 'users' is the collection where updatedBy is stored
      localField: "updatedBy",
      foreignField: "_id",
      as: "updatedBy",
    },
  },
  {
    // Unwind the updatedBy array
    $unwind: {
      path: "$updatedBy",
      preserveNullAndEmptyArrays: true, // In case updatedBy is null
    },
  },
  {
    // Use $addFields to dynamically keep all root fields and modify createdBy and updatedBy
    $addFields: {
      createdBy: { $ifNull: ["$createdBy.fullName", null] },
      updatedBy: { $ifNull: ["$updatedBy.fullName", null] },
    },
  },
];
export const adminPopulate = [
  {
    path: "createdBy",
    select: "fullName",
  },
  {
    path: "updatedBy",
    select: "fullName",
  },
];

export const adminPopulateHandler = (user = {}) => {
  return user?.role === "admin" ? adminPopulate : [];
};
