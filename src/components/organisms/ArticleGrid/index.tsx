import { Grid, Typography } from "@mui/material";

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
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ArticleCard article={article} />
        </Grid>
      ))}
    </Grid>
  );
};
