import { describe, expect, it, vi } from "vitest";

import { buildArticleImportState } from "@/utils/buildArticleImportState";

describe("buildArticleImportState", () => {
  it("converts plain content HTML into root children", async () => {
    const uploadImage = vi.fn();

    const state = await buildArticleImportState("<h2>Title</h2><p>Body</p>", uploadImage);

    expect(state.root).toMatchObject({ type: "root" });
    const children = (state.root as { children: Record<string, unknown>[] })
      .children;
    expect(children).toHaveLength(2);
    expect(children[0]).toMatchObject({ type: "heading", tag: "h2" });
    expect(children[1]).toMatchObject({ type: "paragraph" });
    expect(uploadImage).not.toHaveBeenCalled();
  });

  it("uploads an image and inserts an imageBlock node in its place", async () => {
    const uploadImage = vi.fn().mockResolvedValue({ mediaId: 42 });

    const state = await buildArticleImportState(
      '<p>Before</p><img src="https://example.com/a.png" alt="A photo"><p>After</p>',
      uploadImage,
    );

    expect(uploadImage).toHaveBeenCalledWith({
      src: "https://example.com/a.png",
      alt: "A photo",
    });
    const children = (state.root as { children: Record<string, unknown>[] })
      .children;
    expect(children).toHaveLength(3);
    expect(children[0]).toMatchObject({ type: "paragraph" });
    expect(children[1]).toMatchObject({
      type: "block",
      fields: { blockType: "imageBlock", image: 42, caption: null },
    });
    expect(children[2]).toMatchObject({ type: "paragraph" });
  });

  it("handles multiple images with distinct block ids", async () => {
    const uploadImage = vi
      .fn()
      .mockResolvedValueOnce({ mediaId: 1 })
      .mockResolvedValueOnce({ mediaId: 2 });

    const state = await buildArticleImportState(
      '<img src="https://example.com/a.png" alt="A"><img src="https://example.com/b.png" alt="B">',
      uploadImage,
    );

    const children = (state.root as { children: { fields: { id: string } }[] })
      .children;
    expect(children[0].fields.id).not.toBe(children[1].fields.id);
  });

  it("returns an empty children array for empty input", async () => {
    const uploadImage = vi.fn();

    const state = await buildArticleImportState("", uploadImage);

    expect((state.root as { children: unknown[] }).children).toEqual([]);
  });
});
