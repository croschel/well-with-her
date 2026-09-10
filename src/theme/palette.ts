import type { ThemeOptions } from "@mui/material";

export const CREAM_TINTS = {
  50: "#fffaf3",
  100: "#f8f2ea",
  200: "#f1e9dd",
  300: "#e9dfc9",
  400: "#e6dcc8",
} as const;

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
    secondary: "#6b5c4a",
  },
  divider: "#d8cdb8",
};
