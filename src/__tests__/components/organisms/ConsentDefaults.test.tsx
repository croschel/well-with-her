import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

// Same next/script -> plain <script> mock as AnalyticsScripts.test.tsx;
// strategy is surfaced as a data attribute so it can be asserted.
vi.mock("next/script", () => ({
  default: ({
    strategy,
    ...props
  }: ComponentProps<"script"> & { strategy?: string }) => (
    <script data-strategy={strategy} {...props} />
  ),
}));

import { ConsentDefaults } from "@/components/organisms/ConsentDefaults";
import { buildConsentBootstrapScript } from "@/utils/consent";

describe("ConsentDefaults", () => {
  it("renders the bootstrap script as beforeInteractive", () => {
    const { container } = render(<ConsentDefaults />);
    const script = container.querySelector("#consent-defaults");

    expect(script?.getAttribute("data-strategy")).toBe("beforeInteractive");
    expect(script?.textContent).toBe(buildConsentBootstrapScript());
  });
});
