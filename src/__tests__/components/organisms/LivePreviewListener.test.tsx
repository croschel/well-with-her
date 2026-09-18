import { render } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ refresh: mockRefresh })),
}));

import { LivePreviewListener } from "@/components/organisms/LivePreviewListener";

afterEach(() => {
  mockRefresh.mockReset();
});

describe("LivePreviewListener", () => {
  it("renders nothing", () => {
    const { container } = render(<LivePreviewListener />);

    expect(container).toBeEmptyDOMElement();
  });

  it("refreshes the route on mount, before any save message arrives", () => {
    render(<LivePreviewListener />);

    expect(useRouter).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });
});
