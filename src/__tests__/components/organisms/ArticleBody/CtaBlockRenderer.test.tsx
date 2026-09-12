import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CtaBlockRenderer } from "@/components/organisms/ArticleBody/blocks/CtaBlockRenderer";

describe("CtaBlockRenderer", () => {
  it("renders a buy button with the block's label and URL", () => {
    render(<CtaBlockRenderer label="Shop this pick →" url="https://example.com/shop" />);

    expect(
      screen.getByRole("link", { name: "Shop this pick →" }),
    ).toHaveAttribute("href", "https://example.com/shop");
  });
});
