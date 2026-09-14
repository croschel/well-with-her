import { describe, expect, it } from "vitest";

import { convertHtmlToLexicalNodes } from "@/utils/convertHtmlToLexicalNodes";

describe("convertHtmlToLexicalNodes", () => {
  it("converts a heading to a real heading node", () => {
    const nodes = convertHtmlToLexicalNodes("<h2>A Heading</h2>") as Record<string, unknown>[];

    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({ type: "heading", tag: "h2" });
  });

  it("converts bold and italic formatting", () => {
    const nodes = convertHtmlToLexicalNodes(
      "<p><strong>bold</strong> <em>italic</em></p>",
    ) as { children: Record<string, unknown>[] }[];

    const [paragraph] = nodes;
    expect(paragraph.children[0]).toMatchObject({ text: "bold", format: 1 });
    expect(paragraph.children[2]).toMatchObject({ text: "italic", format: 2 });
  });

  it("converts a link to a real link node with the href as url", () => {
    const nodes = convertHtmlToLexicalNodes(
      '<p><a href="https://example.com">a link</a></p>',
    ) as { children: Record<string, unknown>[] }[];

    const [paragraph] = nodes;
    expect(paragraph.children[0]).toMatchObject({
      type: "link",
      url: "https://example.com",
    });
  });

  it("converts an unordered list", () => {
    const nodes = convertHtmlToLexicalNodes(
      "<ul><li>one</li><li>two</li></ul>",
    ) as { listType: string; children: unknown[] }[];

    expect(nodes[0]).toMatchObject({ type: "list", listType: "bullet" });
    expect(nodes[0].children).toHaveLength(2);
  });

  it("converts a blockquote", () => {
    const nodes = convertHtmlToLexicalNodes("<blockquote>a quote</blockquote>");

    expect(nodes[0]).toMatchObject({ type: "quote" });
  });

  it("leaves a span with no style attribute to default handling", () => {
    const nodes = convertHtmlToLexicalNodes(
      "<p>before <span>plain</span> after</p>",
    ) as { children: Record<string, unknown>[] }[];

    const [paragraph] = nodes;
    const text = paragraph.children.map((child) => child.text).join("");
    expect(text).toContain("plain");
    expect(paragraph.children.every((child) => !child.style)).toBe(true);
  });

  it("skips an empty styled span instead of producing an empty text node", () => {
    const nodes = convertHtmlToLexicalNodes(
      '<p><span style="color:#8a9678"></span>plain text</p>',
    ) as { children: Record<string, unknown>[] }[];

    const [paragraph] = nodes;
    expect(paragraph.children.map((child) => child.text)).toEqual(["plain text"]);
  });

  it("preserves a color style from a span as a text node style", () => {
    const nodes = convertHtmlToLexicalNodes(
      '<p>plain <span style="color:#8a9678">sage</span> text</p>',
    ) as { children: Record<string, unknown>[] }[];

    const [paragraph] = nodes;
    const coloredNode = paragraph.children.find((n) => n.text === "sage");
    expect(coloredNode).toMatchObject({ style: "color:#8a9678" });
  });
});
