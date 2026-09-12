import { Box, Stack, Typography } from "@mui/material";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { LogoMark } from "@/components/atoms/LogoMark";
import { NextLink } from "@/components/atoms/NextLink";
import { ABOUT_HEADING, GET_IN_TOUCH_LABEL } from "@/constants/articlePage";
import { ROUTES } from "@/constants/routes";
import type { SiteInfo } from "@/models/interfaces";
import { BODY_TEXT_COLOR } from "@/theme/palette";

export interface AsideBioBoxProps {
  siteInfo: SiteInfo;
}

// Article page spec: sticky bio card reusing the CMS-editable
// SiteInfo.asideContent richtext, not hardcoded copy.
export const AsideBioBox = ({ siteInfo }: AsideBioBoxProps) => (
  <Stack
    spacing={1.5}
    sx={{
      position: "sticky",
      top: 96,
      alignItems: "center",
      textAlign: "center",
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "12px",
      p: 3.25,
    }}
  >
    <LogoMark size={52} />
    <Typography
      sx={{
        fontFamily: "var(--font-playfair-display), serif",
        fontWeight: 600,
        fontSize: 17,
      }}
    >
      {ABOUT_HEADING}
    </Typography>
    <Box
      sx={{
        fontSize: 14,
        lineHeight: 1.7,
        color: BODY_TEXT_COLOR,
        "& p": { m: 0 },
      }}
    >
      <RichText
        data={siteInfo.asideContent as unknown as Parameters<typeof RichText>[0]["data"]}
      />
    </Box>
    <Typography
      component={NextLink}
      href={ROUTES.contact}
      variant="body2"
      color="primary.main"
      sx={{ fontSize: 13, textDecoration: "none" }}
    >
      {GET_IN_TOUCH_LABEL}
    </Typography>
  </Stack>
);
