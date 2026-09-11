import { describe, expect, it } from "vitest";

import { mapSiteInfo } from "@/services/mappers/siteInfoMapper";

import type { SiteInfo } from "../../../../payload-types";

describe("mapSiteInfo", () => {
  it("maps asideContent and disclosure", () => {
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
    };

    const siteInfo = mapSiteInfo(doc);

    expect(siteInfo.asideContent).toEqual(doc.asideContent);
    expect(siteInfo.disclosure).toBe("Some links are affiliate links.");
  });
});
