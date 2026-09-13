export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "WellWithHer";
export const ARTICLE_AUTHOR_NAME = "WellWithHer Editors";
export const DEFAULT_META_DESCRIPTION =
  "Wellness articles and stories from WellWithHer.";
export const ARTICLE_PAGE_TITLE = (title: string) => `${title} — ${SITE_NAME}`;
