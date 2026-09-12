import { Box, Stack } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BuyButton } from "@/components/atoms/BuyButton";
import { ArticleBody } from "@/components/organisms/ArticleBody";
import { ArticleHero } from "@/components/organisms/ArticleHero";
import { AsideBioBox } from "@/components/organisms/AsideBioBox";
import { BUY_BUTTON_LABEL } from "@/constants/articlePage";
import { getByRoute, listPublishedRefs } from "@/services/articles";
import { get as getSiteInfo } from "@/services/siteInfo";
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

  return {
    title: article.title,
    description: article.ogDescription,
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

  return (
    <Box sx={{ maxWidth: 1160, mx: "auto", px: 5, py: 8 }}>
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
