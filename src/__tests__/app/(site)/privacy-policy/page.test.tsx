import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetSiteInfo } = vi.hoisted(() => ({
  mockGetSiteInfo: vi.fn(),
}));

vi.mock("@/services/siteInfo", () => ({
  get: mockGetSiteInfo,
}));

import PrivacyPolicyPage, {
  metadata,
} from "@/app/(site)/privacy-policy/page";
import type { SiteInfo } from "@/models/interfaces";

const buildSiteInfo = (): SiteInfo => ({
  asideContent: { root: {} },
  disclosure: "Some links may be affiliate links.",
  privacyPolicyContent: {
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
              text: "We use Google Analytics and Pinterest Tag for analytics.",
            },
          ],
        },
      ],
    },
  },
  affiliateDisclosureContent: { root: {} },
});

beforeEach(() => {
  mockGetSiteInfo.mockReset();
  mockGetSiteInfo.mockResolvedValue(buildSiteInfo());
});

describe("metadata", () => {
  it("sets a title, description, and canonical URL", () => {
    expect(metadata.title).toBe("Privacy Policy — WellWithHer");
    expect(metadata.description).toBe(
      "WellWithHer's privacy policy: what data we collect, why, and how it's used.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/privacy-policy" });
  });
});

describe("PrivacyPolicyPage", () => {
  it("renders the heading and the CMS-editable privacy policy content", async () => {
    render(await PrivacyPolicyPage());

    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We use Google Analytics and Pinterest Tag for analytics.",
      ),
    ).toBeInTheDocument();
  });
});
