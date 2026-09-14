import { createHeadlessEditor } from "@lexical/headless";
import { $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode,QuoteNode } from "@lexical/rich-text";
import { JSDOM } from "jsdom";
import { $createTextNode, $getRoot, $insertNodes, TextNode } from "lexical";

// $generateNodesFromDOM has no built-in handling for <span> at all — a
// colored span's text just gets merged into the surrounding plain text,
// silently dropping the color (confirmed empirically, not assumed).
// Hooking a custom importDOM handler onto a throwaway TextNode subclass is
// the documented Lexical extension point for teaching the DOM importer
// about a tag it doesn't otherwise recognize; the node it actually
// produces is a plain TextNode with .setStyle() applied, not an instance
// of this class — the class only exists to register the handler.
class SpanColorImportNode extends TextNode {
  static override getType(): string {
    return "span-color-import-helper";
  }

  /* v8 ignore start -- required by Lexical's node API for registration, but
   * this class is never instantiated (see class comment above), so its
   * clone() is never actually called. */
  static override clone(node: SpanColorImportNode): SpanColorImportNode {
    return new SpanColorImportNode(node.__text, node.__key);
  }
  /* v8 ignore stop */

  static override importDOM() {
    return {
      span: (domNode: HTMLElement) => {
        const style = domNode.getAttribute("style");
        if (!style) return null;
        return {
          priority: 1 as const,
          conversion: (element: HTMLElement) => {
            // element.textContent is only ever null for a Document node,
            // never an HTMLElement, so the fallback side is unreachable.
            /* v8 ignore next */
            const text = element.textContent ?? "";
            if (!text) return null;
            const textNode = $createTextNode(text);
            textNode.setStyle(style);
            return { node: textNode };
          },
        };
      },
    };
  }
}

const createImportEditor = () =>
  createHeadlessEditor({
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, SpanColorImportNode],
    // Headless editors swallow internal errors by default; rethrowing turns
    // an otherwise-silent parse failure back into a normal thrown error.
    // Not exercised by tests — would require forcing an internal Lexical
    // reconciliation failure, which sanitized, well-formed HTML never hits.
    /* v8 ignore next 3 */
    onError: (error) => {
      throw error;
    },
  });

// Converts one HTML fragment (already sanitized) into serialized Lexical
// nodes, using Lexical's own official HTML importer rather than hand-built
// node JSON — real node shapes (e.g. link nodes use rel/target/title/url,
// not a `fields` object) are easy to get subtly wrong by hand.
export const convertHtmlToLexicalNodes = (html: string): unknown[] => {
  const editor = createImportEditor();
  const dom = new JSDOM(html);

  editor.update(
    () => {
      const nodes = $generateNodesFromDOM(editor, dom.window.document);
      const root = $getRoot();
      root.clear();
      $insertNodes(nodes);
    },
    { discrete: true },
  );

  const json = editor.getEditorState().toJSON() as {
    root: { children: unknown[] };
  };
  return json.root.children;
};
