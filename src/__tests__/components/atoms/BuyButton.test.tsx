import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BuyButton } from "@/components/atoms/BuyButton";

afterEach(() => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  );
});

describe("BuyButton", () => {
  it("renders an outbound link with sponsored/noopener attributes", () => {
    render(<BuyButton label="Shop this pick →" href="https://example.com/shop" />);

    const link = screen.getByRole("link", { name: "Shop this pick →" });
    expect(link).toHaveAttribute("href", "https://example.com/shop");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener sponsored");
  });

  it("leaves the href unchanged when there are no UTM params", () => {
    render(<BuyButton label="Shop this pick →" href="https://example.com/shop" />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/shop",
    );
  });

  it("appends UTM params from the current URL onto the outbound href", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "utm_source=pinterest&utm_medium=pin",
      ) as ReturnType<typeof useSearchParams>,
    );

    render(<BuyButton label="Shop this pick →" href="https://example.com/shop" />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/shop?utm_source=pinterest&utm_medium=pin",
    );
  });
});
