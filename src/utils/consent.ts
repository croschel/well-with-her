import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  CONSENT_WAIT_FOR_UPDATE_MS,
} from "@/constants/consent";
import type {
  ConsentChoice,
  GoogleConsentSignals,
  StoredConsent,
} from "@/models/interfaces";

// Returns null for anything that isn't a current, well-formed, unexpired
// choice — the caller treats null as "ask again".
export const parseStoredConsent = (
  raw: string | null,
  now: number = Date.now(),
): StoredConsent | null => {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const { version, analytics, advertising, decidedAt } = value as Record<
    string,
    unknown
  >;
  if (
    version !== CONSENT_VERSION ||
    typeof analytics !== "boolean" ||
    typeof advertising !== "boolean" ||
    typeof decidedAt !== "number" ||
    now - decidedAt > CONSENT_MAX_AGE_MS
  ) {
    return null;
  }
  return { version, analytics, advertising, decidedAt };
};

export const serializeConsent = (
  choice: ConsentChoice,
  now: number = Date.now(),
): string =>
  JSON.stringify({
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    advertising: choice.advertising,
    decidedAt: now,
  });

// Analytics -> analytics_storage; Advertising -> the three ad signals
// together (they are one category to the visitor).
export const toGoogleConsent = (choice: ConsentChoice): GoogleConsentSignals => {
  const analytics = choice.analytics ? "granted" : "denied";
  const advertising = choice.advertising ? "granted" : "denied";
  return {
    ad_storage: advertising,
    analytics_storage: analytics,
    ad_user_data: advertising,
    ad_personalization: advertising,
  };
};

// Global Privacy Control: a browser-level "do not sell/share" signal.
export const isGpcEnabled = (): boolean =>
  (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl === true;

// Inline script for the <head>: runs before GTM and the direct GA4 tag.
// Denies everything by default (Advanced Consent Mode — tags still load and
// send cookieless pings), redacts ad data, then restores a valid stored
// choice synchronously so returning visitors are never briefly "denied".
// With no stored choice it pushes no update, so consent (including
// advertising under GPC) stays denied. It must push `arguments` objects via
// gtag() — Google's libraries ignore plain objects in the dataLayer. The
// validity check mirrors parseStoredConsent (this runs before any bundle).
export const buildConsentBootstrapScript = (): string =>
  `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:${CONSENT_WAIT_FOR_UPDATE_MS}});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',false);
try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}));
if(s&&s.version===${CONSENT_VERSION}&&typeof s.analytics==='boolean'&&typeof s.advertising==='boolean'&&typeof s.decidedAt==='number'&&Date.now()-s.decidedAt<=${CONSENT_MAX_AGE_MS}){
var a=s.analytics?'granted':'denied',d=s.advertising?'granted':'denied';
gtag('consent','update',{ad_storage:d,analytics_storage:a,ad_user_data:d,ad_personalization:d});}}catch(e){}`;
