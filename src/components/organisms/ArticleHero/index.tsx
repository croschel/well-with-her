import { Box, Stack, Typography } from "@mui/material";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { ARTICLE_BYLINE } from "@/constants/articlePage";
import { CATEGORY_LABELS } from "@/constants/category";
import type { Article } from "@/models/interfaces";

export interface ArticleHeroProps {
  article: Article;
}

export const ArticleHero = ({ article }: ArticleHeroProps) => {
  const imageUrl = article.heroImage.sizes?.hero?.url ?? article.heroImage.url;

  return (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Box
        component="img"
        src={imageUrl}
        alt={article.heroImage.alt}
        sx={{
          width: "100%",
          height: "min(52vw, 420px)",
          minHeight: 240,
          objectFit: "cover",
          borderRadius: "12px",
          display: "block",
        }}
      />
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
        <CategoryIcon
          category={article.category}
          sx={{ fontSize: 16, color: "primary.main" }}
        />
        <Typography
          variant="overline"
          color="primary.main"
          sx={{ fontSize: 12, letterSpacing: "1px", fontWeight: 500, lineHeight: 1 }}
        >
          {CATEGORY_LABELS[article.category]}
        </Typography>
      </Stack>
      <Typography
        component="h1"
        sx={{
          fontFamily: "var(--font-playfair-display), serif",
          fontWeight: 600,
          fontSize: "37px",
          lineHeight: 1.22,
          color: "text.primary",
        }}
      >
        {article.title}
      </Typography>
      <Typography variant="caption" color="secondary.main" sx={{ fontSize: 13 }}>
        {ARTICLE_BYLINE}
      </Typography>
    </Stack>
  );
};
