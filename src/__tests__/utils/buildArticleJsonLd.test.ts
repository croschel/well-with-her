import { describe, expect, it } from "vitest";

import { Category } from "@/models/enums";
import type { Article } from "@/models/interfaces";
import { buildArticleJsonLd } from "@/utils/buildArticleJsonLd";

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: "1",
  category: Category.Wellness,
  pinId: "pin001",
  slug: "five-minute-morning-reset",
  title: "The Five-Minute Morning Reset",
  mainArticleContent: { root: {} },
  buyButtonLabel: "Shop this pick →",
  buyButtonUrl: "https://example.com/shop",
  heroImage: { url: "/api/media/file/hero.png", alt: "A calm morning" },
  galleryImages: [],
  ogDescription: "A short blurb.",
  publishedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("buildArticleJsonLd", () => {
  it("builds Article structured data with an absolute canonical URL", () => {
    const jsonLd = buildArticleJsonLd(buildArticle(), "https://wellwithher.com");

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Five-Minute Morning Reset",
      description: "A short blurb.",
      articleSection: "Wellness",
      author: { "@type": "Organization", name: "WellWithHer Editors" },
      publisher: { "@type": "Organization", name: "WellWithHer" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://wellwithher.com/wellness/pin001/five-minute-morning-reset",
      },
    });
  });

  it("resolves a relative hero image URL against the site URL", () => {
    const jsonLd = buildArticleJsonLd(buildArticle(), "https://wellwithher.com");

    expect(jsonLd.image).toEqual(["https://wellwithher.com/api/media/file/hero.png"]);
  });

  it("leaves an already-absolute image URL untouched", () => {
    const jsonLd = buildArticleJsonLd(
      buildArticle({
        ogImage: { url: "https://cdn.example.com/og.png", alt: "OG image" },
      }),
      "https://wellwithher.com",
    );

    expect(jsonLd.image).toEqual(["https://cdn.example.com/og.png"]);
  });

  it("prefers ogImage over heroImage when both are present", () => {
    const jsonLd = buildArticleJsonLd(
      buildArticle({
        ogImage: { url: "/api/media/file/og.png", alt: "OG image" },
      }),
      "https://wellwithher.com",
    );

    expect(jsonLd.image).toEqual(["https://wellwithher.com/api/media/file/og.png"]);
  });
});
