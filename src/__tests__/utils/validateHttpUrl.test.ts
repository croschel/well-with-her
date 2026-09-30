import { describe, expect, it } from "vitest";

import { validateHttpUrl } from "@/utils/validateHttpUrl";

describe("validateHttpUrl", () => {
  it.each(["https://example.com/shop", "http://example.com"])(
    "accepts %s",
    (value) => {
      expect(validateHttpUrl(value)).toBe(true);
    },
  );

  it.each([undefined, null, ""])("requires a value (%s)", (value) => {
    expect(validateHttpUrl(value)).toBe("Enter a URL.");
  });

  it.each(["javascript:alert(1)", "example.com", "ftp://example.com", "https://a b"])(
    "rejects %s",
    (value) => {
      expect(validateHttpUrl(value)).toBe(
        "Enter a full URL starting with http:// or https://.",
      );
    },
  );
});
