import { describe, expect, it } from "vitest";

import { Category } from "@/models/enums";
import { mapArticle, mapArticleRouteRef } from "@/services/mappers/articleMapper";

import type { Article, Media } from "../../../../payload-types";

const media: Media = {
  id: 1,
  alt: "Hero",
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  url: "https://example.com/hero.jpg",
  width: 1600,
  height: 900,
};

const richText = {
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: null,
    children: [],
  },
};

const buildArticleDoc = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  category: "sleep",
  pinId: "pin002",
  slug: "wind-down-routine",
  title: "A Wind-Down Routine",
  mainArticleContent: richText,
  buyButtonLabel: "Shop this pick →",
  buyButtonUrl: "https://example.com/shop",
  heroImage: media,
  galleryImages: null,
  videoEmbedUrl: null,
  ogImage: null,
  ogDescription: null,
  publishedAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("mapArticle", () => {
  it("maps required fields, coercing category to the domain enum", () => {
    const article = mapArticle(buildArticleDoc());

    expect(article.id).toBe("1");
    expect(article.category).toBe(Category.Sleep);
    expect(article.pinId).toBe("pin002");
    expect(article.slug).toBe("wind-down-routine");
    expect(article.title).toBe("A Wind-Down Routine");
    expect(article.buyButtonLabel).toBe("Shop this pick →");
    expect(article.buyButtonUrl).toBe("https://example.com/shop");
    expect(article.heroImage.url).toBe("https://example.com/hero.jpg");
    expect(article.publishedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("defaults galleryImages to an empty array and optional fields to undefined", () => {
    const article = mapArticle(buildArticleDoc());

    expect(article.galleryImages).toEqual([]);
    expect(article.videoEmbedUrl).toBeUndefined();
    expect(article.ogImage).toBeUndefined();
    expect(article.ogDescription).toBeUndefined();
  });

  it("maps optional fields when present", () => {
    const article = mapArticle(
      buildArticleDoc({
        videoEmbedUrl: "https://youtu.be/abc123",
        ogImage: media,
        ogDescription: "A calming wind-down routine.",
        galleryImages: [media],
      }),
    );

    expect(article.videoEmbedUrl).toBe("https://youtu.be/abc123");
    expect(article.ogImage?.url).toBe("https://example.com/hero.jpg");
    expect(article.ogDescription).toBe("A calming wind-down routine.");
    expect(article.galleryImages).toHaveLength(1);
  });

  it("throws when heroImage is an unpopulated relation", () => {
    expect(() => mapArticle(buildArticleDoc({ heroImage: 1 }))).toThrow(
      /populated media relation/,
    );
  });
});

describe("mapArticleRouteRef", () => {
  it("maps the route fields plus publishedAt", () => {
    const ref = mapArticleRouteRef({
      category: "nutrition",
      pinId: "pin003",
      slug: "breakfast",
      publishedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(ref).toEqual({
      category: Category.Nutrition,
      pinId: "pin003",
      slug: "breakfast",
      publishedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
