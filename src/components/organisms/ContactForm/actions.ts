"use server";

import { create } from "@/services/contactMessages";

import {
  EMAIL_INVALID_ERROR,
  MESSAGE_REQUIRED_ERROR,
  NAME_REQUIRED_ERROR,
} from "./constants";
import type { ContactFormFieldErrors, ContactFormState } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ContactFormFieldErrors = {};
  if (!name) errors.name = NAME_REQUIRED_ERROR;
  if (!EMAIL_PATTERN.test(email)) errors.email = EMAIL_INVALID_ERROR;
  if (!message) errors.message = MESSAGE_REQUIRED_ERROR;

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  await create({ name, email, message });
  return { status: "success" };
}
