import { landingPageModel } from "../../database/models/pages/landing.model.js";
import { privacyPolicyPageModel } from "../../database/models/pages/privacyPolicy.model.js";
import { landingCreateVal, landingUpdateVal } from "./page.validation.js";
import { aboutPageModel } from "../../database/models/pages/abouteUs.model.js";
import { faqPageModel } from "../../database/models/pages/faq.model.js";
import { legalPageModel } from "../../database/models/pages/legal.model.js";

export const allPagesModel = {
  about_us: aboutPageModel,
  faq: faqPageModel,
  landing: landingPageModel,
  "privacy-policy": privacyPolicyPageModel,
  legal: legalPageModel,

};

export const allPagesValidation = {
  landing: {
    POST: landingCreateVal,
    PUT: landingUpdateVal,
  },
  about_us: {
    POST: {},
    PUT: {},
  },
  faq: {
    POST: {},
    PUT: {},
  },

  privacy_policy: {
    POST: {},
    PUT: {},
  },
  legal: {
    POST: {},
    PUT: {},
  },
  
};
