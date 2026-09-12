import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/(site)/not-found";

describe("NotFound (site)", () => {
  it("renders the heading and a link home", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("offers a link to every category", () => {
    render(<NotFound />);

    for (const label of ["Women's Health", "Sleep", "Nutrition", "Wellness"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
