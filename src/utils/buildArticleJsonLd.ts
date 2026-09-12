import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import { ARTICLE_AUTHOR_NAME, SITE_NAME } from "@/constants/seo";
import type { Article } from "@/models/interfaces";

// Payload's local media adapter serves relative URLs (no `serverURL`
// configured) — Next's Metadata API resolves those against `metadataBase`
// automatically for OG/Twitter tags, but a hand-written JSON-LD script gets
// no such help, so it needs the same resolution done explicitly here.
const toAbsoluteUrl = (siteUrl: string, url: string): string =>
  url.startsWith("http") ? url : `${siteUrl}${url}`;

// Schema.org Article structured data — Pinterest and search crawlers read
// this for rich results. Kept as a plain object (not a typed schema-org
// package) since the shape is small and stable.
export const buildArticleJsonLd = (
  article: Article,
  siteUrl: string,
): Record<string, unknown> => {
  const image = article.ogImage ?? article.heroImage;
  const url = `${siteUrl}${ROUTES.article(article)}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.ogDescription,
    image: [toAbsoluteUrl(siteUrl, image.url)],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: CATEGORY_LABELS[article.category],
    author: {
      "@type": "Organization",
      name: ARTICLE_AUTHOR_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
};
