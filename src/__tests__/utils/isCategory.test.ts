import { describe, expect, it } from "vitest";

import { Category } from "@/models/enums";
import { isCategory } from "@/utils/isCategory";

describe("isCategory", () => {
  it.each(Object.values(Category))("accepts %s", (value) => {
    expect(isCategory(value)).toBe(true);
  });

  it.each(["not-a-category", "", "Sleep", "wellness "])(
    "rejects %j",
    (value) => {
      expect(isCategory(value)).toBe(false);
    },
  );
});
