import { describe, expect, it } from "vitest";

import { sanitizeArticleHtml } from "@/utils/sanitizeArticleHtml";

describe("sanitizeArticleHtml", () => {
  it("keeps the allowed structural tags", () => {
    const html =
      "<h2>Heading</h2><p>Body <strong>bold</strong> <em>italic</em></p>" +
      "<ul><li>one</li></ul><blockquote>quote</blockquote>";
    const result = sanitizeArticleHtml(html);

    expect(result).toContain("<h2>Heading</h2>");
    expect(result).toContain("<strong>bold</strong>");
    expect(result).toContain("<em>italic</em>");
    expect(result).toContain("<li>one</li>");
    expect(result).toContain("<blockquote>quote</blockquote>");
  });

  it("strips script tags entirely, including their content", () => {
    const result = sanitizeArticleHtml(
      "<p>safe</p><script>alert('xss')</script>",
    );

    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>safe</p>");
  });

  it("strips event handler attributes", () => {
    const result = sanitizeArticleHtml(
      '<p onclick="alert(1)">click me</p>',
    );

    expect(result).not.toContain("onclick");
    expect(result).toContain("click me");
  });

  it("strips javascript: hrefs", () => {
    const result = sanitizeArticleHtml(
      '<a href="javascript:alert(1)">link</a>',
    );

    expect(result).not.toContain("javascript:");
  });

  it("keeps http(s) hrefs and image src", () => {
    const result = sanitizeArticleHtml(
      '<a href="https://example.com">link</a><img src="https://example.com/a.png" alt="a" />',
    );

    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('src="https://example.com/a.png"');
  });

  it("keeps a color style declaration", () => {
    const result = sanitizeArticleHtml(
      '<span style="color: #8a9678;">sage text</span>',
    );

    expect(result).toContain('style="color:#8a9678"');
  });

  it("strips layout-affecting style properties (the overlay-hijack vector)", () => {
    const result = sanitizeArticleHtml(
      '<span style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; color: red;">x</span>',
    );

    expect(result).not.toContain("position");
    expect(result).not.toContain("z-index");
    expect(result).toContain("color:red");
  });

  it("strips a url()-based style value even on an allowed property", () => {
    const result = sanitizeArticleHtml(
      "<span style=\"background-color: url(javascript:alert(1));\">x</span>",
    );

    expect(result).not.toContain("url(");
  });

  it("drops the style attribute entirely when nothing in it is safe", () => {
    const result = sanitizeArticleHtml(
      '<p style="position: fixed;">x</p>',
    );

    expect(result).not.toContain("style=");
  });

  it("strips disallowed tags like div and iframe while keeping their text", () => {
    const result = sanitizeArticleHtml(
      '<div><iframe src="https://evil.example"></iframe><p>kept</p></div>',
    );

    expect(result).not.toContain("<div");
    expect(result).not.toContain("<iframe");
    expect(result).toContain("<p>kept</p>");
  });
});
