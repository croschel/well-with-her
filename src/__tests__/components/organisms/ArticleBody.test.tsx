import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleBody } from "@/components/organisms/ArticleBody";
import type { RichTextContent } from "@/models/interfaces";

const buildContent = (children: unknown[]): RichTextContent => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: null,
    children,
  },
});

describe("ArticleBody", () => {
  it("renders paragraph text from the serialized richtext content", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: [
              {
                type: "text",
                format: 0,
                detail: 0,
                mode: "normal",
                style: "",
                version: 1,
                text: "Body paragraph copy.",
              },
            ],
          },
        ])}
      />,
    );

    expect(screen.getByText("Body paragraph copy.")).toBeInTheDocument();
  });

  it("wraps a text node carrying a style field in a styled span", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: [
              {
                type: "text",
                format: 0,
                detail: 0,
                mode: "normal",
                style: "color:#8a9678",
                version: 1,
                text: "Sage colored copy.",
              },
            ],
          },
        ])}
      />,
    );

    const styledText = screen.getByText("Sage colored copy.");
    expect(styledText).toHaveStyle({ color: "#8a9678" });
  });

  it("renders a ctaBlock node via the CtaBlockRenderer", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "block",
            format: "",
            version: 2,
            fields: {
              id: "block-1",
              blockName: "",
              blockType: "ctaBlock",
              label: "Shop this pick →",
              url: "https://example.com/shop",
            },
          },
        ])}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Shop this pick →" }),
    ).toHaveAttribute("href", "https://example.com/shop");
  });

  it("renders an imageBlock node via the ImageBlockRenderer", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "block",
            format: "",
            version: 2,
            fields: {
              id: "block-2",
              blockName: "",
              blockType: "imageBlock",
              image: { id: 1, url: "https://example.com/photo.jpg", alt: "A photo" },
            },
          },
        ])}
      />,
    );

    expect(screen.getByRole("img", { name: "A photo" })).toBeInTheDocument();
  });

  it("renders a galleryBlock node via the GalleryBlockRenderer", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "block",
            format: "",
            version: 2,
            fields: {
              id: "block-3",
              blockName: "",
              blockType: "galleryBlock",
              images: [
                { id: 1, url: "https://example.com/a.jpg", alt: "A" },
                { id: 2, url: "https://example.com/b.jpg", alt: "B" },
              ],
            },
          },
        ])}
      />,
    );

    expect(screen.getByRole("img", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "B" })).toBeInTheDocument();
  });

  it("renders a videoEmbedBlock node via the VideoEmbedBlockRenderer", () => {
    render(
      <ArticleBody
        content={buildContent([
          {
            type: "block",
            format: "",
            version: 2,
            fields: {
              id: "block-4",
              blockName: "",
              blockType: "videoEmbedBlock",
              url: "https://www.youtube.com/watch?v=abc123",
              caption: "A caption",
            },
          },
        ])}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Play video" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A caption")).toBeInTheDocument();
  });
});
