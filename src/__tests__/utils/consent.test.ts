import { afterEach, describe, expect, it } from "vitest";

import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
} from "@/constants/consent";
import {
  buildConsentBootstrapScript,
  isGpcEnabled,
  parseStoredConsent,
  serializeConsent,
  toGoogleConsent,
} from "@/utils/consent";

const NOW = 1_800_000_000_000;

const stored = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    version: CONSENT_VERSION,
    analytics: true,
    advertising: false,
    decidedAt: NOW - 1000,
    ...overrides,
  });

describe("parseStoredConsent", () => {
  it("returns a valid, current choice", () => {
    expect(parseStoredConsent(stored(), NOW)).toEqual({
      version: CONSENT_VERSION,
      analytics: true,
      advertising: false,
      decidedAt: NOW - 1000,
    });
  });

  it("defaults `now` to the current time", () => {
    expect(
      parseStoredConsent(stored({ decidedAt: Date.now() })),
    ).not.toBeNull();
  });

  it("returns null for missing, malformed, or non-object values", () => {
    expect(parseStoredConsent(null, NOW)).toBeNull();
    expect(parseStoredConsent("", NOW)).toBeNull();
    expect(parseStoredConsent("{nope", NOW)).toBeNull();
    expect(parseStoredConsent("null", NOW)).toBeNull();
    expect(parseStoredConsent("42", NOW)).toBeNull();
  });

  it("returns null for a different version", () => {
    expect(
      parseStoredConsent(stored({ version: CONSENT_VERSION + 1 }), NOW),
    ).toBeNull();
  });

  it("returns null when a field has the wrong type", () => {
    expect(parseStoredConsent(stored({ analytics: "yes" }), NOW)).toBeNull();
    expect(parseStoredConsent(stored({ advertising: 1 }), NOW)).toBeNull();
    expect(parseStoredConsent(stored({ decidedAt: "x" }), NOW)).toBeNull();
  });

  it("expires after 12 months but not exactly at the limit", () => {
    expect(
      parseStoredConsent(
        stored({ decidedAt: NOW - CONSENT_MAX_AGE_MS }),
        NOW,
      ),
    ).not.toBeNull();
    expect(
      parseStoredConsent(
        stored({ decidedAt: NOW - CONSENT_MAX_AGE_MS - 1 }),
        NOW,
      ),
    ).toBeNull();
  });
});

describe("serializeConsent", () => {
  it("round-trips through parseStoredConsent", () => {
    const raw = serializeConsent({ analytics: false, advertising: true }, NOW);

    expect(parseStoredConsent(raw, NOW)).toEqual({
      version: CONSENT_VERSION,
      analytics: false,
      advertising: true,
      decidedAt: NOW,
    });
  });

  it("defaults `now` to the current time", () => {
    const before = Date.now();
    const { decidedAt } = JSON.parse(
      serializeConsent({ analytics: true, advertising: true }),
    );

    expect(decidedAt).toBeGreaterThanOrEqual(before);
  });
});

describe("toGoogleConsent", () => {
  it("maps analytics to analytics_storage only", () => {
    expect(toGoogleConsent({ analytics: true, advertising: false })).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("maps advertising to the three ad signals together", () => {
    expect(toGoogleConsent({ analytics: false, advertising: true })).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });
});

describe("isGpcEnabled", () => {
  afterEach(() => {
    delete (navigator as { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
  });

  it("is false when the browser does not send the signal", () => {
    expect(isGpcEnabled()).toBe(false);
  });

  it("is true only when navigator.globalPrivacyControl is true", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    });
    expect(isGpcEnabled()).toBe(true);

    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: false,
      configurable: true,
    });
    expect(isGpcEnabled()).toBe(false);
  });
});

describe("buildConsentBootstrapScript", () => {
  type Win = Window & { dataLayer?: unknown[]; gtag?: unknown };

  const run = () => {
    new Function(buildConsentBootstrapScript())();
    return ((window as Win).dataLayer ?? []).map((entry) =>
      Array.from(entry as ArrayLike<unknown>),
    );
  };

  afterEach(() => {
    localStorage.clear();
    delete (window as Win).dataLayer;
    delete (window as Win).gtag;
  });

  it("denies everything by default and redacts ad data, as arguments objects", () => {
    const entries = (() => {
      new Function(buildConsentBootstrapScript())();
      return (window as Win).dataLayer as unknown[];
    })();

    expect(Object.prototype.toString.call(entries[0])).toBe(
      "[object Arguments]",
    );
    expect(entries.map((e) => Array.from(e as ArrayLike<unknown>))).toEqual([
      [
        "consent",
        "default",
        {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500,
        },
      ],
      ["set", "ads_data_redaction", true],
      ["set", "url_passthrough", false],
    ]);
  });

  it("appends to an existing dataLayer instead of replacing it", () => {
    (window as Win).dataLayer = [{ event: "earlier" }];

    run();

    expect((window as Win).dataLayer?.[0]).toEqual({ event: "earlier" });
  });

  it("restores a valid stored choice synchronously after the default", () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      serializeConsent({ analytics: true, advertising: false }),
    );

    const entries = run();

    expect(entries).toHaveLength(4);
    expect(entries[3]).toEqual([
      "consent",
      "update",
      {
        ad_storage: "denied",
        analytics_storage: "granted",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
  });

  it("restores a fully granted choice", () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      serializeConsent({ analytics: true, advertising: true }),
    );

    expect(run()[3]?.[2]).toMatchObject({
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it.each([
    ["nothing stored", null],
    ["malformed JSON", "{nope"],
    ["a stale version", stored({ version: CONSENT_VERSION + 1 })],
    ["an expired choice", stored({ decidedAt: 0 })],
    ["wrong field types", stored({ analytics: "yes" })],
  ])("stays denied (no update) with %s", (_label, value) => {
    if (value !== null) localStorage.setItem(CONSENT_STORAGE_KEY, value);

    expect(run()).toHaveLength(3);
  });

  it("stays denied when localStorage throws", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => {
        throw new Error("blocked");
      },
    });

    try {
      expect(run()).toHaveLength(3);
    } finally {
      Object.defineProperty(window, "localStorage", original!);
    }
  });

  it("accepts and rejects the same values as parseStoredConsent", () => {
    for (const raw of [
      stored({ decidedAt: Date.now() }),
      stored({ decidedAt: Date.now() - CONSENT_MAX_AGE_MS - 1000 }),
    ]) {
      localStorage.setItem(CONSENT_STORAGE_KEY, raw);
      const restored = run().length === 4;
      expect(restored).toBe(parseStoredConsent(raw) !== null);
      delete (window as Win).dataLayer;
    }
  });
});
