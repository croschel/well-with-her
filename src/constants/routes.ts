import type { Category } from "@/models/enums";
import type { ArticleRouteRef } from "@/models/interfaces";

export const ROUTES = {
  home: "/",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  affiliateDisclosure: "/affiliate-disclosure",
  category: (category: Category) => `/${category}`,
  article: ({ category, pinId, slug }: ArticleRouteRef) =>
    `/${category}/${pinId}/${slug}`,
};
