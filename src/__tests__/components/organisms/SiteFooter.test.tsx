import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/organisms/SiteFooter";

describe("SiteFooter", () => {
  it("renders a link for every category", () => {
    render(<SiteFooter />);

    for (const label of ["Women's Health", "Sleep", "Nutrition", "Wellness"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders About and Contact links, plus non-linking placeholders", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getAllByRole("link", { name: "Contact" })[0]).toHaveAttribute(
      "href",
      "/contact",
    );
    // Privacy Policy, Pinterest, and Instagram have no real destination yet
    // — rendered as plain text, not dead links.
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Privacy Policy" })).toBeNull();
    expect(screen.getByText("Pinterest")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Pinterest" })).toBeNull();
  });

  it("renders the current year in the copyright line", () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} WellWithHer. All rights reserved.`,
      ),
    ).toBeInTheDocument();
  });
});
