import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/payloadClient", () => ({
  getPayloadClient: vi.fn(),
}));

import { importImageFromUrl } from "@/services/importMedia";
import { getPayloadClient } from "@/services/payloadClient";

const mockCreate = vi.fn();
const mockFetch = vi.fn();

beforeEach(() => {
  mockCreate.mockReset();
  vi.mocked(getPayloadClient).mockResolvedValue({
    create: mockCreate,
  } as unknown as Awaited<ReturnType<typeof getPayloadClient>>);
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const buildResponse = (overrides: Partial<Response> = {}): Response =>
  ({
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "image/png" }),
    arrayBuffer: async () => new TextEncoder().encode("fake-image-bytes").buffer,
    ...overrides,
  }) as Response;

describe("importImageFromUrl", () => {
  it("downloads the image and creates a media doc", async () => {
    mockFetch.mockResolvedValue(buildResponse());
    mockCreate.mockResolvedValue({ id: 99 });

    const result = await importImageFromUrl({
      src: "https://example.com/photo.png",
      alt: "A nice photo",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/photo.png",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(mockCreate).toHaveBeenCalledWith({
      collection: "media",
      data: { alt: "A nice photo" },
      file: {
        data: expect.any(Buffer),
        mimetype: "image/png",
        name: "photo.png",
        size: expect.any(Number),
      },
    });
    expect(result).toEqual({ mediaId: 99 });
  });

  it("falls back to a default alt when none is given", async () => {
    mockFetch.mockResolvedValue(buildResponse());
    mockCreate.mockResolvedValue({ id: 1 });

    await importImageFromUrl({ src: "https://example.com/photo.png", alt: "" });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { alt: "Imported image — add a description" },
      }),
    );
  });

  it("falls back to a default mimetype when content-type is absent", async () => {
    mockFetch.mockResolvedValue(buildResponse({ headers: new Headers() }));
    mockCreate.mockResolvedValue({ id: 1 });

    await importImageFromUrl({ src: "https://example.com/photo.png", alt: "x" });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ mimetype: "image/png" }),
      }),
    );
  });

  it("falls back to a generated filename when the URL has no path segment", async () => {
    mockFetch.mockResolvedValue(buildResponse());
    mockCreate.mockResolvedValue({ id: 1 });

    await importImageFromUrl({ src: "https://example.com/", alt: "x" });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ name: expect.stringMatching(/^imported-/) }),
      }),
    );
  });

  it("rejects a non-http(s) URL", async () => {
    await expect(
      importImageFromUrl({ src: "ftp://example.com/a.png", alt: "x" }),
    ).rejects.toThrow(/protocol/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws when the download fails", async () => {
    mockFetch.mockResolvedValue(buildResponse({ ok: false, status: 404 }));

    await expect(
      importImageFromUrl({ src: "https://example.com/missing.png", alt: "x" }),
    ).rejects.toThrow(/404/);
  });

  it("rejects an image over the size limit via content-length", async () => {
    mockFetch.mockResolvedValue(
      buildResponse({
        headers: new Headers({
          "content-type": "image/png",
          "content-length": String(11 * 1024 * 1024),
        }),
      }),
    );

    await expect(
      importImageFromUrl({ src: "https://example.com/huge.png", alt: "x" }),
    ).rejects.toThrow(/exceeds/i);
  });

  it("rejects an image over the size limit when content-length is absent but the body is too large", async () => {
    mockFetch.mockResolvedValue(
      buildResponse({
        headers: new Headers({ "content-type": "image/png" }),
        arrayBuffer: async () => new ArrayBuffer(11 * 1024 * 1024),
      }),
    );

    await expect(
      importImageFromUrl({ src: "https://example.com/huge.png", alt: "x" }),
    ).rejects.toThrow(/exceeds/i);
  });
});
