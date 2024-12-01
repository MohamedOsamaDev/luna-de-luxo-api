import { landingPageModel } from "../../database/models/pages/landing.model.js";
import { privacyPolicyPageModel } from "../../database/models/pages/privacyPolicy.model.js";
import {
  landingCreateVal,
  landingUpdateVal,
  faqCreateVal,
  faqUpdateVal,
  careServiceCreateVal,
  careServiceUpdateVal,
  aboutUsCreateVal,
  aboutUsUpdateVal,
  privacyPolicyCreateVal,
  privacyPolicyUpdateVal,
  legalCreateVal,
  legalUpdateVal,
} from "./page.validation.js";
import { aboutPageModel } from "../../database/models/pages/abouteUs.model.js";
import { faqPageModel } from "../../database/models/pages/faq.model.js";
import { legalPageModel } from "../../database/models/pages/legal.model.js";
import { CareServiceModel } from "../../database/models/pages/careservices.model.js";

export const allPagesConfig = {
  landing: {
    validation: {
      create: landingCreateVal,
      update: landingUpdateVal,
    },
    Model: landingPageModel,
  },
  "about-us": {
    validation: {
      create: aboutUsCreateVal,
      update: aboutUsUpdateVal,
    },
    Model: aboutPageModel,
  },
  faq: {
    validation: { create: faqCreateVal, update: faqUpdateVal },
    Model: faqPageModel,
  },

  "privacy-policy": {
    validation: {
      create: privacyPolicyCreateVal,
      update: privacyPolicyUpdateVal,
    },
    Model: privacyPolicyPageModel,
  },
  legal: {
    validation: { create: legalCreateVal, update: legalUpdateVal },
    Model: legalPageModel,
  },
  "care-service": {
    validation: { create: careServiceCreateVal, update: careServiceUpdateVal },
    Model: CareServiceModel,
  },
};
