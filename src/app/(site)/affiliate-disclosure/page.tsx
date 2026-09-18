import { Box, Stack, Typography } from "@mui/material";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";

import {
  AFFILIATE_DISCLOSURE_PAGE_HEADING,
  AFFILIATE_DISCLOSURE_PAGE_METADATA_DESCRIPTION,
  AFFILIATE_DISCLOSURE_PAGE_METADATA_TITLE,
  AFFILIATE_DISCLOSURE_PAGE_TAGLINE,
} from "@/constants/affiliateDisclosure";
import { get as getSiteInfo } from "@/services/siteInfo";
import { BODY_TEXT_COLOR } from "@/theme/palette";

export const metadata: Metadata = {
  title: AFFILIATE_DISCLOSURE_PAGE_METADATA_TITLE,
  description: AFFILIATE_DISCLOSURE_PAGE_METADATA_DESCRIPTION,
  alternates: { canonical: "/affiliate-disclosure" },
};

export default async function AffiliateDisclosurePage() {
  const siteInfo = await getSiteInfo();

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
          {AFFILIATE_DISCLOSURE_PAGE_HEADING}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-parisienne), cursive",
            fontSize: 22,
            color: "primary.dark",
          }}
        >
          {AFFILIATE_DISCLOSURE_PAGE_TAGLINE}
        </Typography>
      </Stack>

      <Box
        sx={{
          fontSize: 15,
          lineHeight: 1.8,
          color: BODY_TEXT_COLOR,
          "& p": { m: 0, mb: 2 },
          "& h2": { mt: 4, mb: 1.5 },
        }}
      >
        <RichText
          data={
            siteInfo.affiliateDisclosureContent as unknown as Parameters<
              typeof RichText
            >[0]["data"]
          }
        />
      </Box>
    </Box>
  );
}
