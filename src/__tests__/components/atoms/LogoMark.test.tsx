import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LogoMark } from "@/components/atoms/LogoMark";

describe("LogoMark", () => {
  it("renders the WH monogram", () => {
    render(<LogoMark />);
    expect(screen.getByText("WH")).toBeInTheDocument();
  });

  it("omits the decorative accent by default", () => {
    const { container } = render(<LogoMark />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders the decorative accent when requested", () => {
    const { container } = render(<LogoMark showAccent />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
