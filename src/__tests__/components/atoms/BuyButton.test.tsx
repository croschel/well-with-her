import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BuyButton } from "@/components/atoms/BuyButton";

describe("BuyButton", () => {
  it("renders an outbound link with sponsored/noopener attributes", () => {
    render(<BuyButton label="Shop this pick →" href="https://example.com/shop" />);

    const link = screen.getByRole("link", { name: "Shop this pick →" });
    expect(link).toHaveAttribute("href", "https://example.com/shop");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener sponsored");
  });
});
