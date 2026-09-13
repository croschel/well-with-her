import { describe, expect, it } from "vitest";

import { appendUtmParams, parseUtmParams } from "@/utils/utm";

describe("parseUtmParams", () => {
  it("extracts only the recognized utm_* keys", () => {
    const searchParams = new URLSearchParams(
      "utm_source=pinterest&utm_medium=pin&other=ignored",
    );

    expect(parseUtmParams(searchParams)).toEqual({
      utm_source: "pinterest",
      utm_medium: "pin",
    });
  });

  it("returns an empty object when there are no UTM params", () => {
    expect(parseUtmParams(new URLSearchParams("foo=bar"))).toEqual({});
  });

  it("extracts all five recognized keys", () => {
    const searchParams = new URLSearchParams(
      "utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e",
    );

    expect(parseUtmParams(searchParams)).toEqual({
      utm_source: "a",
      utm_medium: "b",
      utm_campaign: "c",
      utm_term: "d",
      utm_content: "e",
    });
  });
});

describe("appendUtmParams", () => {
  it("returns the URL unchanged when there are no UTM params", () => {
    expect(appendUtmParams("https://example.com/shop", {})).toBe(
      "https://example.com/shop",
    );
  });

  it("appends UTM params onto a URL with no existing query string", () => {
    expect(
      appendUtmParams("https://example.com/shop", {
        utm_source: "pinterest",
        utm_medium: "pin",
      }),
    ).toBe("https://example.com/shop?utm_source=pinterest&utm_medium=pin");
  });

  it("merges UTM params onto a URL that already has a query string", () => {
    expect(
      appendUtmParams("https://example.com/shop?ref=abc", {
        utm_source: "pinterest",
      }),
    ).toBe("https://example.com/shop?ref=abc&utm_source=pinterest");
  });
});
