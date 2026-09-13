"use client";

import { useEffect } from "react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useUtmParams } from "@/hooks/useUtmParams";

// Renders nothing — forwards a Pinterest visitor's UTM params to GA4/the
// Pinterest tag on landing, per plan §1: "UTM parameters are captured
// client-side and forwarded to analytics only — they never influence
// routing or rendering."
export const UtmTracker = () => {
  const utmParams = useUtmParams();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (Object.keys(utmParams).length === 0) return;
    trackPageView(utmParams);
  }, [utmParams, trackPageView]);

  return null;
};
