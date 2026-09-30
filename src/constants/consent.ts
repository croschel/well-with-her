export const CONSENT_STORAGE_KEY = "whh_consent";

// Bump when the categories or what they cover change materially — every
// visitor with an older stored version is asked again.
export const CONSENT_VERSION = 1;

// A stored choice older than this is ignored and the visitor is re-asked.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

// Dispatched on window by the footer "Cookie settings" link to reopen the
// preferences dialog.
export const OPEN_CONSENT_EVENT = "whh:open-consent";

// dataLayer event GTM triggers key off to re-fire tags after a choice.
export const CONSENT_UPDATE_DATALAYER_EVENT = "cookie_consent_update";

// How long Google tags wait for a consent update before using the default.
export const CONSENT_WAIT_FOR_UPDATE_MS = 500;
