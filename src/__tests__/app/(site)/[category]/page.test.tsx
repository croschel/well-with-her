import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockListByCategory, mockNotFound } = vi.hoisted(() => ({
  mockListByCategory: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/services/articles", () => ({
  listByCategory: mockListByCategory,
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

import CategoryPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(site)/[category]/page";
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

beforeEach(() => {
  mockListByCategory.mockReset();
  mockNotFound.mockClear();
});

const buildProps = (category: string) => ({
  params: Promise.resolve({ category }),
  searchParams: Promise.resolve({}),
});

describe("generateStaticParams", () => {
  it("returns a param for every category", () => {
    expect(generateStaticParams()).toEqual([
      { category: "womens-health" },
      { category: "sleep" },
      { category: "nutrition" },
      { category: "wellness" },
    ]);
  });
});

describe("generateMetadata", () => {
  it("builds a title and description for a known category", async () => {
    const metadata = await generateMetadata(buildProps("sleep"));

    expect(metadata.title).toBe("Sleep — WellWithHer");
    expect(metadata.description).toBe("Sleep articles from WellWithHer.");
  });

  it("returns empty metadata for an unknown category", async () => {
    const metadata = await generateMetadata(buildProps("not-a-category"));

    expect(metadata).toEqual({});
  });
});

describe("CategoryPage", () => {
  it("renders the category heading and its articles", async () => {
    mockListByCategory.mockResolvedValue([buildArticle()]);

    render(await CategoryPage(buildProps("sleep")));

    expect(mockListByCategory).toHaveBeenCalledWith("sleep");
    expect(
      screen.getByRole("heading", { name: "Sleep" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A Wind-Down Routine")).toBeInTheDocument();
  });

  it("shows the empty state for a category with no articles", async () => {
    mockListByCategory.mockResolvedValue([]);

    render(await CategoryPage(buildProps("womens-health")));

    expect(screen.getByText(/No articles yet/)).toBeInTheDocument();
  });

  it("calls notFound() for an unknown category", async () => {
    await expect(
      CategoryPage(buildProps("not-a-category")),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
    expect(mockListByCategory).not.toHaveBeenCalled();
  });
});
