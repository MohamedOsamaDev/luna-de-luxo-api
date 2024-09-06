import { landingPageModel } from "../../database/models/pages/landing.model.js";
import { privacyPolicyPageModel } from "../../database/models/pages/privacyPolicy.model.js";
import { landingCreateVal, landingUpdateVal } from "./page.validation.js";
import { aboutPageModel } from "../../database/models/pages/abouteUs.model.js";
import { faqPageModel } from "../../database/models/pages/faq.model.js";
import { legalPageModel } from "../../database/models/pages/legal.model.js";

export const allPagesModel = {
  "about-us": aboutPageModel,
  faq: faqPageModel,
  landing: landingPageModel,
  "privacy-policy": privacyPolicyPageModel,
  legal: legalPageModel,
};

export const allPagesValidation = {
  landing: {
    create: landingCreateVal,
    update: landingUpdateVal,
  },
  about_us: {
    create: {},
    update: {},
  },
  faq: {
    create: {},
    update: {},
  },

  privacy_policy: {
    create: {},
    update: {},
  },
  legal: {
    create: {},
    update: {},
  },
};
