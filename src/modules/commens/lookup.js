export const Posterlookup = [
  {
    $lookup: {
      from: "files",
      localField: "poster",
      foreignField: "_id",
      as: "poster",
      pipeline: [
        {
          $project: { url: 1, _id: 0 },
        },
      ],
    },
  },
  {
    $addFields: {
      poster: { $arrayElemAt: ["$poster", 0] },
    },
  },
];
