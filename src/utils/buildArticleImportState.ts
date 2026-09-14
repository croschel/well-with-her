import { randomUUID } from "node:crypto";

import type { RichTextContent } from "@/models/interfaces";

import { convertHtmlToLexicalNodes } from "./convertHtmlToLexicalNodes";
import { parseArticleImportHtml } from "./parseArticleImportHtml";

export interface UploadedImportImage {
  mediaId: number | string;
}

export type UploadImportImageFn = (params: {
  src: string;
  alt: string;
}) => Promise<UploadedImportImage>;

const buildImageBlockNode = (mediaId: number | string) => ({
  type: "block",
  format: "",
  version: 2,
  fields: {
    id: randomUUID(),
    blockName: "",
    blockType: "imageBlock",
    image: mediaId,
    caption: null,
  },
});

// Orchestrates the pure parsing/conversion pieces with the one async,
// I/O-bound step (uploading each image) — kept as an injected function so
// this stays fully testable with a mock, no real Payload/network needed.
export const buildArticleImportState = async (
  sanitizedHtml: string,
  uploadImage: UploadImportImageFn,
): Promise<RichTextContent> => {
  const segments = parseArticleImportHtml(sanitizedHtml);
  const children: unknown[] = [];

  for (const segment of segments) {
    if (segment.type === "content") {
      children.push(...convertHtmlToLexicalNodes(segment.html));
    } else {
      const uploaded = await uploadImage({ src: segment.src, alt: segment.alt });
      children.push(buildImageBlockNode(uploaded.mediaId));
    }
  }

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: null,
      children,
    },
  };
};
