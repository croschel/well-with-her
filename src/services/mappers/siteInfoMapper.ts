import type { SiteInfo } from "@/models/interfaces";

import type { SiteInfo as PayloadSiteInfo } from "../../../payload-types";

export const mapSiteInfo = (doc: PayloadSiteInfo): SiteInfo => ({
  asideContent: doc.asideContent,
  disclosure: doc.disclosure,
});
