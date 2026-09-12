import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleHero } from "@/components/organisms/ArticleHero";
import { Category } from "@/models/enums";
import type { Article } from "@/models/interfaces";

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: "1",
  category: Category.Sleep,
  pinId: "pin002",
  slug: "wind-down-routine",
  title: "A Wind-Down Routine",
  mainArticleContent: { root: {} },
  buyButtonUrl: "https://example.com/shop",
  heroImage: { url: "https://example.com/hero.jpg", alt: "A calm bedroom" },
  galleryImages: [],
  publishedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("ArticleHero", () => {
  it("renders the title, category label, byline, and hero image", () => {
    render(<ArticleHero article={buildArticle()} />);

    expect(
      screen.getByRole("heading", { name: "A Wind-Down Routine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sleep")).toBeInTheDocument();
    expect(
      screen.getByText("By the WellWithHer Editors · 6 min read"),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A calm bedroom" })).toHaveAttribute(
      "src",
      "https://example.com/hero.jpg",
    );
  });

  it("prefers the hero-sized image variant when available", () => {
    render(
      <ArticleHero
        article={buildArticle({
          heroImage: {
            url: "https://example.com/hero.jpg",
            alt: "A calm bedroom",
            sizes: {
              hero: { url: "https://example.com/hero-lg.jpg", width: 1200, height: 600 },
            },
          },
        })}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/hero-lg.jpg",
    );
  });
});
