import { describe, expect, it } from "vitest";

import robots from "@/app/robots";

describe("robots", () => {
  it("allows all user agents except admin/api, and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });
});
