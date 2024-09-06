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

export const allPagesModel = {
  "about-us": aboutPageModel,
  faq: faqPageModel,
  landing: landingPageModel,
  privacy_policy: privacyPolicyPageModel,
  legal: legalPageModel,
  care_service: CareServiceModel,
};

export const allPagesValidation = {
  landing: {
    create: landingCreateVal,
    update: landingUpdateVal,
  },
  'about-us': {
    create: aboutUsCreateVal,
    update: aboutUsUpdateVal,
  },
  faq: {
    create: faqCreateVal,
    update: faqUpdateVal,
  },

  privacy_policy: {
    create: privacyPolicyCreateVal,
    update: privacyPolicyUpdateVal,
  },
  legal: {
    create: legalCreateVal,
    update: legalUpdateVal,
  },
  care_service: {
    create: careServiceCreateVal,
    update: careServiceUpdateVal,
  },
};
