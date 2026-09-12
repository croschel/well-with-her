import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library's own auto-cleanup relies on detecting a *global*
// afterEach (Jest-style). Since vitest.config.ts runs with globals: false,
// it never registers — without this, DOM from one test leaks into the
// next test in the same file.
afterEach(() => {
  cleanup();
});
