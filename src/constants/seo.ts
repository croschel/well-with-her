// `||`, not `??` — a platform env var set to an empty string (e.g. a blank
// value entered in Vercel's dashboard) is `""`, not `undefined`, and `??`
// wouldn't fall back for it. `new URL("")` throws, taking the whole build
// down with a cryptic "Invalid URL" error instead of a working default.
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- deliberate: `||` also catches "", not just undefined
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const SITE_NAME = "WellWithHer";
export const ARTICLE_AUTHOR_NAME = "WellWithHer Editors";
export const DEFAULT_META_DESCRIPTION =
  "Wellness articles and stories from WellWithHer.";
export const ARTICLE_PAGE_TITLE = (title: string) => `${title} — ${SITE_NAME}`;
