import type { SiteInfo } from "@/models/interfaces";

import { mapSiteInfo } from "./mappers/siteInfoMapper";
import { getPayloadClient } from "./payloadClient";

export const get = async (): Promise<SiteInfo> => {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-info" });
  return mapSiteInfo(doc);
};
