import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NextLink } from "@/components/atoms/NextLink";

describe("NextLink", () => {
  it("renders an anchor pointing at the given href", () => {
    render(<NextLink href="/contact">Contact</NextLink>);

    const link = screen.getByRole("link", { name: "Contact" });
    expect(link).toHaveAttribute("href", "/contact");
  });
});
