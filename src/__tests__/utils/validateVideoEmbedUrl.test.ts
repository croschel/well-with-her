import { describe, expect, it } from "vitest";

import { validateVideoEmbedUrl } from "@/utils/validateVideoEmbedUrl";

describe("validateVideoEmbedUrl", () => {
  it("accepts an empty value", () => {
    expect(validateVideoEmbedUrl(undefined)).toBe(true);
    expect(validateVideoEmbedUrl(null)).toBe(true);
    expect(validateVideoEmbedUrl("")).toBe(true);
  });

  it.each([
    "https://www.youtube.com/watch?v=abc123",
    "https://youtu.be/abc123",
    "https://vimeo.com/123456",
  ])("accepts %s", (url) => {
    expect(validateVideoEmbedUrl(url)).toBe(true);
  });

  it.each([
    "https://example.com/video",
    "http://youtube.com/watch?v=abc123",
    "not a url",
  ])("rejects %s", (url) => {
    expect(validateVideoEmbedUrl(url)).toBe("Enter a YouTube or Vimeo URL.");
  });
});
