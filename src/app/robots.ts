import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/seo";

// Admin/API are excluded from crawling — they're not public content, and
// indexing the CMS login page serves no one.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
