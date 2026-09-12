import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

import { SiteHeader } from "@/components/organisms/SiteHeader";

describe("SiteHeader", () => {
  it("renders the site name linking home", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "WellWithHer home" }),
    ).toHaveAttribute("href", "/");
  });

  it("hides the category nav on the home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(screen.queryByLabelText("Category navigation")).toBeNull();
    expect(screen.queryByText("Sleep")).toBeNull();
  });

  it("renders a link for every category on non-home pages", () => {
    mockUsePathname.mockReturnValue("/sleep");
    render(<SiteHeader />);

    for (const label of ["Women's Health", "Sleep", "Nutrition", "Wellness"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("marks the current category link as active via aria-current", () => {
    mockUsePathname.mockReturnValue("/sleep");
    render(<SiteHeader />);

    const sleepLink = screen.getByText("Sleep").closest("a");
    const nutritionLink = screen.getByText("Nutrition").closest("a");

    expect(sleepLink).toHaveAttribute("aria-current", "page");
    expect(nutritionLink).not.toHaveAttribute("aria-current");
  });
});
