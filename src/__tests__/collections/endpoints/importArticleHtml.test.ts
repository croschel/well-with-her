import type { PayloadRequest } from "payload";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockImportImageFromUrl } = vi.hoisted(() => ({
  mockImportImageFromUrl: vi.fn(),
}));

vi.mock("@/services/importMedia", () => ({
  importImageFromUrl: mockImportImageFromUrl,
}));

import { importArticleHtmlHandler } from "@/collections/endpoints/importArticleHtml";

const buildRequest = (
  body: unknown,
  overrides: Partial<PayloadRequest> = {},
): PayloadRequest =>
  ({
    user: { id: 1 },
    json: async () => body,
    payload: { logger: { error: vi.fn() } },
    ...overrides,
  }) as unknown as PayloadRequest;

beforeEach(() => {
  mockImportImageFromUrl.mockReset();
});

describe("importArticleHtmlHandler", () => {
  it("rejects an unauthenticated request", async () => {
    const response = await importArticleHtmlHandler(
      buildRequest({ html: "<p>hi</p>" }, { user: null }),
    );

    expect(response.status).toBe(401);
  });

  it("rejects a request with no html", async () => {
    const response = await importArticleHtmlHandler(buildRequest({}));

    expect(response.status).toBe(400);
  });

  it("rejects a request with a blank html string", async () => {
    const response = await importArticleHtmlHandler(buildRequest({ html: "   " }));

    expect(response.status).toBe(400);
  });

  it("rejects a request with an unparseable body", async () => {
    const response = await importArticleHtmlHandler(
      buildRequest(null, {
        json: async () => {
          throw new Error("bad json");
        },
      }),
    );

    expect(response.status).toBe(400);
  });

  it("sanitizes, converts, and returns the resulting content for valid html", async () => {
    const response = await importArticleHtmlHandler(
      buildRequest({ html: "<h2>Title</h2><script>alert(1)</script>" }),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.content.root.children[0]).toMatchObject({
      type: "heading",
      tag: "h2",
    });
  });

  it("uploads images via the injected importImageFromUrl", async () => {
    mockImportImageFromUrl.mockResolvedValue({ mediaId: 7 });

    const response = await importArticleHtmlHandler(
      buildRequest({ html: '<img src="https://example.com/a.png" alt="A">' }),
    );
    const json = await response.json();

    expect(mockImportImageFromUrl).toHaveBeenCalledWith({
      src: "https://example.com/a.png",
      alt: "A",
    });
    expect(json.content.root.children[0]).toMatchObject({
      fields: { blockType: "imageBlock", image: 7 },
    });
  });

  it("returns 500 and logs when the import pipeline throws", async () => {
    mockImportImageFromUrl.mockRejectedValue(new Error("download failed"));
    const logError = vi.fn();

    const response = await importArticleHtmlHandler(
      buildRequest(
        { html: '<img src="https://example.com/a.png" alt="A">' },
        { payload: { logger: { error: logError } } } as never,
      ),
    );

    expect(response.status).toBe(500);
    expect(logError).toHaveBeenCalled();
  });
});
