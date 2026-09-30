import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OPEN_CONSENT_EVENT } from "@/constants/consent";

type UseConsent = typeof import("@/hooks/useConsent").useConsent;

const loadHook = async (): Promise<UseConsent> => {
  vi.resetModules();
  return (await import("@/hooks/useConsent")).useConsent;
};

beforeEach(() => {
  localStorage.clear();
});

describe("useConsent", () => {
  it("starts undecided but ready on the client", async () => {
    const useConsent = await loadHook();
    const { result } = renderHook(() => useConsent());

    expect(result.current.isReady).toBe(true);
    expect(result.current.consent).toBeNull();
    expect(result.current.hasDecided).toBe(false);
  });

  it("is not ready during server rendering", async () => {
    const useConsent = await loadHook();
    let ready: boolean | undefined;
    const Probe = () => {
      ready = useConsent().isReady;
      return null;
    };

    renderToString(createElement(Probe));

    expect(ready).toBe(false);
  });

  it("acceptAll grants both categories", async () => {
    const useConsent = await loadHook();
    const { result } = renderHook(() => useConsent());

    act(() => result.current.acceptAll());

    expect(result.current.hasDecided).toBe(true);
    expect(result.current.consent).toMatchObject({
      analytics: true,
      advertising: true,
    });
  });

  it("rejectAll denies both categories but counts as a decision", async () => {
    const useConsent = await loadHook();
    const { result } = renderHook(() => useConsent());

    act(() => result.current.rejectAll());

    expect(result.current.hasDecided).toBe(true);
    expect(result.current.consent).toMatchObject({
      analytics: false,
      advertising: false,
    });
  });

  it("save stores a per-category choice", async () => {
    const useConsent = await loadHook();
    const { result } = renderHook(() => useConsent());

    act(() => result.current.save({ analytics: true, advertising: false }));

    expect(result.current.consent).toMatchObject({
      analytics: true,
      advertising: false,
    });
  });

  it("openPreferences dispatches the open event", async () => {
    const useConsent = await loadHook();
    const { result } = renderHook(() => useConsent());
    const handler = vi.fn();
    window.addEventListener(OPEN_CONSENT_EVENT, handler);

    result.current.openPreferences();

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_CONSENT_EVENT, handler);
  });
});
