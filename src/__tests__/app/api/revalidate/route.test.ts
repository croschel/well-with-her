import { revalidatePath } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { POST } from "@/app/api/revalidate/route";

const buildRequest = (
  body: unknown,
  headers: Record<string, string> = {},
): Request =>
  new Request("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

const ORIGINAL_SECRET = process.env.REVALIDATE_SECRET;

beforeEach(() => {
  vi.mocked(revalidatePath).mockReset();
  process.env.REVALIDATE_SECRET = "test-secret";
});

afterEach(() => {
  process.env.REVALIDATE_SECRET = ORIGINAL_SECRET;
});

describe("POST /api/revalidate", () => {
  it("rejects a request with no secret header", async () => {
    const response = await POST(buildRequest({ path: "/sleep" }));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a request with the wrong secret", async () => {
    const response = await POST(
      buildRequest({ path: "/sleep" }, { "x-revalidate-secret": "wrong" }),
    );

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects the request when REVALIDATE_SECRET isn't configured server-side", async () => {
    process.env.REVALIDATE_SECRET = "";

    const response = await POST(
      buildRequest({ path: "/sleep" }, { "x-revalidate-secret": "" }),
    );

    expect(response.status).toBe(401);
  });

  it("rejects a request with an unparseable JSON body", async () => {
    const request = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": "test-secret" },
      body: "not json",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a request with no path", async () => {
    const response = await POST(
      buildRequest({}, { "x-revalidate-secret": "test-secret" }),
    );

    expect(response.status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates the given path with a valid secret", async () => {
    const response = await POST(
      buildRequest(
        { path: "/sleep/pin002/wind-down-routine" },
        { "x-revalidate-secret": "test-secret" },
      ),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith(
      "/sleep/pin002/wind-down-routine",
    );
    expect(json).toMatchObject({
      revalidated: true,
      path: "/sleep/pin002/wind-down-routine",
    });
  });
});
