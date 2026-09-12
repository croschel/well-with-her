import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageGallery } from "@/components/molecules/ImageGallery";

describe("ImageGallery", () => {
  it("renders an image per gallery item", () => {
    render(
      <ImageGallery
        images={[
          { url: "https://example.com/a.jpg", alt: "A" },
          { url: "https://example.com/b.jpg", alt: "B" },
        ]}
      />,
    );

    expect(screen.getByRole("img", { name: "A" })).toHaveAttribute(
      "src",
      "https://example.com/a.jpg",
    );
    expect(screen.getByRole("img", { name: "B" })).toHaveAttribute(
      "src",
      "https://example.com/b.jpg",
    );
  });

  it("prefers the gallery-sized image variant when available", () => {
    render(
      <ImageGallery
        images={[
          {
            url: "https://example.com/a.jpg",
            alt: "A",
            sizes: {
              gallery: {
                url: "https://example.com/a-gallery.jpg",
                width: 400,
                height: 400,
              },
            },
          },
        ]}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/a-gallery.jpg",
    );
  });
});
