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

  it("renders Home and Contact links", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("renders the current year in the copyright line", () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(`© ${new Date().getFullYear()} WellWithHer`),
    ).toBeInTheDocument();
  });
});
