import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockListRecent, mockGetSiteInfo } = vi.hoisted(() => ({
  mockListRecent: vi.fn(),
  mockGetSiteInfo: vi.fn(),
}));

vi.mock("@/services/articles", () => ({
  listRecent: mockListRecent,
}));

vi.mock("@/services/siteInfo", () => ({
  get: mockGetSiteInfo,
}));

import HomePage from "@/app/(site)/page";
import { Category } from "@/models/enums";
import type { Article, SiteInfo } from "@/models/interfaces";

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

const buildSiteInfo = (overrides: Partial<SiteInfo> = {}): SiteInfo => ({
  asideContent: { root: {} },
  disclosure: "Some links are affiliate links.",
  ...overrides,
});

describe("HomePage", () => {
  it("renders a hidden H1 and a link for every category", async () => {
    mockListRecent.mockResolvedValue([]);
    mockGetSiteInfo.mockResolvedValue(buildSiteInfo());

    render(await HomePage());

    expect(
      screen.getByRole("heading", { name: "WellWithHer", level: 1 }),
    ).toBeInTheDocument();
    for (const label of ["Women's Health", "Sleep", "Nutrition", "Wellness"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders the hero image when SiteInfo has one", async () => {
    mockListRecent.mockResolvedValue([]);
    mockGetSiteInfo.mockResolvedValue(
      buildSiteInfo({
        homeHeroImage: { url: "https://example.com/hero.jpg", alt: "Hero" },
      }),
    );

    render(await HomePage());

    expect(screen.getByRole("img", { name: "Hero" })).toHaveAttribute(
      "src",
      "https://example.com/hero.jpg",
    );
  });

  it("falls back to a default alt when the hero image has none", async () => {
    mockListRecent.mockResolvedValue([]);
    mockGetSiteInfo.mockResolvedValue(
      buildSiteInfo({
        homeHeroImage: { url: "https://example.com/hero.jpg", alt: "" },
      }),
    );

    render(await HomePage());

    expect(screen.getByRole("img", { name: "WellWithHer" })).toBeInTheDocument();
  });

  it("renders nothing for the hero image when SiteInfo has none", async () => {
    mockListRecent.mockResolvedValue([]);
    mockGetSiteInfo.mockResolvedValue(buildSiteInfo());

    render(await HomePage());

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders the latest articles returned by the service", async () => {
    mockListRecent.mockResolvedValue([
      buildArticle({ id: "1", title: "First article" }),
      buildArticle({ id: "2", title: "Second article" }),
    ]);
    mockGetSiteInfo.mockResolvedValue(buildSiteInfo());

    render(await HomePage());

    expect(mockListRecent).toHaveBeenCalledWith(6);
    expect(screen.getByText("First article")).toBeInTheDocument();
    expect(screen.getByText("Second article")).toBeInTheDocument();
  });

  it("shows the empty state when there are no articles yet", async () => {
    mockListRecent.mockResolvedValue([]);
    mockGetSiteInfo.mockResolvedValue(buildSiteInfo());

    render(await HomePage());

    expect(screen.getByText(/No articles yet/)).toBeInTheDocument();
  });
});
