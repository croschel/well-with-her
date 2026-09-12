import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { ArticleGrid } from "@/components/organisms/ArticleGrid";
import { CATEGORY_LABELS } from "@/constants/category";
import {
  BROWSE_CATEGORIES_HEADING,
  HERO_HEADING,
  HERO_SUBHEADING,
  LATEST_ARTICLES_HEADING,
} from "@/constants/home";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";
import { listRecent } from "@/services/articles";

const CATEGORIES = Object.values(Category);

export default async function HomePage() {
  const articles = await listRecent(6);

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {HERO_HEADING}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {HERO_SUBHEADING}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          {BROWSE_CATEGORIES_HEADING}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 8 }}>
          {CATEGORIES.map((category) => (
            <Grid key={category} size={{ xs: 6, sm: 3 }}>
              <Stack
                component={NextLink}
                href={ROUTES.category(category)}
                spacing={1}
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  textDecoration: "none",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CategoryIcon
                  category={category}
                  sx={{ fontSize: 32, color: "primary.main" }}
                />
                <Typography variant="subtitle1">
                  {CATEGORY_LABELS[category]}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mb: 3 }}>
          {LATEST_ARTICLES_HEADING}
        </Typography>
        <ArticleGrid articles={articles} />
      </Container>
    </>
  );
}
