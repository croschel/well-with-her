import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ArticleHtmlImportError, importArticleHtml } from "@/services/importArticleHtml";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("importArticleHtml", () => {
  it("posts the html and returns the parsed content on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ content: { root: { children: [] } } }),
    });

    const content = await importArticleHtml("<p>hello</p>");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/articles/import-html",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: "<p>hello</p>" }),
      }),
    );
    expect(content).toEqual({ root: { children: [] } });
  });

  it("throws ArticleHtmlImportError when the response is not ok", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(importArticleHtml("<p>x</p>")).rejects.toThrow(ArticleHtmlImportError);
  });
});
