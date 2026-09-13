import { Category } from "@/models/enums";
import type { Article, ArticleRouteRef } from "@/models/interfaces";

import type { Article as PayloadArticle } from "../../../payload-types";
import {
  resolveMediaAsset,
  resolveMediaAssetList,
  resolveOptionalMediaAsset,
} from "./mediaMapper";

const toCategory = (value: PayloadArticle["category"]): Category =>
  value as Category;

export const mapArticle = (doc: PayloadArticle): Article => ({
  id: String(doc.id),
  category: toCategory(doc.category),
  pinId: doc.pinId,
  slug: doc.slug,
  title: doc.title,
  mainArticleContent: doc.mainArticleContent,
  buyButtonUrl: doc.buyButtonUrl,
  heroImage: resolveMediaAsset(doc.heroImage),
  galleryImages: resolveMediaAssetList(doc.galleryImages),
  videoEmbedUrl: doc.videoEmbedUrl ?? undefined,
  ogImage: resolveOptionalMediaAsset(doc.ogImage),
  ogDescription: doc.ogDescription ?? undefined,
  publishedAt: doc.publishedAt,
});

export const mapArticleRouteRef = (
  doc: Pick<PayloadArticle, "category" | "pinId" | "slug" | "publishedAt">,
): ArticleRouteRef => ({
  category: toCategory(doc.category),
  pinId: doc.pinId,
  slug: doc.slug,
  publishedAt: doc.publishedAt,
});
