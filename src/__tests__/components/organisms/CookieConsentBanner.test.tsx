import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "@/constants/consent";

// The consent store keeps module-level state, so every test loads fresh
// copies of the store and the banner together.
const loadBanner = async () => {
  vi.resetModules();
  const { CookieConsentBanner } = await import(
    "@/components/organisms/CookieConsentBanner"
  );
  const { openConsentPreferences } = await import("@/utils/consentStore");
  return { CookieConsentBanner, openConsentPreferences };
};

const storeChoice = (analytics: boolean, advertising: boolean) =>
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      version: CONSENT_VERSION,
      analytics,
      advertising,
      decidedAt: Date.now(),
    }),
  );

beforeEach(() => {
  localStorage.clear();
  delete window.gtag;
});

describe("CookieConsentBanner", () => {
  it("renders nothing during server rendering", async () => {
    const { CookieConsentBanner } = await loadBanner();

    expect(renderToString(createElement(CookieConsentBanner))).toBe("");
  });

  it("shows a labelled region with Accept all, Reject all, and Customize when undecided", async () => {
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    const region = screen.getByRole("region", { name: "Cookie consent" });
    expect(region).toBeVisible();
    expect(screen.getByRole("button", { name: "Accept all" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Reject all" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Customize" })).toBeVisible();
  });

  it("stays hidden once a choice is stored", async () => {
    storeChoice(true, false);
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });

  it("Accept all stores a full grant and hides the banner", async () => {
    const user = userEvent.setup();
    window.gtag = vi.fn();
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Accept all" }));

    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({
        analytics_storage: "granted",
        ad_storage: "granted",
      }),
    );
  });

  it("Reject all stores a full denial and hides the banner", async () => {
    const user = userEvent.setup();
    window.gtag = vi.fn();
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Reject all" }));

    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
    expect(window.gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({
        analytics_storage: "denied",
        ad_storage: "denied",
      }),
    );
  });

  it("Customize opens the dialog, hides the card, and Save stores the choice", async () => {
    const user = userEvent.setup();
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Customize" }));

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();

    await user.click(screen.getByRole("switch", { name: "Analytics" }));
    await user.click(screen.getByRole("button", { name: "Save choices" }));

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject(
      { analytics: true, advertising: false },
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closing the dialog without choosing brings the card back", async () => {
    const user = userEvent.setup();
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Customize" }));
    await user.keyboard("{Escape}");

    expect(
      await screen.findByRole("region", { name: "Cookie consent" }),
    ).toBeVisible();
  });

  it("the open event reopens the dialog with the stored choice after a decision", async () => {
    storeChoice(true, false);
    const { CookieConsentBanner, openConsentPreferences } = await loadBanner();
    render(<CookieConsentBanner />);

    act(() => openConsentPreferences());

    expect(await screen.findByRole("dialog")).toBeVisible();
    expect(screen.getByRole("switch", { name: "Analytics" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Advertising" })).not.toBeChecked();
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });

  it("Accept all inside the dialog closes it", async () => {
    storeChoice(false, false);
    const user = userEvent.setup();
    const { CookieConsentBanner, openConsentPreferences } = await loadBanner();
    render(<CookieConsentBanner />);

    act(() => openConsentPreferences());
    await user.click(await screen.findByRole("button", { name: "Accept all" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject(
      { analytics: true, advertising: true },
    );
  });

  it("notes Global Privacy Control in the dialog when the browser sends it", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    });
    const { CookieConsentBanner } = await loadBanner();
    render(<CookieConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Customize" }));

    expect(screen.getByRole("note")).toHaveTextContent("Global Privacy Control");
    expect(screen.getByRole("switch", { name: "Advertising" })).not.toBeChecked();
    delete (navigator as { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
  });
});
