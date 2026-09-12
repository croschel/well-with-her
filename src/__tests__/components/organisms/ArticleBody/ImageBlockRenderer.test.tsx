import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageBlockRenderer } from "@/components/organisms/ArticleBody/blocks/ImageBlockRenderer";

import type { Media } from "../../../../../payload-types";

const buildImage = (overrides: Partial<Media> = {}): Media =>
  ({
    id: 1,
    url: "https://example.com/photo.jpg",
    alt: "A photo",
    ...overrides,
  }) as Media;

describe("ImageBlockRenderer", () => {
  it("renders the image with its alt text", () => {
    render(<ImageBlockRenderer image={buildImage()} />);

    expect(screen.getByRole("img", { name: "A photo" })).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg",
    );
  });

  it("renders a caption when provided", () => {
    render(<ImageBlockRenderer image={buildImage()} caption="A caption" />);

    expect(screen.getByText("A caption")).toBeInTheDocument();
  });

  it("throws when the image relation is unpopulated", () => {
    expect(() => render(<ImageBlockRenderer image={1} />)).toThrow();
  });
});
