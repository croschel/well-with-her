import { Box, Container, Stack, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { ArticleGrid } from "@/components/organisms/ArticleGrid";
import { CATEGORY_LABELS } from "@/constants/category";
import {
  HERO_HEADING,
  HERO_IMAGE_ALT,
  HERO_SUBHEADING,
  LATEST_ARTICLES_HEADING,
} from "@/constants/home";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";
import { listRecent } from "@/services/articles";
import * as siteInfoService from "@/services/siteInfo";

const CATEGORIES = Object.values(Category);

export default async function HomePage() {
  const [articles, siteInfo] = await Promise.all([
    listRecent(6),
    siteInfoService.get(),
  ]);

  return (
    <>
      {/* The hero photo carries the visual branding — this pair keeps a
          real, crawlable H1 on the page for SEO. */}
      <Typography component="h1" sx={visuallyHidden}>
        {HERO_HEADING}
      </Typography>
      <Typography component="p" sx={visuallyHidden}>
        {HERO_SUBHEADING}
      </Typography>

      {siteInfo.homeHeroImage ? (
        <Box
          component="img"
          src={siteInfo.homeHeroImage.url}
          alt={siteInfo.homeHeroImage.alt || HERO_IMAGE_ALT}
          sx={{ display: "block", width: "100%", height: "auto" }}
        />
      ) : null}

      <Box sx={{ textAlign: "center", px: 3, pt: 2, pb: 4 }}>
        <Stack
          direction="row"
          spacing={4.25}
          sx={{ justifyContent: "center", flexWrap: "wrap" }}
        >
          {CATEGORIES.map((category) => (
            <Stack
              key={category}
              component={NextLink}
              href={ROUTES.category(category)}
              spacing={1}
              sx={{
                alignItems: "center",
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <CategoryIcon
                category={category}
                sx={{ fontSize: 24, color: "primary.main" }}
              />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "text.secondary",
                }}
              >
                {CATEGORY_LABELS[category]}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 1, pb: 8 }}>
        <Typography variant="h4" sx={{ mb: 3.5 }}>
          {LATEST_ARTICLES_HEADING}
        </Typography>
        <ArticleGrid articles={articles} />
      </Container>
    </>
  );
}
