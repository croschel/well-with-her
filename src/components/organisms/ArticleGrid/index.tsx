import { Box, Typography } from "@mui/material";

import { ArticleCard } from "@/components/molecules/ArticleCard";
import type { Article } from "@/models/interfaces";

import { EMPTY_STATE_MESSAGE } from "./constants";

export interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  if (articles.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
        {EMPTY_STATE_MESSAGE}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 3.75,
      }}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </Box>
  );
};
