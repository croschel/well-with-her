import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CookieSettingsLink } from "@/components/atoms/CookieSettingsLink";
import { OPEN_CONSENT_EVENT } from "@/constants/consent";

describe("CookieSettingsLink", () => {
  it("renders a button that reopens the consent preferences", async () => {
    const handler = vi.fn();
    window.addEventListener(OPEN_CONSENT_EVENT, handler);
    render(<CookieSettingsLink />);

    await userEvent.click(
      screen.getByRole("button", { name: "Cookie settings" }),
    );

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_CONSENT_EVENT, handler);
  });
});
