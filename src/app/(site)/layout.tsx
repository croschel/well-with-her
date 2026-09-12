import "./globals.css";

import { Box } from "@mui/material";
import type { Metadata } from "next";

import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { AppProviders } from "@/providers/AppProviders";
import { jost, parisienne, playfairDisplay } from "@/theme/fonts";

export const metadata: Metadata = {
  title: "WellWithHer",
  description: "Wellness articles and stories from WellWithHer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${jost.variable} ${parisienne.variable}`}
    >
      <body>
        <AppProviders>
          <Box
            sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
          >
            <SiteHeader />
            <Box component="main" sx={{ flex: "1 1 auto" }}>
              {children}
            </Box>
            <SiteFooter />
          </Box>
        </AppProviders>
      </body>
    </html>
  );
}
