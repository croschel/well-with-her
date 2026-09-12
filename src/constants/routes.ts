import type { Category } from "@/models/enums";
import type { ArticleRouteRef } from "@/models/interfaces";

export const ROUTES = {
  home: "/",
  contact: "/contact",
  category: (category: Category) => `/${category}`,
  article: ({ category, pinId, slug }: ArticleRouteRef) =>
    `/${category}/${pinId}/${slug}`,
};
