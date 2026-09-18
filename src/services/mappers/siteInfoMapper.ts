import type { SiteInfo } from "@/models/interfaces";

import type { SiteInfo as PayloadSiteInfo } from "../../../payload-types";
import { resolveOptionalMediaAsset } from "./mediaMapper";

export const mapSiteInfo = (doc: PayloadSiteInfo): SiteInfo => ({
  homeHeroImage: resolveOptionalMediaAsset(doc.homeHeroImage),
  asideContent: doc.asideContent,
  disclosure: doc.disclosure,
  privacyPolicyContent: doc.privacyPolicyContent,
  affiliateDisclosureContent: doc.affiliateDisclosureContent,
});
