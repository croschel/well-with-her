import type { Where } from "payload";

import { Category } from "@/models/enums";
import type { Article, ArticleRouteRef } from "@/models/interfaces";

import { mapArticle, mapArticleRouteRef } from "./mappers/articleMapper";
import { getPayloadClient } from "./payloadClient";

export const listRecent = async (limit = 6): Promise<Article[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    sort: "-publishedAt",
    limit,
    depth: 1,
    overrideAccess: false,
  });
  return result.docs.map(mapArticle);
};

export const listByCategory = async (
  category: Category,
  limit = 50,
): Promise<Article[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    where: { category: { equals: category } },
    sort: "-publishedAt",
    limit,
    depth: 1,
    overrideAccess: false,
  });
  return result.docs.map(mapArticle);
};

export const getByRoute = async (
  ref: ArticleRouteRef,
  options?: { draft?: boolean },
): Promise<Article | null> => {
  // `overrideAccess: false` is the only thing that actually applies the
  // collection's access.read rule (publishedAt <= now()) — Payload's Local
  // API bypasses access control by default, and the `draft` option below is
  // unrelated: it only controls which table (main vs versions) is read, not
  // who's allowed to see the result. A draft preview (options.draft: true,
  // not yet consumed anywhere) needs overrideAccess left permissive so an
  // editor can see their own unpublished draft.
  const isDraftPreview = options?.draft ?? false;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    where: {
      and: [
        { category: { equals: ref.category } },
        { pinId: { equals: ref.pinId } },
        { slug: { equals: ref.slug } },
      ],
    },
    draft: isDraftPreview,
    overrideAccess: isDraftPreview,
    depth: 1,
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? mapArticle(doc) : null;
};

export const listPublishedRefs = async (): Promise<ArticleRouteRef[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    limit: 0,
    depth: 0,
    select: { category: true, pinId: true, slug: true, publishedAt: true },
    overrideAccess: false,
  });
  return result.docs.map(mapArticleRouteRef);
};

const matchCategory = (term: string): Category | undefined =>
  (Object.values(Category) as string[]).includes(term.toLowerCase())
    ? (term.toLowerCase() as Category)
    : undefined;

export const search = async (term: string, limit = 10): Promise<Article[]> => {
  const trimmed = term.trim();
  if (!trimmed) return [];

  // `category` is a native Postgres enum column — it has no `contains`/ilike
  // operator, so an exact match against a recognized category is the only
  // way to include it in search, alongside free-text matches on pinId/slug.
  const matchedCategory = matchCategory(trimmed);
  const conditions: Where[] = [
    { pinId: { contains: trimmed } },
    { slug: { contains: trimmed } },
  ];
  if (matchedCategory) {
    conditions.push({ category: { equals: matchedCategory } });
  }

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    where: { or: conditions },
    limit,
    depth: 1,
    overrideAccess: false,
  });
  return result.docs.map(mapArticle);
};
