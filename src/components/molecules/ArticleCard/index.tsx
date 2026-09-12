import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import type { Article } from "@/models/interfaces";

export interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const imageUrl = article.heroImage.sizes?.card?.url ?? article.heroImage.url;

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component={NextLink}
        href={ROUTES.article(article)}
        sx={{
          height: "100%",
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
          color: "text.primary",
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={article.heroImage.alt}
          sx={{ aspectRatio: "3 / 2", objectFit: "cover" }}
        />
        <CardContent>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", mb: 1 }}
          >
            <CategoryIcon
              category={article.category}
              fontSize="small"
              sx={{ color: "primary.main" }}
            />
            <Typography variant="overline" color="primary.main">
              {CATEGORY_LABELS[article.category]}
            </Typography>
          </Stack>
          <Typography variant="h6" component="h3" color="text.primary">
            {article.title}
          </Typography>
          {article.ogDescription ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {article.ogDescription}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
