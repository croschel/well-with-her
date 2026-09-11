import { describe, expect, it } from "vitest";

import {
  mapMediaAsset,
  resolveMediaAsset,
  resolveMediaAssetList,
  resolveOptionalMediaAsset,
} from "@/services/mappers/mediaMapper";

import type { Media } from "../../../../payload-types";

const buildMedia = (overrides: Partial<Media> = {}): Media => ({
  id: 1,
  alt: "A field of lavender",
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  url: "https://example.com/lavender.jpg",
  width: 1600,
  height: 900,
  ...overrides,
});

describe("mapMediaAsset", () => {
  it("maps the base fields", () => {
    const asset = mapMediaAsset(buildMedia());

    expect(asset.url).toBe("https://example.com/lavender.jpg");
    expect(asset.alt).toBe("A field of lavender");
    expect(asset.width).toBe(1600);
    expect(asset.height).toBe(900);
  });

  it("maps width/height to undefined when Payload's values are null", () => {
    const asset = mapMediaAsset(buildMedia({ width: null, height: null }));

    expect(asset.width).toBeUndefined();
    expect(asset.height).toBeUndefined();
  });

  it("falls back to an empty url when Payload's url is missing", () => {
    const asset = mapMediaAsset(buildMedia({ url: null }));

    expect(asset.url).toBe("");
  });

  it("maps only the size variants that have a complete url/width/height", () => {
    const asset = mapMediaAsset(
      buildMedia({
        sizes: {
          card: { url: "https://example.com/card.jpg", width: 600, height: 400 },
          gallery: { url: null, width: 1200, height: 800 },
        },
      }),
    );

    expect(asset.sizes?.card).toEqual({
      url: "https://example.com/card.jpg",
      width: 600,
      height: 400,
    });
    expect(asset.sizes?.gallery).toBeUndefined();
    expect(asset.sizes?.hero).toBeUndefined();
  });
});

describe("resolveMediaAsset", () => {
  it("resolves a populated media document", () => {
    const asset = resolveMediaAsset(buildMedia());
    expect(asset.url).toBe("https://example.com/lavender.jpg");
  });

  it("throws when given an unpopulated relation (raw ID)", () => {
    expect(() => resolveMediaAsset(42)).toThrow(/populated media relation/);
  });
});

describe("resolveOptionalMediaAsset", () => {
  it("returns undefined for null or undefined", () => {
    expect(resolveOptionalMediaAsset(null)).toBeUndefined();
    expect(resolveOptionalMediaAsset(undefined)).toBeUndefined();
  });

  it("resolves a populated media document", () => {
    expect(resolveOptionalMediaAsset(buildMedia())?.alt).toBe(
      "A field of lavender",
    );
  });
});

describe("resolveMediaAssetList", () => {
  it("defaults to an empty array for null or undefined", () => {
    expect(resolveMediaAssetList(null)).toEqual([]);
    expect(resolveMediaAssetList(undefined)).toEqual([]);
  });

  it("resolves every populated document in the list", () => {
    const list = resolveMediaAssetList([
      buildMedia({ id: 1 }),
      buildMedia({ id: 2, alt: "Second image" }),
    ]);

    expect(list).toHaveLength(2);
    expect(list[1]?.alt).toBe("Second image");
  });
});
