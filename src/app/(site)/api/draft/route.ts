import { draftMode, headers } from "next/headers";
import { NextResponse } from "next/server";

import { ROUTES } from "@/constants/routes";
import { getPayloadClient } from "@/services/payloadClient";
import { isCategory } from "@/utils/isCategory";

// Entry point for the admin's live-preview iframe (see Articles.ts's
// `admin.livePreview.url`). Payload's live-preview iframe otherwise just
// loads the public article URL, which is statically cached and filtered to
// published-only content — indistinguishable from what a random visitor
// sees. Enabling Next's Draft Mode here forces that one browser session to
// render the article route dynamically, and `getByRoute` (services/articles)
// reads it with the draft flag on once Draft Mode is enabled.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const pinId = searchParams.get("pinId") ?? "";
  const slug = searchParams.get("slug") ?? "";

  if (!isCategory(category) || !pinId || !slug) {
    return NextResponse.json({ message: "Missing or invalid params." }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  (await draftMode()).enable();

  return NextResponse.redirect(
    new URL(ROUTES.article({ category, pinId, slug }), request.url),
  );
}
