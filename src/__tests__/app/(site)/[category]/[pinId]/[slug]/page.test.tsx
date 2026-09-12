import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetByRoute, mockListPublishedRefs, mockGetSiteInfo, mockNotFound } =
  vi.hoisted(() => ({
    mockGetByRoute: vi.fn(),
    mockListPublishedRefs: vi.fn(),
    mockGetSiteInfo: vi.fn(),
    mockNotFound: vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    }),
  }));

vi.mock("@/services/articles", () => ({
  getByRoute: mockGetByRoute,
  listPublishedRefs: mockListPublishedRefs,
}));

vi.mock("@/services/siteInfo", () => ({
  get: mockGetSiteInfo,
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

import ArticlePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(site)/[category]/[pinId]/[slug]/page";
import { Category } from "@/models/enums";
import type { Article, ArticleRouteRef, SiteInfo } from "@/models/interfaces";

const ROUTE_REF: ArticleRouteRef = {
  category: Category.Sleep,
  pinId: "pin002",
  slug: "wind-down-routine",
};

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: "1",
  ...ROUTE_REF,
  title: "A Wind-Down Routine",
  mainArticleContent: { root: {} },
  buyButtonUrl: "https://example.com/shop",
  heroImage: { url: "https://example.com/hero.jpg", alt: "A calm bedroom" },
  galleryImages: [],
  ogDescription: "A short blurb.",
  publishedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const buildSiteInfo = (): SiteInfo => ({
  asideContent: { root: { type: "root", children: [] } },
  disclosure: "Some links may be affiliate links.",
});

beforeEach(() => {
  mockGetByRoute.mockReset();
  mockListPublishedRefs.mockReset();
  mockGetSiteInfo.mockReset();
  mockNotFound.mockClear();
  mockGetSiteInfo.mockResolvedValue(buildSiteInfo());
});

const buildProps = (category: string, pinId: string, slug: string) => ({
  params: Promise.resolve({ category, pinId, slug }),
  searchParams: Promise.resolve({}),
});

describe("generateStaticParams", () => {
  it("returns a param for every published article", async () => {
    mockListPublishedRefs.mockResolvedValue([ROUTE_REF]);

    expect(await generateStaticParams()).toEqual([
      { category: "sleep", pinId: "pin002", slug: "wind-down-routine" },
    ]);
  });
});

describe("generateMetadata", () => {
  it("builds a title and description for an existing article", async () => {
    mockGetByRoute.mockResolvedValue(buildArticle());

    const metadata = await generateMetadata(
      buildProps("sleep", "pin002", "wind-down-routine"),
    );

    expect(metadata.title).toBe("A Wind-Down Routine");
    expect(metadata.description).toBe("A short blurb.");
  });

  it("returns empty metadata for an unknown category", async () => {
    const metadata = await generateMetadata(
      buildProps("not-a-category", "pin002", "wind-down-routine"),
    );

    expect(metadata).toEqual({});
    expect(mockGetByRoute).not.toHaveBeenCalled();
  });

  it("returns empty metadata when the article doesn't exist", async () => {
    mockGetByRoute.mockResolvedValue(null);

    const metadata = await generateMetadata(
      buildProps("sleep", "pin002", "wind-down-routine"),
    );

    expect(metadata).toEqual({});
  });
});

describe("ArticlePage", () => {
  it("renders the hero, body, and aside for an existing article", async () => {
    mockGetByRoute.mockResolvedValue(buildArticle());

    render(await ArticlePage(buildProps("sleep", "pin002", "wind-down-routine")));

    expect(mockGetByRoute).toHaveBeenCalledWith(ROUTE_REF);
    expect(
      screen.getByRole("heading", { name: "A Wind-Down Routine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("About WellWithHer")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Shop this pick →" }),
    ).toHaveAttribute("href", "https://example.com/shop");
  });

  it("calls notFound() for an unknown category", async () => {
    await expect(
      ArticlePage(buildProps("not-a-category", "pin002", "wind-down-routine")),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
    expect(mockGetByRoute).not.toHaveBeenCalled();
  });

  it("calls notFound() when the article doesn't exist", async () => {
    mockGetByRoute.mockResolvedValue(null);

    await expect(
      ArticlePage(buildProps("sleep", "pin002", "wind-down-routine")),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
  });
});
