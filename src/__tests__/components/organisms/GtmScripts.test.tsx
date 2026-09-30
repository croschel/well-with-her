import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The real GoogleTagManager renders next/script tags that don't appear in a
// bare jsdom render (see AnalyticsScripts.test.tsx); mock it to a marker.
vi.mock("@next/third-parties/google", () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => (
    <div data-testid="gtm" data-gtm-id={gtmId} />
  ),
}));

const ORIGINAL_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL_GTM_ID === undefined) delete process.env.NEXT_PUBLIC_GTM_ID;
  else process.env.NEXT_PUBLIC_GTM_ID = ORIGINAL_GTM_ID;
});

describe("GtmScripts", () => {
  it("renders nothing when NEXT_PUBLIC_GTM_ID is unset", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { GtmScripts } = await import("@/components/organisms/GtmScripts");

    const { container } = render(<GtmScripts />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders GoogleTagManager with the configured container ID", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123";
    const { GtmScripts } = await import("@/components/organisms/GtmScripts");

    const { getByTestId } = render(<GtmScripts />);

    expect(getByTestId("gtm").getAttribute("data-gtm-id")).toBe("GTM-TEST123");
  });
});
