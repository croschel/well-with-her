import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockUseActionState } = vi.hoisted(() => ({
  mockUseActionState: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useActionState: mockUseActionState };
});

import { ContactForm } from "@/components/organisms/ContactForm";

const noopFormAction = vi.fn();

beforeEach(() => {
  mockUseActionState.mockReset();
  mockUseActionState.mockReturnValue([{ status: "idle" }, noopFormAction, false]);
});

describe("ContactForm", () => {
  it("renders the name, email, and message fields with a submit button", () => {
    render(<ContactForm />);

    expect(
      screen.getByLabelText("Name", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Email", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Message", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument();
  });

  it("disables the submit button and shows a pending label while submitting", () => {
    mockUseActionState.mockReturnValue([{ status: "idle" }, noopFormAction, true]);

    render(<ContactForm />);

    const button = screen.getByRole("button", { name: "Sending…" });
    expect(button).toBeDisabled();
  });

  it("shows field errors returned by the server action", () => {
    mockUseActionState.mockReturnValue([
      { status: "error", errors: { email: "Enter a valid email address." } },
      noopFormAction,
      false,
    ]);

    render(<ContactForm />);

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("shows the success card once the server action reports success", () => {
    mockUseActionState.mockReturnValue([{ status: "success" }, noopFormAction, false]);

    render(<ContactForm />);

    expect(screen.getByText("Thank you!")).toBeInTheDocument();
    expect(screen.getByText("We'll get back to you soon.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send message" }),
    ).not.toBeInTheDocument();
  });
});
