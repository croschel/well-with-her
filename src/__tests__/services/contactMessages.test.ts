import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/payloadClient", () => ({
  getPayloadClient: vi.fn(),
}));

import * as contactMessages from "@/services/contactMessages";
import { getPayloadClient } from "@/services/payloadClient";

const mockCreate = vi.fn();

beforeEach(() => {
  mockCreate.mockReset();
  vi.mocked(getPayloadClient).mockResolvedValue({
    create: mockCreate,
  } as unknown as Awaited<ReturnType<typeof getPayloadClient>>);
});

describe("create", () => {
  it("creates a contact-messages document with the given fields", async () => {
    mockCreate.mockResolvedValue({});

    await contactMessages.create({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there.",
    });

    expect(mockCreate).toHaveBeenCalledWith({
      collection: "contact-messages",
      data: {
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Hello there.",
      },
    });
  });
});
