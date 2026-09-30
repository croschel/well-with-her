import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAnalytics } from "@/hooks/useAnalytics";

afterEach(() => {
  delete (window as { dataLayer?: unknown }).dataLayer;
  delete window.gtag;
  delete window.pintrk;
});

describe("useAnalytics", () => {
  it("forwards UTM params to gtag and pintrk when both are present", () => {
    window.gtag = vi.fn();
    window.pintrk = vi.fn();
    const { result } = renderHook(() => useAnalytics());

    result.current.trackPageView({ utm_source: "pinterest" });

    expect(window.gtag).toHaveBeenCalledWith("event", "page_view", {
      utm_source: "pinterest",
    });
    expect(window.pintrk).toHaveBeenCalledWith("track", "pagevisit", {
      utm_source: "pinterest",
    });
  });

  it("does nothing when neither script has loaded", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(() => result.current.trackPageView({ utm_source: "pinterest" })).not.toThrow();
  });

  it("pushes a utm_page_view event onto the dataLayer for GTM", () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.trackPageView({ utm_source: "pinterest", utm_campaign: "x" });

    expect((window as { dataLayer?: unknown[] }).dataLayer).toContainEqual({
      event: "utm_page_view",
      utm_source: "pinterest",
      utm_campaign: "x",
    });
  });

  it("appends to an existing dataLayer instead of replacing it", () => {
    const existing = { event: "gtm.js" };
    (window as { dataLayer?: unknown[] }).dataLayer = [existing];
    const { result } = renderHook(() => useAnalytics());

    result.current.trackPageView({ utm_source: "pinterest" });

    const layer = (window as { dataLayer?: unknown[] }).dataLayer;
    expect(layer?.[0]).toBe(existing);
    expect(layer).toHaveLength(2);
  });
});
