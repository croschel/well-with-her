import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleCard } from "@/components/molecules/ArticleCard";
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

describe("ArticleCard", () => {
  it("links to the article's route", () => {
    render(<ArticleCard article={buildArticle()} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/sleep/pin002/wind-down-routine",
    );
  });

  it("renders the title, category label, and hero image", () => {
    render(<ArticleCard article={buildArticle()} />);

    expect(
      screen.getByRole("heading", { name: "A Wind-Down Routine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sleep")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A calm bedroom" })).toHaveAttribute(
      "src",
      "https://example.com/hero.jpg",
    );
  });

  it("prefers the card-sized image variant when available", () => {
    render(
      <ArticleCard
        article={buildArticle({
          heroImage: {
            url: "https://example.com/hero.jpg",
            alt: "A calm bedroom",
            sizes: {
              card: { url: "https://example.com/hero-card.jpg", width: 600, height: 400 },
            },
          },
        })}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/hero-card.jpg",
    );
  });

  it("renders the description only when ogDescription is present", () => {
    const { rerender } = render(<ArticleCard article={buildArticle()} />);
    expect(screen.queryByText("A short blurb.")).not.toBeInTheDocument();

    rerender(
      <ArticleCard article={buildArticle({ ogDescription: "A short blurb." })} />,
    );
    expect(screen.getByText("A short blurb.")).toBeInTheDocument();
  });
});
