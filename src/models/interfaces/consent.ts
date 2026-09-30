// What the visitor picked, per category. "Strictly necessary" is not a
// choice — it is always on.
export interface ConsentChoice {
  analytics: boolean;
  advertising: boolean;
}

// The shape persisted in localStorage. `version` lets us re-ask when the
// categories or wording materially change; `decidedAt` (epoch ms) drives
// the 12-month re-ask.
export interface StoredConsent extends ConsentChoice {
  version: number;
  decidedAt: number;
}

export type GoogleConsentValue = "granted" | "denied";

// The four Consent Mode v2 signals.
export interface GoogleConsentSignals {
  ad_storage: GoogleConsentValue;
  analytics_storage: GoogleConsentValue;
  ad_user_data: GoogleConsentValue;
  ad_personalization: GoogleConsentValue;
}
