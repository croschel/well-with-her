import type { ThemeOptions } from "@mui/material";

export const components: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 24,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
};
