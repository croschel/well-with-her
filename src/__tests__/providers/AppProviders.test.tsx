import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppProviders } from "@/providers/AppProviders";

describe("AppProviders", () => {
  it("renders its children", () => {
    render(
      <AppProviders>
        <p>child content</p>
      </AppProviders>,
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("mounts the cookie consent banner alongside the children", async () => {
    localStorage.clear();
    render(
      <AppProviders>
        <p>child content</p>
      </AppProviders>,
    );

    expect(
      await screen.findByRole("region", { name: "Cookie consent" }),
    ).toBeInTheDocument();
  });
});
