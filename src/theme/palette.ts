import type { ThemeOptions } from "@mui/material";

export const CREAM_TINTS = {
  50: "#fffaf3",
  100: "#f8f2ea",
  200: "#f1e9dd",
  300: "#e9dfc9",
  400: "#e6dcc8",
} as const;

// Doesn't fit the numbered tint scale above — used only for the footer,
// per the design reference.
export const FOOTER_BACKGROUND = "#efe4d2";

// text.secondary (#5c4a3a) is for nav links and inactive UI labels — the
// design reference's own body/excerpt copy uses a distinct, slightly
// lighter tone that MUI's two-tier text palette has no slot for.
export const BODY_TEXT_COLOR = "#6b5c4a";

// A fourth, distinct tone used only for full article body paragraphs
// (longer-form reading copy gets slightly more contrast than card
// excerpts) — per the design reference's article page.
export const ARTICLE_BODY_TEXT_COLOR = "#4a3a2c";

export const palette: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    main: "#8a9678",
    dark: "#7c8a63",
    contrastText: CREAM_TINTS[50],
  },
  secondary: {
    main: "#9c8f78",
    contrastText: CREAM_TINTS[50],
  },
  background: {
    default: CREAM_TINTS[100],
    paper: CREAM_TINTS[50],
  },
  text: {
    primary: "#4a3222",
    secondary: "#5c4a3a",
  },
  divider: "#d8cdb8",
};
