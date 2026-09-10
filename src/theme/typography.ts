import type { ThemeOptions } from "@mui/material";

const heading = {
  fontFamily: "var(--font-playfair-display), serif",
};

export const typography: ThemeOptions["typography"] = {
  fontFamily: "var(--font-jost), sans-serif",
  h1: { ...heading, fontWeight: 600 },
  h2: { ...heading, fontWeight: 600 },
  h3: { ...heading, fontWeight: 600 },
  h4: { ...heading, fontWeight: 500 },
  h5: { ...heading, fontWeight: 500 },
  h6: { ...heading, fontWeight: 500 },
  button: {
    fontFamily: "var(--font-jost), sans-serif",
    fontWeight: 500,
    textTransform: "none",
  },
};
