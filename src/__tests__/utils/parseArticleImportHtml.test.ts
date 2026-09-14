import { describe, expect, it } from "vitest";

import { parseArticleImportHtml } from "@/utils/parseArticleImportHtml";

describe("parseArticleImportHtml", () => {
  it("returns a single content segment when there are no images", () => {
    const segments = parseArticleImportHtml("<h2>Title</h2><p>Body</p>");

    expect(segments).toEqual([
      { type: "content", html: "<h2>Title</h2><p>Body</p>" },
    ]);
  });

  it("splits content around a top-level image", () => {
    const segments = parseArticleImportHtml(
      '<p>Before</p><img src="https://example.com/a.png" alt="A photo"><p>After</p>',
    );

    expect(segments).toEqual([
      { type: "content", html: "<p>Before</p>" },
      { type: "image", src: "https://example.com/a.png", alt: "A photo" },
      { type: "content", html: "<p>After</p>" },
    ]);
  });

  it("handles an image with no surrounding content", () => {
    const segments = parseArticleImportHtml(
      '<img src="https://example.com/a.png" alt="A photo">',
    );

    expect(segments).toEqual([
      { type: "image", src: "https://example.com/a.png", alt: "A photo" },
    ]);
  });

  it("handles consecutive images with no content between them", () => {
    const segments = parseArticleImportHtml(
      '<img src="https://example.com/a.png" alt="A"><img src="https://example.com/b.png" alt="B">',
    );

    expect(segments).toEqual([
      { type: "image", src: "https://example.com/a.png", alt: "A" },
      { type: "image", src: "https://example.com/b.png", alt: "B" },
    ]);
  });

  it("defaults src/alt to empty strings when missing", () => {
    const segments = parseArticleImportHtml("<img>");

    expect(segments).toEqual([{ type: "image", src: "", alt: "" }]);
  });

  it("ignores whitespace-only content between elements", () => {
    const segments = parseArticleImportHtml(
      '<p>Before</p>\n  \n<img src="https://example.com/a.png" alt="A">\n  \n<p>After</p>',
    );

    expect(segments).toEqual([
      { type: "content", html: "<p>Before</p>" },
      { type: "image", src: "https://example.com/a.png", alt: "A" },
      { type: "content", html: "<p>After</p>" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseArticleImportHtml("")).toEqual([]);
  });
});
