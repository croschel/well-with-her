import Script from "next/script";

import { buildConsentBootstrapScript } from "@/utils/consent";

// Must render in the (site) root layout. beforeInteractive puts the inline
// script in the initial HTML ahead of the afterInteractive GTM and GA4
// scripts, so consent is denied (or restored from the stored choice)
// before any Google tag reads it. Not env-gated: it only defines
// dataLayer/gtag, so it is harmless when GTM and GA4 aren't configured.
export const ConsentDefaults = () => (
  <Script id="consent-defaults" strategy="beforeInteractive">
    {buildConsentBootstrapScript()}
  </Script>
);
