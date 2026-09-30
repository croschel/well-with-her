import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConsentPreferencesDialog } from "@/components/molecules/ConsentPreferencesDialog";

const setup = (overrides = {}) => {
  const props = {
    open: true,
    initialChoice: { analytics: false, advertising: false },
    gpcEnabled: false,
    onSave: vi.fn(),
    onAcceptAll: vi.fn(),
    onRejectAll: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
  render(<ConsentPreferencesDialog {...props} />);
  return props;
};

describe("ConsentPreferencesDialog", () => {
  it("renders nothing when closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows a locked necessary row and two optional switches", () => {
    setup();

    expect(screen.getByRole("dialog", { name: "Cookie preferences" })).toBeVisible();
    expect(screen.getByRole("switch", { name: "Strictly necessary" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Strictly necessary" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Analytics" })).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "Advertising" })).not.toBeChecked();
  });

  it("links to the privacy policy", () => {
    setup();

    expect(
      screen.getByRole("link", { name: "Read our Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy-policy");
  });

  it("only mentions Global Privacy Control when it is enabled", () => {
    setup();
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("shows the GPC note when enabled", () => {
    setup({ gpcEnabled: true });

    expect(screen.getByRole("note")).toHaveTextContent(
      "Global Privacy Control",
    );
  });

  it("saves the per-category choice", async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.click(screen.getByRole("switch", { name: "Analytics" }));
    await user.click(screen.getByRole("button", { name: "Save choices" }));

    expect(props.onSave).toHaveBeenCalledWith({
      analytics: true,
      advertising: false,
    });
  });

  it("toggles advertising independently and can turn a category back off", async () => {
    const user = userEvent.setup();
    const props = setup({ initialChoice: { analytics: true, advertising: false } });

    await user.click(screen.getByRole("switch", { name: "Advertising" }));
    await user.click(screen.getByRole("switch", { name: "Analytics" }));
    await user.click(screen.getByRole("button", { name: "Save choices" }));

    expect(props.onSave).toHaveBeenCalledWith({
      analytics: false,
      advertising: true,
    });
  });

  it("calls onAcceptAll and onRejectAll", async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.click(screen.getByRole("button", { name: "Accept all" }));
    await user.click(screen.getByRole("button", { name: "Reject all" }));

    expect(props.onAcceptAll).toHaveBeenCalledTimes(1);
    expect(props.onRejectAll).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape", async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.keyboard("{Escape}");

    expect(props.onClose).toHaveBeenCalled();
  });
});
