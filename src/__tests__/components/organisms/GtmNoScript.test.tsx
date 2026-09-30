import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL_GTM_ID === undefined) delete process.env.NEXT_PUBLIC_GTM_ID;
  else process.env.NEXT_PUBLIC_GTM_ID = ORIGINAL_GTM_ID;
});

describe("GtmNoScript", () => {
  it("renders nothing when NEXT_PUBLIC_GTM_ID is unset", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { GtmNoScript } = await import("@/components/organisms/GtmNoScript");

    const { container } = render(<GtmNoScript />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the hidden GTM iframe inside a noscript when configured", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123";
    const { GtmNoScript } = await import("@/components/organisms/GtmNoScript");

    // React's client renderer never mounts <noscript> children, so assert
    // on the server-rendered markup (what actually ships in the HTML).
    const html = renderToStaticMarkup(<GtmNoScript />);
    expect(html).toContain("<noscript>");
    expect(html).toContain("https://www.googletagmanager.com/ns.html?id=GTM-TEST123");
    expect(html).toContain("display:none;visibility:hidden");
  });
});
