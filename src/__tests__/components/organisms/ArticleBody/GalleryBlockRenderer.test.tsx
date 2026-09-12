import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GalleryBlockRenderer } from "@/components/organisms/ArticleBody/blocks/GalleryBlockRenderer";

import type { Media } from "../../../../../payload-types";

const buildImage = (overrides: Partial<Media> = {}): Media =>
  ({
    id: 1,
    url: "https://example.com/photo.jpg",
    alt: "A photo",
    ...overrides,
  }) as Media;

describe("GalleryBlockRenderer", () => {
  it("renders an image per gallery item", () => {
    render(
      <GalleryBlockRenderer
        images={[buildImage({ id: 1, alt: "First" }), buildImage({ id: 2, alt: "Second" })]}
      />,
    );

    expect(screen.getByRole("img", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Second" })).toBeInTheDocument();
  });

  it("throws when an image relation is unpopulated", () => {
    expect(() => render(<GalleryBlockRenderer images={[1]} />)).toThrow();
  });
});
