import { Box, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";

import { ContactForm } from "@/components/organisms/ContactForm";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_LABEL,
  CONTACT_FOLLOW_LABEL,
  CONTACT_INSTAGRAM_LABEL,
  CONTACT_PAGE_HEADING,
  CONTACT_PAGE_METADATA_DESCRIPTION,
  CONTACT_PAGE_METADATA_TITLE,
  CONTACT_PAGE_TAGLINE,
  CONTACT_PINTEREST_LABEL,
} from "@/constants/contact";

export const metadata: Metadata = {
  title: CONTACT_PAGE_METADATA_TITLE,
  description: CONTACT_PAGE_METADATA_DESCRIPTION,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Box sx={{ maxWidth: 820, mx: "auto", px: 5, py: 8 }}>
      <Stack spacing={1} sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: "var(--font-playfair-display), serif",
            fontWeight: 600,
            fontSize: "34px",
          }}
        >
          {CONTACT_PAGE_HEADING}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-parisienne), cursive",
            fontSize: 22,
            color: "primary.dark",
          }}
        >
          {CONTACT_PAGE_TAGLINE}
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={5.5}>
        <Box sx={{ flex: "2 1 360px" }}>
          <ContactForm />
        </Box>
        <Stack spacing={3} sx={{ flex: "1 1 220px" }}>
          <Box>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ display: "block", fontSize: 11 }}
            >
              {CONTACT_EMAIL_LABEL}
            </Typography>
            <Typography color="text.secondary">{CONTACT_EMAIL}</Typography>
          </Box>
          <Box>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ display: "block", fontSize: 11 }}
            >
              {CONTACT_FOLLOW_LABEL}
            </Typography>
            {/* No real social profiles yet — same inert, non-link
                treatment as the footer's placeholder social items. */}
            <Typography color="text.secondary">
              {CONTACT_PINTEREST_LABEL}
            </Typography>
            <Typography color="text.secondary">
              {CONTACT_INSTAGRAM_LABEL}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
