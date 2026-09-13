import "./globals.css";

import { Box } from "@mui/material";
import type { Metadata } from "next";

import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { DEFAULT_META_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/seo";
import { AppProviders } from "@/providers/AppProviders";
import { jost, parisienne, playfairDisplay } from "@/theme/fonts";

const pinterestDomainVerifyCode = process.env.PINTEREST_DOMAIN_VERIFY_CODE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_META_DESCRIPTION,
  // No Pinterest business account connected yet — the meta tag only
  // renders once a real verification code is set, same non-hardcoded
  // treatment as the footer's placeholder social links.
  ...(pinterestDomainVerifyCode
    ? { verification: { other: { "p:domain_verify": pinterestDomainVerifyCode } } }
    : {}),
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
