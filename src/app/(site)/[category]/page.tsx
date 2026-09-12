import { Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { ArticleGrid } from "@/components/organisms/ArticleGrid";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "@/constants/category";
import {
  CATEGORY_PAGE_DESCRIPTION,
  CATEGORY_PAGE_TITLE,
} from "@/constants/categoryPage";
import { Category } from "@/models/enums";
import { listByCategory } from "@/services/articles";
import { isCategory } from "@/utils/isCategory";

export const generateStaticParams = () =>
  Object.values(Category).map((category) => ({ category }));

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) {
    return {};
  }

  const label = CATEGORY_LABELS[category];
  return {
    title: CATEGORY_PAGE_TITLE(label),
    description: CATEGORY_PAGE_DESCRIPTION(label),
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) {
    notFound();
  }

  const articles = await listByCategory(category);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack
        spacing={1}
        sx={{ alignItems: "center", textAlign: "center", mb: 6 }}
      >
        <CategoryIcon
          category={category}
          sx={{ fontSize: 30, color: "primary.main" }}
        />
        <Typography variant="h3">{CATEGORY_LABELS[category]}</Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-parisienne), cursive",
            fontSize: 20,
            color: "primary.dark",
          }}
        >
          {CATEGORY_DESCRIPTIONS[category]}
        </Typography>
      </Stack>
      <ArticleGrid articles={articles} />
    </Container>
  );
}
