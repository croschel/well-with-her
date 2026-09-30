import { sendGTMEvent } from "@next/third-parties/google";

import {
  CONSENT_STORAGE_KEY,
  CONSENT_UPDATE_DATALAYER_EVENT,
  OPEN_CONSENT_EVENT,
} from "@/constants/consent";
import type { ConsentChoice, StoredConsent } from "@/models/interfaces";
import {
  parseStoredConsent,
  serializeConsent,
  toGoogleConsent,
} from "@/utils/consent";

// undefined = not known yet (server render / before mount), null = the
// visitor hasn't decided, otherwise their stored choice. The banner only
// renders once this is not undefined, so it never appears in server HTML.
export type ConsentSnapshot = StoredConsent | null | undefined;

const listeners = new Set<() => void>();
let cached: ConsentSnapshot;

const readStored = (): StoredConsent | null => {
  try {
    return parseStoredConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    // Storage blocked (private mode, disabled cookies): stay undecided.
    return null;
  }
};

const notify = () => {
  for (const listener of listeners) listener();
};

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  // Keeps other open tabs in sync when the choice changes elsewhere.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_STORAGE_KEY) return;
    cached = readStored();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

// Must return a referentially stable value between changes.
export const getSnapshot = (): ConsentSnapshot => {
  if (cached === undefined) cached = readStored();
  return cached;
};

export const getServerSnapshot = (): ConsentSnapshot => undefined;

export const setConsent = (choice: ConsentChoice): void => {
  const now = Date.now();
  const serialized = serializeConsent(choice, now);
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  cached = parseStoredConsent(serialized, now);
  // gtag is defined by the consent bootstrap script (Consent Mode update);
  // the dataLayer event is what GTM triggers listen for.
  window.gtag?.("consent", "update", toGoogleConsent(choice));
  sendGTMEvent({ event: CONSENT_UPDATE_DATALAYER_EVENT });
  notify();
};

export const openConsentPreferences = (): void => {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
};
