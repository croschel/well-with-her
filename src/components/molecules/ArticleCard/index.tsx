import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { NextLink } from "@/components/atoms/NextLink";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import type { Article } from "@/models/interfaces";
import { BODY_TEXT_COLOR } from "@/theme/palette";

import { READ_MORE_LABEL } from "./constants";

export interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const imageUrl = article.heroImage.sizes?.card?.url ?? article.heroImage.url;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "10px",
        boxShadow: "0 1px 2px rgba(74, 50, 34, 0.05)",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": { boxShadow: "0 10px 26px rgba(74, 50, 34, 0.13)" },
      }}
    >
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
          sx={{ aspectRatio: "4 / 3", objectFit: "cover" }}
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.125 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ fontWeight: 500 }}
          >
            {CATEGORY_LABELS[article.category]}
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            color="text.primary"
            sx={{ lineHeight: 1.32 }}
          >
            {article.title}
          </Typography>
          {article.ogDescription ? (
            <Typography
              variant="body2"
              sx={{ color: BODY_TEXT_COLOR, lineHeight: 1.65 }}
            >
              {article.ogDescription}
            </Typography>
          ) : null}
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ mt: "auto", pt: 0.75 }}
          >
            {READ_MORE_LABEL}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
