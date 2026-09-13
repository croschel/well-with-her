import type { Category } from "@/models/enums";

import type { MediaAsset } from "./media";

// Lexical's serialized editor state. Kept loose here deliberately — the
// domain layer shouldn't commit to the rich-text engine's exact node
// shape; the renderer (Ticket 6) types it precisely where it's consumed.
export type RichTextContent = Record<string, unknown>;

export interface Article {
  id: string;
  category: Category;
  pinId: string;
  slug: string;
  title: string;
  mainArticleContent: RichTextContent;
  buyButtonUrl: string;
  heroImage: MediaAsset;
  galleryImages: MediaAsset[];
  videoEmbedUrl?: string;
  ogImage?: MediaAsset;
  ogDescription?: string;
  publishedAt: string;
}

export interface ArticleRouteRef {
  category: Category;
  pinId: string;
  slug: string;
  publishedAt?: string;
}
