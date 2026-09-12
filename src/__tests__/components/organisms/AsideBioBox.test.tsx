import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AsideBioBox } from "@/components/organisms/AsideBioBox";
import type { SiteInfo } from "@/models/interfaces";

const buildSiteInfo = (overrides: Partial<SiteInfo> = {}): SiteInfo => ({
  asideContent: {
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
              text: "We're a small team of writers and researchers.",
            },
          ],
        },
      ],
    },
  },
  disclosure: "Some links may be affiliate links.",
  ...overrides,
});

describe("AsideBioBox", () => {
  it("renders the heading, aside richtext content, and contact link", () => {
    render(<AsideBioBox siteInfo={buildSiteInfo()} />);

    expect(screen.getByText("About WellWithHer")).toBeInTheDocument();
    expect(
      screen.getByText("We're a small team of writers and researchers."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get in touch →" }),
    ).toHaveAttribute("href", "/contact");
  });
});
