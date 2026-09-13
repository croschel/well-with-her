export interface ContactFormFieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormState {
  status: "idle" | "success" | "error";
  errors?: ContactFormFieldErrors;
}
