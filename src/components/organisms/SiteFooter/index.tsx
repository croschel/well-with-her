import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import { NextLink } from "@/components/atoms/NextLink";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";
import { FOOTER_BACKGROUND } from "@/theme/palette";

import {
  ABOUT_LABEL,
  CATEGORIES_HEADING,
  COMPANY_HEADING,
  CONTACT_LABEL,
  COPYRIGHT_TEXT,
  FOLLOW_HEADING,
  FOOTER_TAGLINE,
  INSTAGRAM_LABEL,
  PINTEREST_LABEL,
  PRIVACY_POLICY_LABEL,
} from "./constants";

const CATEGORIES = Object.values(Category);

export const SiteFooter = () => (
  <Box
    component="footer"
    sx={{
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: FOOTER_BACKGROUND,
      mt: "auto",
    }}
  >
    <Container maxWidth="lg" sx={{ pt: 6.5, pb: 3.75 }}>
      <Grid container spacing={4.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            WellWithHer
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-parisienne), cursive",
              fontSize: 17,
              color: "primary.dark",
            }}
          >
            {FOOTER_TAGLINE}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: "block", mb: 1 }}
          >
            {CATEGORIES_HEADING}
          </Typography>
          <Stack spacing={1}>
            {CATEGORIES.map((category) => (
              <Typography
                key={category}
                component={NextLink}
                href={ROUTES.category(category)}
                variant="body2"
                sx={{ color: "text.secondary", textDecoration: "none" }}
              >
                {CATEGORY_LABELS[category]}
              </Typography>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: "block", mb: 1 }}
          >
            {COMPANY_HEADING}
          </Typography>
          <Stack spacing={1}>
            <Typography
              component={NextLink}
              href={ROUTES.home}
              variant="body2"
              sx={{ color: "text.secondary", textDecoration: "none" }}
            >
              {ABOUT_LABEL}
            </Typography>
            <Typography
              component={NextLink}
              href={ROUTES.contact}
              variant="body2"
              sx={{ color: "text.secondary", textDecoration: "none" }}
            >
              {CONTACT_LABEL}
            </Typography>
            {/* No privacy policy page yet — shown as plain text, not a
                dead link, matching the design reference's own inert
                placeholder for this item. */}
            <Typography variant="body2" color="text.secondary">
              {PRIVACY_POLICY_LABEL}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: "block", mb: 1 }}
          >
            {FOLLOW_HEADING}
          </Typography>
          <Stack spacing={1}>
            {/* No real social profiles yet — same treatment as Privacy
                Policy above. */}
            <Typography variant="body2" color="text.secondary">
              {PINTEREST_LABEL}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {INSTAGRAM_LABEL}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>

    <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            py: 2.25,
          }}
        >
          <Typography variant="caption" color="secondary.main">
            {COPYRIGHT_TEXT(new Date().getFullYear())}
          </Typography>
          <Typography
            component={NextLink}
            href={ROUTES.contact}
            variant="caption"
            sx={{ color: "primary.main", textDecoration: "none" }}
          >
            {CONTACT_LABEL}
          </Typography>
        </Stack>
      </Container>
    </Box>
  </Box>
);
