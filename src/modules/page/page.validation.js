// landing create
import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import { UpdateCategorySchemaVal } from "../category/category.validation.js";
import { UpdateproductSchemaVal } from "../product/product.validation.js";
import { commensVal, objectIdVal } from "../commens/validation.js";

// Validation for landing
export const landingCreateVal = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  sliderLanding: Joi.array()
    .min(1)
    .items(
      Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        poster: relationFileVal,
      })
    ),
  topCategories: Joi.array().min(1).items(UpdateCategorySchemaVal),
  featuredProducts: Joi.array().min(1).items(UpdateproductSchemaVal),
  newIn: Joi.object({
    title: Joi.string().trim().required(),
    linkTitle: Joi.string().trim().required(),
    linkHref: Joi.string().trim().required(),
    poster: relationFileVal,
  }),
  customProduct: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    poster: relationFileVal,
  }),
});
export const landingUpdateVal = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  sliderLanding: Joi.array()
    .min(1)
    .items(
      Joi.object({
        title: Joi.string().trim(),
        description: Joi.string().trim(),
        poster: relationFileVal,
        ...commensVal,
      })
    ),
  topCategories: Joi.array().min(1).items(UpdateCategorySchemaVal),
  featuredProducts: Joi.array().min(1).items(Joi.any()),
  newIn: Joi.object({
    title: Joi.string().trim(),
    linkTitle: Joi.string().trim(),
    linkHref: Joi.string().trim(),
    poster: relationFileVal,
    ...commensVal,
  }),
  customProduct: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    poster: relationFileVal,
    ...commensVal,
  }),
  ...commensVal,
});

// Validation for FAQ
export const faqCreateVal = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  categories: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(1).required().messages({
          "string.min": "Category name is too short",
          "any.required": "Category name is required",
        }),
        questions: Joi.array()
          .items(
            Joi.object({
              question: Joi.string().trim().min(1).required().messages({
                "string.min": "Question is too short",
                "any.required": "Question is required",
              }),
              answer: Joi.string().trim().min(1).required().messages({
                "string.min": "Answer is too short",
                "any.required": "Answer is required",
              }),
              ...commensVal,
            })
          )
          .required(),
        ...commensVal,
      })
    )
    .required(),
});
export const faqUpdateVal = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  categories: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().min(1).messages({
        "string.min": "Category name is too short",
      }),
      questions: Joi.array().items(
        Joi.object({
          question: Joi.string().trim().min(1).messages({
            "string.min": "Question is too short",
          }),
          answer: Joi.string().trim().min(1).messages({
            "string.min": "Answer is too short",
          }),
          ...commensVal,
        })
      ),
      ...commensVal,
    })
  ),
  ...commensVal,
});

// Validation for careService
export const careServiceCreateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).required().messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().min(1).max(2000).required().messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  categories: Joi.array().items(
    Joi.object({
      category: objectIdVal.required().messages({
        "any.required": "Category is required",
      }),
      poster: relationFileVal,
      content: Joi.array().items(
        Joi.object({
          title: Joi.string().trim().min(1).required().messages({
            "string.min": "Part title is required",
            "any.required": "Part title is required",
          }),
          description: Joi.string().trim().min(1).required().messages({
            "string.min": "Part description is required",
            "any.required": "Part description is required",
          }),
          image: objectIdVal.optional(),
          ...commensVal,
        })
      ),
      ...commensVal,
    })
  ),
  ...commensVal,
});
export const careServiceUpdateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
  }),
  description: Joi.string().trim().min(1).max(2000).messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  categories: Joi.array().items(
    Joi.object({
      category: objectIdVal.messages({
        "any.required": "Category is required",
      }),
      poster: relationFileVal,
      content: Joi.array().items(
        Joi.object({
          title: Joi.string().trim().min(1).messages({
            "string.min": "Part title is required",
          }),
          description: Joi.string().trim().min(1).messages({
            "string.min": "Part description is required",
          }),
          image: objectIdVal.optional(),
          ...commensVal,
        })
      ),
      ...commensVal,
    })
  ),
  ...commensVal,
});

