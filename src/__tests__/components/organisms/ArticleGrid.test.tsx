import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleGrid } from "@/components/organisms/ArticleGrid";
import { Category } from "@/models/enums";
import type { Article } from "@/models/interfaces";

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: "1",
  category: Category.Sleep,
  pinId: "pin002",
  slug: "wind-down-routine",
  title: "A Wind-Down Routine",
  mainArticleContent: { root: {} },
  buyButtonLabel: "Shop this pick →",
  buyButtonUrl: "https://example.com/shop",
  heroImage: { url: "https://example.com/hero.jpg", alt: "A calm bedroom" },
  galleryImages: [],
  publishedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("ArticleGrid", () => {
  it("renders a card per article", () => {
    render(
      <ArticleGrid
        articles={[
          buildArticle({ id: "1", title: "First" }),
          buildArticle({ id: "2", title: "Second" }),
        ]}
      />,
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("shows an empty-state message when there are no articles", () => {
    render(<ArticleGrid articles={[]} />);

    expect(screen.getByText(/No articles yet/)).toBeInTheDocument();
  });
});
