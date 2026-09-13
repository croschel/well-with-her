import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// next/script's afterInteractive strategy inserts <script> tags via an
// effect tied to Next's client runtime, which isn't mounted in a bare
// RTL/jsdom test — it renders nothing here at all. Mock it down to a
// plain <script> so the id/content assertions below have something to
// query, the same workaround used for ContactForm's useActionState.
vi.mock("next/script", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ strategy, ...props }: ComponentProps<"script"> & { strategy?: string }) => (
    <script {...props} />
  ),
}));

const ORIGINAL_GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const ORIGINAL_PINTEREST_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = ORIGINAL_GA4_ID;
  process.env.NEXT_PUBLIC_PINTEREST_TAG_ID = ORIGINAL_PINTEREST_ID;
});

describe("AnalyticsScripts", () => {
  it("renders neither script when no IDs are configured", async () => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    delete process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
    const { AnalyticsScripts } = await import(
      "@/components/organisms/AnalyticsScripts"
    );

    const { container } = render(<AnalyticsScripts />);

    expect(container.querySelector("#ga4-init")).toBeNull();
    expect(container.querySelector("#pinterest-tag-init")).toBeNull();
  });

  it("renders the GA4 scripts when NEXT_PUBLIC_GA4_MEASUREMENT_ID is set", async () => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = "G-TEST123";
    delete process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
    const { AnalyticsScripts } = await import(
      "@/components/organisms/AnalyticsScripts"
    );

    const { container } = render(<AnalyticsScripts />);

    expect(container.querySelector("#ga4-init")?.textContent).toContain(
      "G-TEST123",
    );
    expect(container.querySelector("#pinterest-tag-init")).toBeNull();
  });

  it("renders the Pinterest tag script when NEXT_PUBLIC_PINTEREST_TAG_ID is set", async () => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    process.env.NEXT_PUBLIC_PINTEREST_TAG_ID = "1234567890";
    const { AnalyticsScripts } = await import(
      "@/components/organisms/AnalyticsScripts"
    );

    const { container } = render(<AnalyticsScripts />);

    expect(container.querySelector("#ga4-init")).toBeNull();
    expect(
      container.querySelector("#pinterest-tag-init")?.textContent,
    ).toContain("1234567890");
  });
});
