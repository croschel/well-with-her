"use client";

import { useCallback } from "react";

import type { UtmParams } from "@/utils/utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
  }
}

export interface UseAnalyticsResult {
  trackPageView: (utmParams: UtmParams) => void;
}

// gtag/pintrk are only defined when AnalyticsScripts actually loaded them
// (i.e. the corresponding env var is set) — the `?.` calls are load-bearing,
// not defensive filler, on every environment without real IDs configured.
export const useAnalytics = (): UseAnalyticsResult => {
  const trackPageView = useCallback((utmParams: UtmParams) => {
    window.gtag?.("event", "page_view", utmParams);
    window.pintrk?.("track", "pagevisit", utmParams);
  }, []);

  return { trackPageView };
};
