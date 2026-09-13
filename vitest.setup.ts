import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Testing Library's own auto-cleanup relies on detecting a *global*
// afterEach (Jest-style). Since vitest.config.ts runs with globals: false,
// it never registers — without this, DOM from one test leaks into the
// next test in the same file.
afterEach(() => {
  cleanup();
});

// BuyButton (and anything that renders it) calls useSearchParams via
// useUtmParams. A test file with its own `vi.mock("next/navigation", ...)`
// replaces this default entirely — extend its factory with
// useSearchParams too rather than relying on this one.
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));
