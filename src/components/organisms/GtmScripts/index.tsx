import { GoogleTagManager } from "@next/third-parties/google";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

// Renders nothing until NEXT_PUBLIC_GTM_ID is set — same "no hardcoded
// placeholder" treatment as AnalyticsScripts. Site layout only; the
// (payload) admin layout must never load GTM.
export const GtmScripts = () => (gtmId ? <GoogleTagManager gtmId={gtmId} /> : null);
