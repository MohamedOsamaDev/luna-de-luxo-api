import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import responseHandler from "./../../utils/responseHandler.js";
import {
  handleFilterwithLookUp,
  handleQuerySlugOrid,
} from "../../utils/QueryHandler.js";

export const InsertOne = ({
  model,
  slug = null,
  name = "",
  uniqueFields = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    if (uniqueFields?.length) {
      const queryForCheck = {
        $or: [],
      };
      for (let i = 0; i < uniqueFields.length; i++) {
        if (req.body?.[uniqueFields[i]]) {
          queryForCheck.$or.push({
            [uniqueFields[i]]: req.body?.[uniqueFields[i]],
          });
        }
      }
      if (slug && req.body?.[slug]) {
        queryForCheck.$or.push({
          [slug]: req.body?.[slug],
        });
      }
      const checkdata = await model.findOne(queryForCheck);
      if (checkdata) {
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists `)
          )
        );
      }
    } else if (req.body?.[slug]) {
      const checkDocument = await model.findOne({
        [slug]: req.body[slug],
      });
      if (checkDocument)
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists`)
          )
        );
      req.body.slug = slugify(req?.body?.[slug]);
    }
    const document = new model(req.body);
    await document.save();
    let data = {
      ...document?._doc,
      createdBy: { fullName: req.user.fullName, _id: req.user._id },
    };
    res.status(200).json({
      message: `${name} Added Sucessfully`,
      data,
    });
  });
};
export const FindAll = ({
  model,
  defaultSort = "createdAt:desc",
  customQuery = null, // Function to define custom query logic
  pushToPipeLine = [],
  customFiltersFN = null,
  publish = true,
}) => {
  return AsyncHandler(async (req, res, next) => {
    // Handle filter with lookup and apply custom query logic
    let pipeline = handleFilterwithLookUp(customQuery, req?.query);

    // Conditionally add $match for non-admin users
    if (req.user?.role !== "admin" && publish === true) {
      pipeline.push({
        $match: { publish: true },
      });
    }

    // Add custom query to pipeline
    pipeline = pipeline.concat(pushToPipeLine);
    let sort = req?.query?.sort || defaultSort;
    // Add custom filters to pipeline
    if (customFiltersFN) {
      req.query = {
        page: req?.query?.page,
        limit: req?.query?.limit,
        sort,
        ...customFiltersFN(req, res, next),
      };
    }
    // Add sort field to pipeline
    req.query.sort = sort;
    const apiFetcher = new ApiFetcher(pipeline, req?.query)
      .filter()
      .sort()
      .select()
      .search()
      .pagination();
    // Fetch data
    const data = await model.aggregate(apiFetcher.pipeline);

    // Calculate total pages
    const total = await apiFetcher.count(model);
    // Calculate total pages
    const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);
    let responsedata = {
      data,
      metadata: {
        ...apiFetcher.metadata,
        pages,
        total,
      },
    };

    res.status(200).json(responsedata);
  });
};
export const FindOne = ({ model, name = "" }) => {
  return AsyncHandler(async (req, res, next) => {
    let user = req?.user;
    const query = handleQuerySlugOrid(req.params?.id);
    let data = null;
    if (user?.role == "admin") {
      data = await model
        .findById(query).lean()
        .populate("createdBy", "fullName")
        .populate("updatedBy", "fullName");
    } else {
      data = await model.findOne(query).lean();
    }
    if (!data) return next(new AppError(responseHandler("NotFound", name)));
    res.status(200).json(data);
  });
};
export const updateOne = ({
  model,
  name = "",
  slug = "",
  uniqueFields = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    if (uniqueFields?.length) {
      const queryForCheck = {
        _id: { $ne: req.params?.id },
        $or: [],
      };
      for (let i = 0; i < uniqueFields.length; i++) {
        if (req.body?.[uniqueFields[i]]) {
          queryForCheck?.$or.push({
            [uniqueFields[i]]: req.body?.[uniqueFields[i]],
          });
        }
      }
      if (req.body?.[slug]) {
        queryForCheck.$or.push({
          [slug]: req.body?.[slug],
        });
      }
      if (queryForCheck?.$or.length) {
        const checkdata = await model.findOne(queryForCheck);
        if (checkdata) {
          return next(
            new AppError(
              responseHandler(
                "conflict",
                undefined,
                `${name} is already exists `
              )
            )
          );
        }
      }
    } else if (req.body?.[slug]) {
      const checkDocument = await model.findOne({
        [slug]: req.body[slug],
        _id: { $ne: req.params?.id },
      });
      if (checkDocument)
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists`)
          )
        );
      req.body.slug = slugify(req?.body?.[slug]);
    }

    let data = await model
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .populate("createdBy", "fullName");
    data = {
      ...data?._doc,
      updatedBy: { fullName: req.user.fullName, _id: req.user._id },
    };
    if (!data) return next(new AppError({ massage, code: 404 }));
    res.status(200).json({
      message: `${name} Updated Sucessfully`,
      data,
    });
  });
};
export const deleteOne = ({ model, name = "" }) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete({ _id: req.params.id });
    if (!document) return next(new AppError(httpStatus.NotFound));
    res.status(200).json({
      message: `${name} Deleted Sucessfully`,
    });
  });
};

export const makeMultibulkWrite = async (bulkOperation) => {
  Object?.keys(bulkOperation)?.forEach(async (type) => {
    try {
      let { model, tasks } = bulkOperation?.[type];
      await model.bulkWrite(tasks);
    } catch (error) {
      console.error(`Error while bulk writing ${type} products:`, error);
    }
  });
};

[
  // Match documents based on specific criteria if needed
  // { $match: { type: 'decor' } }, // Example to filter for 'decor' type

  // Unwind the `colors` array
  { $unwind: "$colors" },

  // Unwind the `images` array inside `colors`
  { $unwind: "$colors.images" },

  // Optionally, you can look up or join related collections here
  // Example: Lookup for image details
  {
    $lookup: {
      from: "files", // The collection name for images
      localField: "colors.images",
      foreignField: "_id",
      as: "imageDetails",
    },
  },

  // Optionally, unwind the image details array if needed
  { $unwind: "$imageDetails" },

  // Group by the required field or process the data as needed
  {
    $group: {
      _id: "$colors.color", // Group by color ID
      images: { $push: "$imageDetails" }, // Collect images details
    },
  },

  // Sort or project the data if needed
  { $sort: { _id: 1 } },
];
