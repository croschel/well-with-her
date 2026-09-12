import "./(site)/globals.css";

import { Button, Container, Typography } from "@mui/material";
import type { Metadata } from "next";

import { NextLink } from "@/components/atoms/NextLink";
import {
  HOME_LINK_LABEL,
  NOT_FOUND_HEADING,
  NOT_FOUND_SUBHEADING,
} from "@/constants/notFound";
import { ROUTES } from "@/constants/routes";
import { AppProviders } from "@/providers/AppProviders";
import { jost, parisienne, playfairDisplay } from "@/theme/fonts";

export const metadata: Metadata = {
  title: "Page not found — WellWithHer",
  description: "The page you are looking for does not exist.",
};

// Bypasses every layout (per Next's global-not-found convention), so its
// own fonts/theme/styles are brought in explicitly rather than inherited.
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${jost.variable} ${parisienne.variable}`}
    >
      <body>
        <AppProviders>
          <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {NOT_FOUND_HEADING}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {NOT_FOUND_SUBHEADING}
            </Typography>
            <Button component={NextLink} href={ROUTES.home} variant="contained">
              {HOME_LINK_LABEL}
            </Button>
          </Container>
        </AppProviders>
      </body>
    </html>
  );
}
