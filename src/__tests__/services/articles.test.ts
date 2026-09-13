import { beforeEach, describe, expect, it, vi } from "vitest";

import { Category } from "@/models/enums";

vi.mock("@/services/payloadClient", () => ({
  getPayloadClient: vi.fn(),
}));

import * as articles from "@/services/articles";
import { getPayloadClient } from "@/services/payloadClient";

import type { Article, Media } from "../../../payload-types";

const media: Media = {
  id: 1,
  alt: "Hero",
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  url: "https://example.com/hero.jpg",
  width: 1600,
  height: 900,
};

const richText = {
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: null,
    children: [],
  },
};

const buildArticleDoc = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  category: "sleep",
  pinId: "pin002",
  slug: "wind-down-routine",
  title: "A Wind-Down Routine",
  mainArticleContent: richText,
  buyButtonUrl: "https://example.com/shop",
  heroImage: media,
  galleryImages: null,
  videoEmbedUrl: null,
  ogImage: null,
  ogDescription: null,
  publishedAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const mockFind = vi.fn();

beforeEach(() => {
  mockFind.mockReset();
  vi.mocked(getPayloadClient).mockResolvedValue({
    find: mockFind,
  } as unknown as Awaited<ReturnType<typeof getPayloadClient>>);
});

describe("listRecent", () => {
  it("sorts by publishedAt desc and maps the results", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    const result = await articles.listRecent(3);

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "articles",
        sort: "-publishedAt",
        limit: 3,
        depth: 1,
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.category).toBe(Category.Sleep);
  });
});

describe("listByCategory", () => {
  it("filters by the given category", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    await articles.listByCategory(Category.Sleep);

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "articles",
        where: { category: { equals: Category.Sleep } },
      }),
    );
  });
});

describe("getByRoute", () => {
  const ref = { category: Category.Sleep, pinId: "pin002", slug: "wind-down-routine" };

  it("queries by category + pinId + slug and defaults to published only", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    const result = await articles.getByRoute(ref);

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "articles",
        where: {
          and: [
            { category: { equals: ref.category } },
            { pinId: { equals: ref.pinId } },
            { slug: { equals: ref.slug } },
          ],
        },
        draft: false,
      }),
    );
    expect(result?.pinId).toBe("pin002");
  });

  it("returns null when no article matches", async () => {
    mockFind.mockResolvedValue({ docs: [] });

    const result = await articles.getByRoute(ref);

    expect(result).toBeNull();
  });

  it("threads the draft flag through when requested", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    await articles.getByRoute(ref, { draft: true });

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({ draft: true }),
    );
  });
});

describe("listPublishedRefs", () => {
  it("selects the route fields plus publishedAt, with no depth or limit", async () => {
    mockFind.mockResolvedValue({
      docs: [
        {
          category: "sleep",
          pinId: "pin002",
          slug: "wind-down-routine",
          publishedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    const result = await articles.listPublishedRefs();

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "articles",
        limit: 0,
        depth: 0,
        select: { category: true, pinId: true, slug: true, publishedAt: true },
      }),
    );
    expect(result).toEqual([
      {
        category: Category.Sleep,
        pinId: "pin002",
        slug: "wind-down-routine",
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });
});

describe("search", () => {
  it("returns an empty array without querying for a blank term", async () => {
    const result = await articles.search("   ");

    expect(result).toEqual([]);
    expect(mockFind).not.toHaveBeenCalled();
  });

  it("matches pinId/slug by substring", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    await articles.search("wind-down");

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          or: [
            { pinId: { contains: "wind-down" } },
            { slug: { contains: "wind-down" } },
          ],
        },
      }),
    );
  });

  it("also matches an exact category name, case-insensitively", async () => {
    mockFind.mockResolvedValue({ docs: [buildArticleDoc()] });

    await articles.search("Sleep");

    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          or: [
            { pinId: { contains: "Sleep" } },
            { slug: { contains: "Sleep" } },
            { category: { equals: Category.Sleep } },
          ],
        },
      }),
    );
  });
});
