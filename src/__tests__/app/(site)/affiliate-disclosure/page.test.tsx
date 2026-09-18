import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetSiteInfo } = vi.hoisted(() => ({
  mockGetSiteInfo: vi.fn(),
}));

vi.mock("@/services/siteInfo", () => ({
  get: mockGetSiteInfo,
}));

import AffiliateDisclosurePage, {
  metadata,
} from "@/app/(site)/affiliate-disclosure/page";
import type { SiteInfo } from "@/models/interfaces";

const buildSiteInfo = (): SiteInfo => ({
  asideContent: { root: {} },
  disclosure: "Some links may be affiliate links.",
  privacyPolicyContent: { root: {} },
  affiliateDisclosureContent: {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: null,
          children: [
            {
              type: "text",
              format: 0,
              detail: 0,
              mode: "normal",
              style: "",
              version: 1,
              text: "We may earn a commission from products we recommend.",
            },
          ],
        },
      ],
    },
  },
});

beforeEach(() => {
  mockGetSiteInfo.mockReset();
  mockGetSiteInfo.mockResolvedValue(buildSiteInfo());
});

describe("metadata", () => {
  it("sets a title, description, and canonical URL", () => {
    expect(metadata.title).toBe("Affiliate Disclosure — WellWithHer");
    expect(metadata.description).toBe(
      "How WellWithHer earns commissions from the products it recommends.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/affiliate-disclosure" });
  });
});

describe("AffiliateDisclosurePage", () => {
  it("renders the heading and the CMS-editable affiliate disclosure content", async () => {
    render(await AffiliateDisclosurePage());

    expect(
      screen.getByRole("heading", { name: "Affiliate Disclosure" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We may earn a commission from products we recommend.",
      ),
    ).toBeInTheDocument();
  });
});
