import { describe, expect, it, vi } from "vitest";

const { mockListPublishedRefs } = vi.hoisted(() => ({
  mockListPublishedRefs: vi.fn(),
}));

vi.mock("@/services/articles", () => ({
  listPublishedRefs: mockListPublishedRefs,
}));

import sitemap from "@/app/sitemap";
import { Category } from "@/models/enums";

describe("sitemap", () => {
  it("includes the static routes, every category, and every published article", async () => {
    mockListPublishedRefs.mockResolvedValue([
      {
        category: Category.Sleep,
        pinId: "pin002",
        slug: "wind-down-routine",
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/");
    expect(urls).toContain("http://localhost:3000/contact");
    expect(urls).toContain("http://localhost:3000/womens-health");
    expect(urls).toContain("http://localhost:3000/sleep");
    expect(urls).toContain("http://localhost:3000/nutrition");
    expect(urls).toContain("http://localhost:3000/wellness");
    expect(urls).toContain(
      "http://localhost:3000/sleep/pin002/wind-down-routine",
    );
  });

  it("uses the article's publishedAt as lastModified", async () => {
    mockListPublishedRefs.mockResolvedValue([
      {
        category: Category.Sleep,
        pinId: "pin002",
        slug: "wind-down-routine",
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    const entries = await sitemap();
    const articleEntry = entries.find((entry) =>
      entry.url.endsWith("/sleep/pin002/wind-down-routine"),
    );

    expect(articleEntry?.lastModified).toBe("2026-01-01T00:00:00.000Z");
  });

  it("returns only static and category entries when there are no articles yet", async () => {
    mockListPublishedRefs.mockResolvedValue([]);

    const entries = await sitemap();

    expect(entries).toHaveLength(6);
  });
});
