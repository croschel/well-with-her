import type { PayloadHandler } from "payload";

import { importImageFromUrl } from "@/services/importMedia";
import { buildArticleImportState } from "@/utils/buildArticleImportState";
import { sanitizeArticleHtml } from "@/utils/sanitizeArticleHtml";

// Authenticated admin-only endpoint (mounted at POST /api/articles/import-html
// via this collection's `endpoints` config): sanitize -> parse -> convert to
// real Lexical nodes -> download+reupload any images -> return the resulting
// richtext state for the admin UI to drop straight into mainArticleContent.
export const importArticleHtmlHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json?.().catch(() => null)) as { html?: unknown } | null;
  const html = typeof body?.html === "string" ? body.html : "";
  if (!html.trim()) {
    return Response.json({ error: "Missing html" }, { status: 400 });
  }

  try {
    const sanitized = sanitizeArticleHtml(html);
    const content = await buildArticleImportState(sanitized, importImageFromUrl);
    return Response.json({ content });
  } catch (error) {
    req.payload.logger.error({ err: error, msg: "HTML import failed" });
    return Response.json({ error: "Import failed" }, { status: 500 });
  }
};
