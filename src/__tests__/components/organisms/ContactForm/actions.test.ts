import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock("@/services/contactMessages", () => ({
  create: mockCreate,
}));

import { submitContactForm } from "@/components/organisms/ContactForm/actions";
import type { ContactFormState } from "@/components/organisms/ContactForm/types";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const buildFormData = (fields: Record<string, string>): FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
};

beforeEach(() => {
  mockCreate.mockReset();
});

describe("submitContactForm", () => {
  it("creates the contact message and returns success for valid input", async () => {
    mockCreate.mockResolvedValue(undefined);

    const result = await submitContactForm(
      INITIAL_STATE,
      buildFormData({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Hello there.",
      }),
    );

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there.",
    });
    expect(result).toEqual({ status: "success" });
  });

  it("trims whitespace before validating and saving", async () => {
    mockCreate.mockResolvedValue(undefined);

    await submitContactForm(
      INITIAL_STATE,
      buildFormData({
        name: "  Jane Doe  ",
        email: "  jane@example.com  ",
        message: "  Hello there.  ",
      }),
    );

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there.",
    });
  });

  it("returns a field error and does not save when name is missing", async () => {
    const result = await submitContactForm(
      INITIAL_STATE,
      buildFormData({ name: "", email: "jane@example.com", message: "Hi" }),
    );

    expect(result).toEqual({
      status: "error",
      errors: { name: "Enter your name." },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns a field error when the email is invalid", async () => {
    const result = await submitContactForm(
      INITIAL_STATE,
      buildFormData({ name: "Jane", email: "not-an-email", message: "Hi" }),
    );

    expect(result).toEqual({
      status: "error",
      errors: { email: "Enter a valid email address." },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns a field error when the message is missing", async () => {
    const result = await submitContactForm(
      INITIAL_STATE,
      buildFormData({ name: "Jane", email: "jane@example.com", message: "" }),
    );

    expect(result).toEqual({
      status: "error",
      errors: { message: "Enter a message." },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("treats entirely missing fields the same as empty ones", async () => {
    // No fields set at all, as opposed to set-but-empty.
    const result = await submitContactForm(INITIAL_STATE, new FormData());

    expect(result).toEqual({
      status: "error",
      errors: {
        name: "Enter your name.",
        email: "Enter a valid email address.",
        message: "Enter a message.",
      },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns all applicable field errors at once", async () => {
    const result = await submitContactForm(
      INITIAL_STATE,
      buildFormData({ name: "", email: "", message: "" }),
    );

    expect(result).toEqual({
      status: "error",
      errors: {
        name: "Enter your name.",
        email: "Enter a valid email address.",
        message: "Enter a message.",
      },
    });
  });
});
