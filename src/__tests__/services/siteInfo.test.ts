import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/payloadClient", () => ({
  getPayloadClient: vi.fn(),
}));

import { getPayloadClient } from "@/services/payloadClient";
import * as siteInfoService from "@/services/siteInfo";

import type { SiteInfo } from "../../../payload-types";

const mockFindGlobal = vi.fn();

beforeEach(() => {
  mockFindGlobal.mockReset();
  vi.mocked(getPayloadClient).mockResolvedValue({
    findGlobal: mockFindGlobal,
  } as unknown as Awaited<ReturnType<typeof getPayloadClient>>);
});

describe("siteInfo.get", () => {
  it("fetches the site-info global and maps it", async () => {
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
    mockFindGlobal.mockResolvedValue(doc);

    const result = await siteInfoService.get();

    expect(mockFindGlobal).toHaveBeenCalledWith({ slug: "site-info" });
    expect(result.disclosure).toBe("Some links are affiliate links.");
  });
});
