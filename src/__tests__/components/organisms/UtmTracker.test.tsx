import { render } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockTrackPageView } = vi.hoisted(() => ({
  mockTrackPageView: vi.fn(),
}));

vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({ trackPageView: mockTrackPageView }),
}));

import { UtmTracker } from "@/components/organisms/UtmTracker";

afterEach(() => {
  mockTrackPageView.mockReset();
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  );
});

describe("UtmTracker", () => {
  it("renders nothing", () => {
    const { container } = render(<UtmTracker />);

    expect(container).toBeEmptyDOMElement();
  });

  it("does not track when there are no UTM params", () => {
    render(<UtmTracker />);

    expect(mockTrackPageView).not.toHaveBeenCalled();
  });

  it("tracks the page view when UTM params are present", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("utm_source=pinterest") as ReturnType<
        typeof useSearchParams
      >,
    );

    render(<UtmTracker />);

    expect(mockTrackPageView).toHaveBeenCalledWith({
      utm_source: "pinterest",
    });
  });
});
