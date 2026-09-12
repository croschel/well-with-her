import type { ThemeOptions } from "@mui/material";

export const components: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 24,
        variants: [
          {
            // Design reference: solid CTAs (buy button, form submit) are
            // a dark ink pill, not the sage accent — sage stays reserved
            // for icons, links, and active states.
            props: { variant: "contained", color: "primary" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.default,
              "&:hover": {
                backgroundColor: theme.palette.text.primary,
                opacity: 0.9,
              },
            }),
          },
        ],
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
