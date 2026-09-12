import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockListRecent } = vi.hoisted(() => ({
  mockListRecent: vi.fn(),
}));

vi.mock("@/services/articles", () => ({
  listRecent: mockListRecent,
}));

import HomePage from "@/app/(site)/page";
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

describe("HomePage", () => {
  it("renders the hero copy and a link for every category", async () => {
    mockListRecent.mockResolvedValue([]);

    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        name: "Gentle wellness, one small step at a time",
      }),
    ).toBeInTheDocument();
    for (const label of ["Women's Health", "Sleep", "Nutrition", "Wellness"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders the latest articles returned by the service", async () => {
    mockListRecent.mockResolvedValue([
      buildArticle({ id: "1", title: "First article" }),
      buildArticle({ id: "2", title: "Second article" }),
    ]);

    render(await HomePage());

    expect(mockListRecent).toHaveBeenCalledWith(6);
    expect(screen.getByText("First article")).toBeInTheDocument();
    expect(screen.getByText("Second article")).toBeInTheDocument();
  });

  it("shows the empty state when there are no articles yet", async () => {
    mockListRecent.mockResolvedValue([]);

    render(await HomePage());

    expect(screen.getByText(/No articles yet/)).toBeInTheDocument();
  });
});
