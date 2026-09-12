import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@payload-config": fileURLToPath(
        new URL("./payload.config.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/__tests__/**",
        "src/**/index.ts",
        "src/**/constants.ts",
        "src/constants/**",
        "src/models/**",
        "src/theme/**",
        "src/app/\\(site\\)/layout.tsx",
        "src/app/\\(payload\\)/**",
        "src/blocks/**",
        "src/collections/**",
        "src/globals/**",
        "src/**/*.d.ts",
        "payload-types.ts",
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
