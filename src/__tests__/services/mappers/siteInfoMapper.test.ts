import { describe, expect, it } from "vitest";

import { mapSiteInfo } from "@/services/mappers/siteInfoMapper";

import type { SiteInfo } from "../../../../payload-types";

describe("mapSiteInfo", () => {
  it("maps asideContent, disclosure, privacyPolicyContent, and affiliateDisclosureContent", () => {
    const doc: SiteInfo = {
      id: 1,
      asideContent: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: null,
          children: [],
        },
      },
      disclosure: "Some links are affiliate links.",
      privacyPolicyContent: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: null,
          children: [],
        },
      },
      affiliateDisclosureContent: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: null,
          children: [],
        },
      },
    };

    const siteInfo = mapSiteInfo(doc);

    expect(siteInfo.asideContent).toEqual(doc.asideContent);
    expect(siteInfo.disclosure).toBe("Some links are affiliate links.");
    expect(siteInfo.privacyPolicyContent).toEqual(doc.privacyPolicyContent);
    expect(siteInfo.affiliateDisclosureContent).toEqual(
      doc.affiliateDisclosureContent,
    );
  });
});
