import { describe, expect, it, vi } from "vitest";

const enable = vi.fn();
const auth = vi.fn();

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ enable })),
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/services/payloadClient", () => ({
  getPayloadClient: vi.fn(async () => ({ auth })),
}));

import { GET } from "@/app/(site)/api/draft/route";

const buildRequest = (params: Record<string, string>): Request =>
  new Request(`http://localhost:3000/api/draft?${new URLSearchParams(params)}`);

describe("GET /api/draft", () => {
  it("rejects a request missing required params", async () => {
    const response = await GET(buildRequest({ category: "sleep", pinId: "pin002" }));

    expect(response.status).toBe(400);
    expect(auth).not.toHaveBeenCalled();
  });

  it("rejects a request with an unrecognized category", async () => {
    const response = await GET(
      buildRequest({ category: "not-a-category", pinId: "pin002", slug: "wind-down" }),
    );

    expect(response.status).toBe(400);
  });

  it("rejects an unauthenticated request", async () => {
    auth.mockResolvedValueOnce({ user: null });

    const response = await GET(
      buildRequest({ category: "sleep", pinId: "pin002", slug: "wind-down" }),
    );

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects to the article for an authenticated user", async () => {
    auth.mockResolvedValueOnce({ user: { id: "1" } });

    const response = await GET(
      buildRequest({ category: "sleep", pinId: "pin002", slug: "wind-down" }),
    );

    expect(enable).toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/sleep/pin002/wind-down",
    );
  });
});
