"use client";

import { Typography } from "@mui/material";

import { openConsentPreferences } from "@/utils/consentStore";

import { COOKIE_SETTINGS_LABEL } from "./constants";

// A <button> (it runs an action, it doesn't navigate) styled like the
// footer's text links. Lets visitors change or withdraw consent any time.
export const CookieSettingsLink = () => (
  <Typography
    component="button"
    type="button"
    variant="body2"
    onClick={openConsentPreferences}
    sx={{
      color: "text.secondary",
      background: "none",
      border: 0,
      p: 0,
      font: "inherit",
      textAlign: "left",
      cursor: "pointer",
    }}
  >
    {COOKIE_SETTINGS_LABEL}
  </Typography>
);
