import sanitizeHtml from "sanitize-html";

// Only color, never layout — position/top/left/right/bottom/z-index/display
// would let a "highlighted phrase" become a full-page invisible click-hijack
// overlay. No font-family either: colors from the site's own palette are
// safe and useful; someone else's fonts undo the whole point of a
// consistent design system (see docs/implementation-plan.md's Ticket 14
// note for the full reasoning).
const ALLOWED_STYLE_PROPERTIES = ["color", "background-color"];

// A conservative color value: hex, rgb()/rgba(), or a plain CSS color
// keyword — never url(), calc(), var(), or anything else that could smuggle
// a resource reference or dynamic value through a "just a color" field.
const SAFE_COLOR_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\)|[a-z]+)$/i;

const sanitizeStyleAttribute = (styleValue: string): string => {
  const declarations = styleValue.split(";");
  const safeDeclarations: string[] = [];

  for (const declaration of declarations) {
    const [rawProperty, ...rawValueParts] = declaration.split(":");
    const property = rawProperty?.trim().toLowerCase();
    const value = rawValueParts.join(":").trim();
    if (!property || !value) continue;
    if (!ALLOWED_STYLE_PROPERTIES.includes(property)) continue;
    if (!SAFE_COLOR_VALUE.test(value)) continue;
    safeDeclarations.push(`${property}: ${value}`);
  }

  return safeDeclarations.join("; ");
};

export const sanitizeArticleHtml = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "strong",
      "b",
      "em",
      "i",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "br",
      "span",
      "img",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
      span: ["style"],
      p: ["style"],
      strong: ["style"],
      b: ["style"],
      em: ["style"],
      i: ["style"],
      li: ["style"],
      blockquote: ["style"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      "*": (tagName, attribs) => {
        if (!attribs.style) return { tagName, attribs };
        const cleanStyle = sanitizeStyleAttribute(attribs.style);
        const rest = { ...attribs };
        delete rest.style;
        return {
          tagName,
          attribs: cleanStyle ? { ...rest, style: cleanStyle } : rest,
        };
      },
    },
  });
