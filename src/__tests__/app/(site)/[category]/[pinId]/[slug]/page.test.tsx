import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetByRoute,
  mockListPublishedRefs,
  mockGetSiteInfo,
  mockNotFound,
  mockDraftMode,
} = vi.hoisted(() => ({
  mockGetByRoute: vi.fn(),
  mockListPublishedRefs: vi.fn(),
  mockGetSiteInfo: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  mockDraftMode: vi.fn(async () => ({ isEnabled: false })),
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
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("next/headers", () => ({
  draftMode: mockDraftMode,
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
  buyButtonLabel: "Shop this pick →",
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
  mockDraftMode.mockReset();
  mockDraftMode.mockResolvedValue({ isEnabled: false });
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
  it("builds a title, description, canonical URL, and OG/Twitter tags", async () => {
    mockGetByRoute.mockResolvedValue(buildArticle());

    const metadata = await generateMetadata(
      buildProps("sleep", "pin002", "wind-down-routine"),
    );

    expect(metadata.title).toBe("A Wind-Down Routine — WellWithHer");
    expect(metadata.description).toBe("A short blurb.");
    expect(metadata.alternates).toEqual({
      canonical: "/sleep/pin002/wind-down-routine",
    });
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      title: "A Wind-Down Routine",
      description: "A short blurb.",
      url: "/sleep/pin002/wind-down-routine",
      siteName: "WellWithHer",
      publishedTime: "2026-01-01T00:00:00.000Z",
      images: [
        {
          url: "https://example.com/hero.jpg",
          alt: "A calm bedroom",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "A Wind-Down Routine",
      description: "A short blurb.",
      images: ["https://example.com/hero.jpg"],
    });
  });

  it("falls back to the default site description when ogDescription is missing", async () => {
    mockGetByRoute.mockResolvedValue(buildArticle({ ogDescription: undefined }));

    const metadata = await generateMetadata(
      buildProps("sleep", "pin002", "wind-down-routine"),
    );

    expect(metadata.description).toBe(
      "Wellness articles and stories from WellWithHer.",
    );
  });

  it("prefers ogImage over heroImage for OG/Twitter images when present", async () => {
    mockGetByRoute.mockResolvedValue(
      buildArticle({
        ogImage: { url: "https://example.com/og.jpg", alt: "OG image" },
      }),
    );

    const metadata = await generateMetadata(
      buildProps("sleep", "pin002", "wind-down-routine"),
    );

    expect(metadata.twitter).toMatchObject({
      images: ["https://example.com/og.jpg"],
    });
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

    expect(mockGetByRoute).toHaveBeenCalledWith(ROUTE_REF, { draft: false });
    expect(
      screen.getByRole("heading", { name: "A Wind-Down Routine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("About WellWithHer")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Shop this pick →" }),
    ).toHaveAttribute("href", "https://example.com/shop");
  });

  it("renders Article JSON-LD structured data", async () => {
    mockGetByRoute.mockResolvedValue(buildArticle());

    const { container } = render(
      await ArticlePage(buildProps("sleep", "pin002", "wind-down-routine")),
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script?.innerHTML ?? "{}");
    expect(jsonLd).toMatchObject({
      "@type": "Article",
      headline: "A Wind-Down Routine",
    });
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

  it("requests the draft version and mounts the live-preview listener when Draft Mode is on", async () => {
    mockDraftMode.mockResolvedValue({ isEnabled: true });
    mockGetByRoute.mockResolvedValue(buildArticle());

    render(await ArticlePage(buildProps("sleep", "pin002", "wind-down-routine")));

    expect(mockGetByRoute).toHaveBeenCalledWith(ROUTE_REF, { draft: true });
  });
});
