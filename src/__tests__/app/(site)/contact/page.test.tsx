import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContactPage, { metadata } from "@/app/(site)/contact/page";

describe("metadata", () => {
  it("sets a title, description, and canonical URL", () => {
    expect(metadata.title).toBe("Contact — WellWithHer");
    expect(metadata.description).toBe("Get in touch with the WellWithHer team.");
    expect(metadata.alternates).toEqual({ canonical: "/contact" });
  });
});

describe("ContactPage", () => {
  it("renders the heading, contact form, and sidebar info", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: "Get in Touch" }),
    ).toBeInTheDocument();
    expect(screen.getByText("We'd love to hear from you.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument();
    expect(screen.getByText("hello@wellwithher.com")).toBeInTheDocument();
    expect(screen.getByText("Pinterest")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
  });
});
