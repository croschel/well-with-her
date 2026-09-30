const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

// Google's spec: the noscript fallback goes immediately after the opening
// <body> tag. Env-gated exactly like GtmScripts.
export const GtmNoScript = () =>
  gtmId ? (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  ) : null;
