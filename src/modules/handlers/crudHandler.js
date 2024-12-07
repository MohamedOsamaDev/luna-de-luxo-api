import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import responseHandler from "./../../utils/responseHandler.js";
import {
  handleFilterwithLookUp,
  handleQuerySlugOrid,
} from "../../utils/QueryHandler.js";
import mongoose from "mongoose";

import { getNestedProperty } from "../../utils/handleObject.js";
import { adminPopulateHandler } from "./lookup.js";

// Helper Functions
const buildUniqueQuery = (reqBody, uniqueFields, slug, slugValue) => {
  const query = { $or: [] };
  uniqueFields.forEach((field) => {
    if (reqBody[field]) {
      query.$or.push({ [field]: reqBody[field] });
    }
  });
  if (slugValue) {
    query.$or.push({ slug: slugify(slugValue) });
  }
  return query.$or.length ? query : null;
};

const handleConflictError = (next, name) =>
  next(
    new AppError(
      responseHandler("conflict", undefined, `${name} already exists`)
    )
  );

// CRUD Operations
export const InsertOne = ({
  model,
  slug = null,
  name = "",
  uniqueFields = [],
  relationCacheTags = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    const { user = null } = req;
    const slugValue = getNestedProperty(req?.body, slug);
    const uniqueQuery = buildUniqueQuery(
      req.body,
      uniqueFields,
      slug,
      slugValue
    );

    if (uniqueQuery && (await model.findOne(uniqueQuery))) {
      return handleConflictError(next, name);
    }

    if (slug && slugValue) {
      req.body.slug = slugify(slugValue, { lower: true });
    }
    req.body.createdBy = user?._id;

    let data = await model
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId() },
        { $set: req.body },
        { new: true, upsert: true }
      )
      .setOptions({ admin: user?.role === "admin" });

    if (user) {
      data = {
        ...data?._doc,
        createdBy: { fullName: user?.fullName, _id: user?._id },
      };
    }

    return res.status(200).json(
      {
        message: `${name} added successfully`,
        data,
      },
      relationCacheTags
    );
  });
};

export const FindAll = ({
  model,
  customQuery = null,
  pushToPipeLine = [],
  customFiltersFN = null,
  customPiplineFN = null,
  publishMode = true,
  options = {},
  margeParam = null,
}) => {
  return AsyncHandler(async (req, res) => {
    const { user = null } = req;
    let pipeline = [
      ...pushToPipeLine,
      ...handleFilterwithLookUp(
        customQuery,
        req?.query?.filters,
        pushToPipeLine
      ),
    ];
    if (customFiltersFN) {
      req.query = {
        ...req.query,
        ...customFiltersFN(req, user),
      };
    }
    if (customPiplineFN) {
      customPiplineFN(pipeline, req.query, user);
    }

    if (
      margeParam &&
      req.params?.[margeParam] &&
      mongoose.Types.ObjectId.isValid(req.params?.[margeParam])
    ) {
      pipeline.push({
        $match: {
          [margeParam]: new mongoose.Types.ObjectId(req.params?.[margeParam]),
        },
      });
    }

    if (publishMode && user?.role !== "admin") {
      pipeline.push({ $match: { publish: true } });
    }
    const apiFetcher = new ApiFetcher(pipeline, req?.query, options)
      .filter()
      .search()
      .select()
      .sort()
      .pagination();

    const [data, total] = await Promise.all([
      model.aggregate(apiFetcher.pipeline),
      apiFetcher.count(model),
    ]);

    return res.status(200).json({
      metadata: {
        ...apiFetcher.metadata,
        pages: Math.ceil(total / apiFetcher.metadata.pageLimit),
        total,
      },
      data,
      pipeline: apiFetcher.pipeline,
    });
  });
};

export const FindOne = ({
  model,
  name = "",
  populate = [],
  publish = false,
}) => {
  return AsyncHandler(async (req, res, next) => {
    const { user } = req;
    const query = {
      ...handleQuerySlugOrid(req.params?.id),
      ...(publish && user?.role !== "admin" ? { publish: true } : {}),
    };

    let data = await model
      .findOne(query)
      .setOptions({ admin: user?.role === "admin" })
      .lean()
      .populate([...populate, ...adminPopulateHandler(user)]);

    if (!data) return next(new AppError(responseHandler("NotFound", name)));
    return res.status(200).json(data);
  });
};

export const updateOne = ({
  model,
  name = "",
  slug = "",
  uniqueFields = [],
  relationCacheTags = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    const { user } = req;
    const query = slug && req.body[slug] ? { [slug]: req.body[slug] } : null;
    const uniqueQuery = buildUniqueQuery(
      req.body,
      uniqueFields,
      slug,
      req.body[slug]
    );

    if (
      uniqueQuery &&
      (await model.findOne({ ...uniqueQuery, _id: { $ne: req.params.id } }))
    ) {
      return handleConflictError(next, name);
    }

    if (query) req.body.slug = slugify(req.body[slug]);
    req.body.updatedBy = user._id;

    let data = await model
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .setOptions({ admin: user?.role === "admin" })
      .lean()
      .populate(adminPopulateHandler(user));

    if (!data) return next(new AppError(responseHandler("NotFound", name)));
    return res.status(200).json(
      {
        message: `${name} updated successfully`,
        data: {
          ...data,
          updatedBy: { fullName: user?.fullName, _id: user?._id },
        },
      },
      relationCacheTags
    );
  });
};

export const deleteOne = ({
  model,
  name = "",
  mode = "hard",
  relationCacheTags = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    const operation =
      mode === "soft"
        ? model.findByIdAndUpdate(req.params.id, { isDeleted: true })
        : model.findByIdAndDelete(req.params.id);

    const document = await operation;
    if (!document) return next(new AppError(responseHandler("NotFound", name)));
    return res
      .status(200)
      .json({ message: `${name} deleted successfully` }, relationCacheTags);
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
