import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { NavSearch } from "@/components/organisms/NavSearch";

describe("NavSearch", () => {
  it("shows a search toggle button by default", () => {
    render(<NavSearch />);

    expect(
      screen.getByRole("button", { name: "Search articles" }),
    ).toBeInTheDocument();
  });

  it("reveals a text input when the toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<NavSearch />);

    await user.click(screen.getByRole("button", { name: "Search articles" }));

    expect(
      screen.getByRole("textbox", { name: "Search articles" }),
    ).toBeInTheDocument();
  });

  it("collapses back to the toggle button on blur", async () => {
    const user = userEvent.setup();
    render(<NavSearch />);

    await user.click(screen.getByRole("button", { name: "Search articles" }));
    await user.tab();

    expect(
      screen.getByRole("button", { name: "Search articles" }),
    ).toBeInTheDocument();
  });
});
