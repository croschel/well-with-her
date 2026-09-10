import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the site name", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "WellWithHer", level: 1 }),
    ).toBeInTheDocument();
  });
});
