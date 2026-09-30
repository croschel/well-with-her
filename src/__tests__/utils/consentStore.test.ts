import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  OPEN_CONSENT_EVENT,
} from "@/constants/consent";

type Store = typeof import("@/utils/consentStore");
type Win = Window & { dataLayer?: unknown[] };

// The store keeps module-level state (cached snapshot, listeners), so each
// test gets a fresh copy of the module.
const loadStore = async (): Promise<Store> => {
  vi.resetModules();
  return import("@/utils/consentStore");
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  delete window.gtag;
  delete (window as Win).dataLayer;
});

describe("consentStore", () => {
  it("reports 'unknown' on the server snapshot", async () => {
    const store = await loadStore();

    expect(store.getServerSnapshot()).toBeUndefined();
  });

  it("reads null when nothing is stored, and caches the result", async () => {
    const store = await loadStore();
    const getItem = vi.spyOn(Storage.prototype, "getItem");

    expect(store.getSnapshot()).toBeNull();
    expect(store.getSnapshot()).toBeNull();
    expect(getItem).toHaveBeenCalledTimes(1);
  });

  it("reads a valid stored choice", async () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        analytics: true,
        advertising: false,
        decidedAt: Date.now(),
      }),
    );
    const store = await loadStore();

    expect(store.getSnapshot()).toMatchObject({
      analytics: true,
      advertising: false,
    });
  });

  it("treats blocked storage as undecided", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const store = await loadStore();

    expect(store.getSnapshot()).toBeNull();
  });

  it("setConsent persists, updates the snapshot, and notifies subscribers", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setConsent({ analytics: true, advertising: false });

    expect(store.getSnapshot()).toMatchObject({
      analytics: true,
      advertising: false,
    });
    expect(
      JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!),
    ).toMatchObject({ analytics: true, advertising: false });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setConsent pushes a Consent Mode update and the GTM trigger event", async () => {
    const store = await loadStore();
    window.gtag = vi.fn();

    store.setConsent({ analytics: false, advertising: true });

    expect(window.gtag).toHaveBeenCalledWith("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "denied",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    expect((window as Win).dataLayer).toContainEqual({
      event: "cookie_consent_update",
    });
  });

  it("setConsent still works when gtag is not defined", async () => {
    const store = await loadStore();

    expect(() =>
      store.setConsent({ analytics: true, advertising: true }),
    ).not.toThrow();
    expect((window as Win).dataLayer).toContainEqual({
      event: "cookie_consent_update",
    });
  });

  it("setConsent keeps the choice for this page view when storage is blocked", async () => {
    const store = await loadStore();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    store.setConsent({ analytics: true, advertising: true });

    expect(store.getSnapshot()).toMatchObject({ analytics: true });
  });

  it("re-reads and notifies when another tab changes the stored choice", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribe(listener);
    expect(store.getSnapshot()).toBeNull();

    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        analytics: true,
        advertising: true,
        decidedAt: Date.now(),
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: CONSENT_STORAGE_KEY }),
    );

    expect(store.getSnapshot()).toMatchObject({ analytics: true });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("ignores storage events for other keys", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribe(listener);

    window.dispatchEvent(new StorageEvent("storage", { key: "other" }));

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setConsent({ analytics: true, advertising: true });
    window.dispatchEvent(
      new StorageEvent("storage", { key: CONSENT_STORAGE_KEY }),
    );

    expect(listener).not.toHaveBeenCalled();
  });

  it("openConsentPreferences dispatches the open event", async () => {
    const store = await loadStore();
    const handler = vi.fn();
    window.addEventListener(OPEN_CONSENT_EVENT, handler);

    store.openConsentPreferences();

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_CONSENT_EVENT, handler);
  });
});
