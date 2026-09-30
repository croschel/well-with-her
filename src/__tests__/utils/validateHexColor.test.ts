import { describe, expect, it } from "vitest";

import { validateHexColor } from "@/utils/validateHexColor";

describe("validateHexColor", () => {
  it.each(["#fff", "#C2185B", "#c2185b"])("accepts %s", (value) => {
    expect(validateHexColor(value)).toBe(true);
  });

  it.each([undefined, null, ""])("treats an empty value (%s) as valid", (value) => {
    expect(validateHexColor(value)).toBe(true);
  });

  it.each(["C2185B", "#12", "#GGGGGG", "red", "#1234567"])(
    "rejects %s",
    (value) => {
      expect(validateHexColor(value)).toBe("Enter a hex color like #C2185B.");
    },
  );
});
