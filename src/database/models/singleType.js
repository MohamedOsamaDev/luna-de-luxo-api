import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true, // Ensure key is unique
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    publish: { type: Boolean, default: false, default: false },
  },
  { timestamps: true }
);
schema.pre(/^find/, function (next) {
  this.populate({
    path: "topCategories",
    model: "category",
    select: "_id name poster slug", // Example fields to select from the 'color' model
    options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
  })
    .populate({
      path: "sliderLanding.poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "newInPoster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "customProductPoster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "visionPoster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "missionPoster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "categories.poster",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "categories.category",
      model: "category",
      select: "_id name description", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "categories.content.image",
      model: "file",
      select: "_id url", // Example fields to select from the 'color' model
      options: { strictPopulate: false }, // Disable strictPopulate for this path if needed
    })
    .populate({
      path: "featuredProducts",
      model: "product",
      select: "_id name poster price discount slug",
      options: { strictPopulate: false },
      match: { isFeatured: true }, // Only include products that are featured
    });
  next();
});
export const SingleTypeModel = mongoose.model("singletype", schema);

// Q&A_Page Schema
// FAQ Schema
const faqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Title is required"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Description is required"],
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Category name is too short"],
      },
      questions: [
        {
          question: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Question is too short"],
          },
          answer: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Answer is too short"],
          },
        },
      ],
    },
  ],
});

// FAQ Model
export const faqPageModel = SingleTypeModel.discriminator("faq", faqSchema);

// landing_Page Schema
const landingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: [1, "too short brand name"],
  },
  description: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
  sliderLanding: [
    {
      title: {
        type: String,
        trim: true,
        required: true,
        minLength: [1, "too short brand name"],
      },
      description: {
        type: String,
        trim: true,
        minLength: [1, "too short brand name"],
        required: true,
      },
      poster: { type: ObjectId, ref: "file" },
    },
  ],
  topCategories: [{ type: ObjectId, ref: "category" }],
  featuredProducts: [{ type: ObjectId, ref: "product" }],
  newInPoster: { type: ObjectId, ref: "file" },
  newInTitle: {
    type: String,
    trim: true,
    minLength: [1, "too short brand name"],
    required: true,
  },
  customProductTitle: {
    type: String,
    trim: true,
    required: true,
    minLength: [1, "Custom product title is required"],
  },
  customProductDescription: {
    type: String,
    trim: true,
    required: true,
    minLength: [1, "Custom product description is required"],
  },
  customProductPoster: { type: ObjectId, ref: "file" },
});

export const landingPageModel = SingleTypeModel.discriminator(
  "landing",
  landingSchema
);

// about_us_Page Schema
const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Title is required"],
    maxLength: [150, "Title cannot exceed 150 characters"],
  },
  subtitle: {
    type: String,
    trim: true,
    maxLength: [150, "Subtitle cannot exceed 150 characters"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Description is required"],
    maxLength: [5000, "Description cannot exceed 5000 characters"],
  },
  missionStatement: {
    type: String,
    trim: true,
    minLength: [1, "Mission statement is required"],
    maxLength: [2000, "Mission statement cannot exceed 2000 characters"],
  },
  missionPoster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "file",
    required: false,
    message: "Mission poster image is optional",
  },
  visionStatement: {
    type: String,
    trim: true,
    minLength: [1, "Vision statement is required"],
    maxLength: [2000, "Vision statement cannot exceed 2000 characters"],
  },
  visionPoster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "file",
    required: false,
    message: "Vision poster image is optional",
  },
  poster: { type: ObjectId, ref: "file" },
});
export const aboutPageModel = SingleTypeModel.discriminator(
  "about_us",
  aboutUsSchema
);

// products_Page Schema
const warningSchema = new mongoose.Schema({
  publish: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
export const warningPageModel = SingleTypeModel.discriminator(
  "warning",
  warningSchema
);
// warning messages that will be displayed when develment team is upgrading in system

const privacyPolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Title is required"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Description is required"],
  },
  parts: [
    {
      partTitle: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Part title is required"],
      },
      partDescription: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Part description is required"],
      },
      subSections: [
        {
          subSectionTitle: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Sub-section title is required"],
          },
          subSectionContent: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Sub-section content is required"],
          },
        },
      ],
    },
  ],
  updatedBy: {
    type: ObjectId,
    ref: "user",
  },
  createdBy: {
    type: ObjectId,
    ref: "user",
  },
});

export const privacyPolicyPageModel = SingleTypeModel.discriminator(
  "privacy_policy",
  privacyPolicySchema
);

const legalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Title is required"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Description is required"],
  },
  contentBlocks: [
    {
      header: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Header is required"],
      },
      body: {
        type: String,
        required: true,
        trim: true,
        minLength: [1, "Body content is required"],
      },
    },
  ],
  updatedBy: {
    type: ObjectId,
    ref: "user",
  },
  createdBy: {
    type: ObjectId,
    ref: "user",
  },
});

export const legalPageModel = SingleTypeModel.discriminator(
  "legal",
  legalSchema
);

const careServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Title is required"],
      maxLength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Description is required"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    categories: [
      {
        category: {
          type: ObjectId,
          ref: "category",
          required: true,
        },
        poster: {
          type: ObjectId,
          ref: "file",
          required: true,
        },
        content: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Part title is required"],
            },
            description: {
              type: String,
              required: true,
              trim: true,
              minLength: [1, "Part description is required"],
            },
            image: {
              type: ObjectId,
              ref: "file",
              required: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const CareServiceModel = SingleTypeModel.discriminator(
  "care_service",
  careServiceSchema
);
