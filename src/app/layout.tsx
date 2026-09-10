import "./globals.css";

import type { Metadata } from "next";

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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
