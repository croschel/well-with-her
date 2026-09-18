import type { RichTextContent } from "./article";
import type { MediaAsset } from "./media";

export interface SiteInfo {
  homeHeroImage?: MediaAsset;
  asideContent: RichTextContent;
  disclosure: string;
  privacyPolicyContent: RichTextContent;
  affiliateDisclosureContent: RichTextContent;
}
