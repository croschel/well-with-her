import { describe, expect, it } from "vitest";

import { parseVideoEmbedUrl } from "@/utils/parseVideoEmbedUrl";

describe("parseVideoEmbedUrl", () => {
  it("parses a youtube.com/watch URL", () => {
    expect(
      parseVideoEmbedUrl("https://www.youtube.com/watch?v=abc123"),
    ).toEqual({
      provider: "youtube",
      embedUrl: "https://www.youtube.com/embed/abc123",
      thumbnailUrl: "https://img.youtube.com/vi/abc123/hqdefault.jpg",
    });
  });

  it("parses a youtu.be short URL", () => {
    expect(parseVideoEmbedUrl("https://youtu.be/abc123")).toEqual({
      provider: "youtube",
      embedUrl: "https://www.youtube.com/embed/abc123",
      thumbnailUrl: "https://img.youtube.com/vi/abc123/hqdefault.jpg",
    });
  });

  it("parses a vimeo.com URL", () => {
    expect(parseVideoEmbedUrl("https://vimeo.com/123456")).toEqual({
      provider: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456",
    });
  });

  it("returns null for an unrecognized URL", () => {
    expect(parseVideoEmbedUrl("https://example.com/video")).toBeNull();
  });
});