// Validation for aboutUs
export const aboutUsCreateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).required().messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  subtitle: Joi.string().trim().min(1).max(150).messages({
    "string.min": "subtitle is required",
    "string.max": "subtitle cannot exceed 150 characters",
    "any.required": "subtitle is required",
  }),
  description: Joi.string().trim().min(1).max(2000).required().messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),

  mission: Joi.object({
    missionStatement: Joi.string().trim().min(1).max(2000).required().messages({
      "string.min": "Description is required",
      "string.max": "Description cannot exceed 2000 characters",
      "any.required": "Description is required",
    }),
    missionPoster: relationFileVal,
    ...commensVal,
  }),
  vision: Joi.object({
    visionStatement: Joi.string().trim().min(1).max(2000).required().messages({
      "string.min": "Description is required",
      "string.max": "Description cannot exceed 2000 characters",
      "any.required": "Description is required",
    }),
    visionPoster: relationFileVal,
    ...commensVal,
  }),
  ...commensVal,
});
export const aboutUsUpdateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  subtitle: Joi.string().trim().min(1).max(150).messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().min(1).max(2000).messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),

  mission: Joi.object({
    missionStatement: Joi.string().trim().min(1).max(2000).messages({
      "string.min": "Description is required",
      "string.max": "Description cannot exceed 2000 characters",
      "any.required": "Description is required",
    }),
    missionPoster: relationFileVal,
    ...commensVal,
  }),
  vision: Joi.object({
    visionStatement: Joi.string().trim().min(1).max(2000).messages({
      "string.min": "Description is required",
      "string.max": "Description cannot exceed 2000 characters",
      "any.required": "Description is required",
    }),
    visionPoster: relationFileVal,
    ...commensVal,
  }),
  poster: relationFileVal,
  ...commensVal,
});

// Validation for privacy Policy
export const privacyPolicyCreateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).required().messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().min(1).max(2000).required().messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  parts: Joi.array()
    .items(
      Joi.object({
        partTitle: Joi.string().trim().min(1).max(150).required().messages({
          "string.min": "Part title is required",
          "string.max": "Part title cannot exceed 150 characters",
          "any.required": "Part title is required",
        }),
        partDescription: Joi.string()
          .trim()
          .min(1)
          .max(2000)
          .required()
          .messages({
            "string.min": "Part description is required",
            "string.max": "Part description cannot exceed 2000 characters",
            "any.required": "Part description is required",
          }),
        subSections: Joi.array()
          .items(
            Joi.object({
              subSectionTitle: Joi.string()
                .trim()
                .min(1)
                .max(150)
                .required()
                .messages({
                  "string.min": "Sub-section title is required",
                  "string.max":
                    "Sub-section title cannot exceed 150 characters",
                  "any.required": "Sub-section title is required",
                }),
              subSectionContent: Joi.string()
                .trim()
                .min(1)
                .max(2000)
                .required()
                .messages({
                  "string.min": "Sub-section content is required",
                  "string.max":
                    "Sub-section content cannot exceed 2000 characters",
                  "any.required": "Sub-section content is required",
                }),
              ...commensVal,
            })
          )
          .optional(),
        ...commensVal,
      })
    )
    .optional(),
  ...commensVal,
});
export const privacyPolicyUpdateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
  }),
  description: Joi.string().trim().min(1).max(2000).messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  parts: Joi.array()
    .items(
      Joi.object({
        partTitle: Joi.string().trim().min(1).max(150).messages({
          "string.min": "Part title is required",
          "string.max": "Part title cannot exceed 150 characters",
        }),
        partDescription: Joi.string().trim().min(1).max(2000).messages({
          "string.min": "Part description is required",
          "string.max": "Part description cannot exceed 2000 characters",
        }),
        subSections: Joi.array()
          .items(
            Joi.object({
              subSectionTitle: Joi.string().trim().min(1).max(150).messages({
                "string.min": "Sub-section title is required",
                "string.max": "Sub-section title cannot exceed 150 characters",
              }),
              subSectionContent: Joi.string().trim().min(1).max(2000).messages({
                "string.min": "Sub-section content is required",
                "string.max":
                  "Sub-section content cannot exceed 2000 characters",
              }),
              ...commensVal,
            })
          )
          .optional(),
      })
    )
    .optional(),
  ...commensVal,
});

// Validation for legal
export const legalCreateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).required().messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().min(1).max(2000).required().messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  contentBlocks: Joi.array()
    .items(
      Joi.object({
        header: Joi.string().trim().min(1).max(150).required().messages({
          "string.min": "Header is required",
          "string.max": "Header cannot exceed 150 characters",
          "any.required": "Header is required",
        }),
        body: Joi.string().trim().min(1).max(5000).required().messages({
          "string.min": "Body content is required",
          "string.max": "Body content cannot exceed 5000 characters",
          "any.required": "Body content is required",
        }),
        ...commensVal,
      })
    )
    .optional(),
  ...commensVal,
});
export const legalUpdateVal = Joi.object({
  title: Joi.string().trim().min(1).max(150).messages({
    "string.min": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
  }),
  description: Joi.string().trim().min(1).max(2000).messages({
    "string.min": "Description is required",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  contentBlocks: Joi.array()
    .items(
      Joi.object({
        header: Joi.string().trim().min(1).max(150).messages({
          "string.min": "Header is required",
          "string.max": "Header cannot exceed 150 characters",
        }),
        body: Joi.string().trim().min(1).max(5000).messages({
          "string.min": "Body content is required",
          "string.max": "Body content cannot exceed 5000 characters",
        }),
        ...commensVal,
      })
    )
    .optional(),
  ...commensVal,
});
