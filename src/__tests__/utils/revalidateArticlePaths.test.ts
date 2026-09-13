import { revalidatePath } from "next/cache";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidateArticlePaths } from "@/utils/revalidateArticlePaths";

describe("revalidateArticlePaths", () => {
  it("revalidates the article, its category, and home", () => {
    revalidateArticlePaths({
      category: "sleep",
      pinId: "pin002",
      slug: "wind-down-routine",
    });

    expect(revalidatePath).toHaveBeenCalledWith(
      "/sleep/pin002/wind-down-routine",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/sleep");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("swallows errors thrown outside a Next.js request context", () => {
    vi.mocked(revalidatePath).mockImplementationOnce(() => {
      throw new Error("Invariant: static generation store missing");
    });

    expect(() =>
      revalidateArticlePaths({
        category: "sleep",
        pinId: "pin002",
        slug: "wind-down-routine",
      }),
    ).not.toThrow();
  });
});
