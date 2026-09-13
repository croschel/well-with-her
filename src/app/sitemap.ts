import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE_URL } from "@/constants/seo";
import { Category } from "@/models/enums";
import { listPublishedRefs } from "@/services/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleRefs = await listPublishedRefs();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}${ROUTES.home}`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}${ROUTES.contact}`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = Object.values(Category).map(
    (category) => ({
      url: `${SITE_URL}${ROUTES.category(category)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = articleRefs.map((ref) => ({
    url: `${SITE_URL}${ROUTES.article(ref)}`,
    lastModified: ref.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
