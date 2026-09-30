"use client";

import { useSyncExternalStore } from "react";

import type { ConsentChoice, StoredConsent } from "@/models/interfaces";
import {
  getServerSnapshot,
  getSnapshot,
  openConsentPreferences,
  setConsent,
  subscribe,
} from "@/utils/consentStore";

export interface UseConsentResult {
  // False on the server and during hydration; the banner waits for true.
  isReady: boolean;
  consent: StoredConsent | null;
  hasDecided: boolean;
  save: (choice: ConsentChoice) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPreferences: () => void;
}

const ACCEPT_ALL: ConsentChoice = { analytics: true, advertising: true };
const REJECT_ALL: ConsentChoice = { analytics: false, advertising: false };

export const useConsent = (): UseConsentResult => {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const consent = snapshot ?? null;

  return {
    isReady: snapshot !== undefined,
    consent,
    hasDecided: consent !== null,
    save: setConsent,
    acceptAll: () => setConsent(ACCEPT_ALL),
    rejectAll: () => setConsent(REJECT_ALL),
    openPreferences: openConsentPreferences,
  };
};
