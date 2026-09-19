import { Box, Stack, Typography } from "@mui/material";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";

import {
  PRIVACY_POLICY_PAGE_HEADING,
  PRIVACY_POLICY_PAGE_METADATA_DESCRIPTION,
  PRIVACY_POLICY_PAGE_METADATA_TITLE,
  PRIVACY_POLICY_PAGE_TAGLINE,
} from "@/constants/privacyPolicy";
import { get as getSiteInfo } from "@/services/siteInfo";
import { BODY_TEXT_COLOR } from "@/theme/palette";

export const metadata: Metadata = {
  title: PRIVACY_POLICY_PAGE_METADATA_TITLE,
  description: PRIVACY_POLICY_PAGE_METADATA_DESCRIPTION,
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
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
          {PRIVACY_POLICY_PAGE_HEADING}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-parisienne), cursive",
            fontSize: 22,
            color: "primary.dark",
          }}
        >
          {PRIVACY_POLICY_PAGE_TAGLINE}
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
            siteInfo.privacyPolicyContent as unknown as Parameters<
              typeof RichText
            >[0]["data"]
          }
        />
      </Box>
    </Box>
  );
}
