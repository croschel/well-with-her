import { describe, expect, it } from "vitest";

import { parseInlineStyleString } from "@/utils/parseInlineStyleString";

describe("parseInlineStyleString", () => {
  it("parses a single declaration", () => {
    expect(parseInlineStyleString("color:#8a9678")).toEqual({
      color: "#8a9678",
    });
  });

  it("parses multiple declarations and camelCases hyphenated properties", () => {
    expect(
      parseInlineStyleString("color:#8a9678;background-color:#fff"),
    ).toEqual({
      color: "#8a9678",
      backgroundColor: "#fff",
    });
  });

  it("tolerates a trailing semicolon and extra whitespace", () => {
    expect(parseInlineStyleString(" color : #8a9678 ; ")).toEqual({
      color: "#8a9678",
    });
  });

  it("skips empty declarations", () => {
    expect(parseInlineStyleString(";;color:#8a9678;;")).toEqual({
      color: "#8a9678",
    });
  });

  it("returns an empty object for an empty string", () => {
    expect(parseInlineStyleString("")).toEqual({});
  });
});
