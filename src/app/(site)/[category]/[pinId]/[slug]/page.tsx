import { Box, Stack } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BuyButton } from "@/components/atoms/BuyButton";
import { ArticleBody } from "@/components/organisms/ArticleBody";
import { ArticleHero } from "@/components/organisms/ArticleHero";
import { AsideBioBox } from "@/components/organisms/AsideBioBox";
import { BUY_BUTTON_LABEL } from "@/constants/articlePage";
import { ROUTES } from "@/constants/routes";
import {
  ARTICLE_PAGE_TITLE,
  DEFAULT_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/constants/seo";
import { getByRoute, listPublishedRefs } from "@/services/articles";
import { get as getSiteInfo } from "@/services/siteInfo";
import { buildArticleJsonLd } from "@/utils/buildArticleJsonLd";
import { isCategory } from "@/utils/isCategory";

export const generateStaticParams = async () => {
  const refs = await listPublishedRefs();
  return refs.map(({ category, pinId, slug }) => ({ category, pinId, slug }));
};

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[pinId]/[slug]">): Promise<Metadata> {
  const { category, pinId, slug } = await params;
  if (!isCategory(category)) return {};

  const article = await getByRoute({ category, pinId, slug });
  if (!article) return {};

  const url = ROUTES.article(article);
  const description = article.ogDescription ?? DEFAULT_META_DESCRIPTION;
  const ogImage = article.ogImage ?? article.heroImage;

  return {
    title: ARTICLE_PAGE_TITLE(article.title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: article.publishedAt,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[category]/[pinId]/[slug]">) {
  const { category, pinId, slug } = await params;
  if (!isCategory(category)) {
    notFound();
  }

  const article = await getByRoute({ category, pinId, slug });
  if (!article) {
    notFound();
  }

  const siteInfo = await getSiteInfo();
  const jsonLd = buildArticleJsonLd(article, SITE_URL);

  return (
    <Box sx={{ maxWidth: 1160, mx: "auto", px: 5, py: 8 }}>
      {/* Schema.org Article structured data for Pinterest/search rich
          results — escape "<" so editor-authored text can't break out of
          the script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticleHero article={article} />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6.5}
        sx={{ alignItems: "flex-start" }}
      >
        <Box sx={{ flex: "2 1 560px", minWidth: 0 }}>
          <ArticleBody content={article.mainArticleContent} />
          <Box sx={{ mt: 4 }}>
            <BuyButton label={BUY_BUTTON_LABEL} href={article.buyButtonUrl} />
          </Box>
        </Box>
        <Box sx={{ flex: "1 1 260px", width: "100%" }}>
          <AsideBioBox siteInfo={siteInfo} />
        </Box>
      </Stack>
    </Box>
  );
}
