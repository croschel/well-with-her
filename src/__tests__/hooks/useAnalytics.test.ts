import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAnalytics } from "@/hooks/useAnalytics";

afterEach(() => {
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
});
