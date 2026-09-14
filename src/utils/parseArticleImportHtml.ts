import { HTMLElement, NodeType,parse } from "node-html-parser";

export interface ImportContentSegment {
  type: "content";
  html: string;
}

export interface ImportImageSegment {
  type: "image";
  src: string;
  alt: string;
}

export type ImportSegment = ImportContentSegment | ImportImageSegment;

// Images are only recognized as their own top-level block (an <img> that is
// a direct child of the document, not nested inside a <p>) — every real
// sample article HTML seen so far uses images this way, and supporting
// inline mid-paragraph images would need a much more involved node-by-node
// splitter for a case that hasn't actually come up.
export const parseArticleImportHtml = (sanitizedHtml: string): ImportSegment[] => {
  const root = parse(sanitizedHtml);
  const segments: ImportSegment[] = [];
  let pendingHtml = "";

  const flushPending = () => {
    const trimmed = pendingHtml.trim();
    if (trimmed) {
      segments.push({ type: "content", html: trimmed });
    }
    pendingHtml = "";
  };

  for (const node of root.childNodes) {
    if (node.nodeType === NodeType.ELEMENT_NODE && node instanceof HTMLElement) {
      if (node.tagName?.toLowerCase() === "img") {
        flushPending();
        segments.push({
          type: "image",
          src: node.getAttribute("src") ?? "",
          alt: node.getAttribute("alt") ?? "",
        });
        continue;
      }
      pendingHtml += node.toString();
    } else {
      // node-html-parser drops comment nodes at parse time by default, so
      // every non-element child here is a TEXT_NODE (confirmed empirically).
      pendingHtml += node.toString();
    }
  }

  flushPending();
  return segments;
};
