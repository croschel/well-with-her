import type { CSSProperties } from "react";

const toCamelCase = (property: string): string =>
  property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

// Converts a CSS text string ("color:#8a9678;background-color:#fff") into a
// React style object. Safe to use even on an untrusted string — React sets
// each property individually via the DOM style API, it never injects a raw
// string — but this only ever receives values that already passed through
// sanitizeArticleHtml's allowlist in practice.
export const parseInlineStyleString = (styleText: string): CSSProperties => {
  const result: Record<string, string> = {};

  for (const declaration of styleText.split(";")) {
    const [rawProperty, ...rawValueParts] = declaration.split(":");
    const property = rawProperty?.trim();
    const value = rawValueParts.join(":").trim();
    if (!property || !value) continue;
    result[toCamelCase(property)] = value;
  }

  return result as CSSProperties;
};
