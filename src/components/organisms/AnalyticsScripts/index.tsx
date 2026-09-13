import Script from "next/script";

const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const pinterestTagId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;

// Neither ID is configured yet — both scripts stay unrendered until the
// real IDs are set, same "no hardcoded placeholder" treatment used for
// Pinterest domain verification and the footer's social links.
export const AnalyticsScripts = () => (
  <>
    {ga4MeasurementId ? (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4MeasurementId}');`}
        </Script>
      </>
    ) : null}
    {pinterestTagId ? (
      <Script id="pinterest-tag-init" strategy="afterInteractive">
        {`!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
n=window.pintrk;n.queue=[],n.version="3.0";var
t=document.createElement("script");t.async=!0,t.src=e;var
r=document.getElementsByTagName("script")[0];
r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '${pinterestTagId}');
pintrk('page');`}
      </Script>
    ) : null}
  </>
);
