import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";

import {
  CATEGORIES_HEADING,
  CONTACT_LABEL,
  COPYRIGHT_TEXT,
  FOOTER_TAGLINE,
  HOME_LABEL,
  SITE_HEADING,
} from "./constants";

const CATEGORIES = Object.values(Category);

export const SiteFooter = () => (
  <Box
    component="footer"
    sx={{
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      mt: 8,
    }}
  >
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            WellWithHer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {FOOTER_TAGLINE}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            {CATEGORIES_HEADING}
          </Typography>
          <Stack spacing={1}>
            {CATEGORIES.map((category) => (
              <Stack
                key={category}
                component={NextLink}
                href={ROUTES.category(category)}
                direction="row"
                spacing={0.75}
                sx={{
                  alignItems: "center",
                  color: "text.secondary",
                  textDecoration: "none",
                }}
              >
                <CategoryIcon category={category} fontSize="small" />
                <Typography variant="body2" component="span">
                  {CATEGORY_LABELS[category]}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            {SITE_HEADING}
          </Typography>
          <Stack spacing={1}>
            <Typography
              component={NextLink}
              href={ROUTES.home}
              variant="body2"
              sx={{ color: "text.secondary", textDecoration: "none" }}
            >
              {HOME_LABEL}
            </Typography>
            <Typography
              component={NextLink}
              href={ROUTES.contact}
              variant="body2"
              sx={{ color: "text.secondary", textDecoration: "none" }}
            >
              {CONTACT_LABEL}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 4 }}
      >
        {COPYRIGHT_TEXT(new Date().getFullYear())}
      </Typography>
    </Container>
  </Box>
);
