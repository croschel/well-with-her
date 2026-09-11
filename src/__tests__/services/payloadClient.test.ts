import { describe, expect, it, vi } from "vitest";

const { mockGetPayload } = vi.hoisted(() => ({
  mockGetPayload: vi.fn().mockResolvedValue({ mocked: true }),
}));

vi.mock("payload", () => ({
  getPayload: mockGetPayload,
}));

vi.mock("@payload-config", () => ({
  default: { mocked: "config" },
}));

import { getPayloadClient } from "@/services/payloadClient";

describe("getPayloadClient", () => {
  it("calls Payload's getPayload with the project's config", async () => {
    const result = await getPayloadClient();

    expect(mockGetPayload).toHaveBeenCalledWith({
      config: { mocked: "config" },
    });
    expect(result).toEqual({ mocked: true });
  });
});
