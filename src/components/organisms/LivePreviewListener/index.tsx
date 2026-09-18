"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

import { SITE_URL } from "@/constants/seo";

// Renders nothing — only mounted on the article route while Next's Draft
// Mode is on (i.e. inside the admin's live-preview iframe, via
// app/(site)/api/draft). Payload's admin form posts a `window.postMessage`
// on every change; this listens for it and calls `router.refresh()`, which
// re-runs the page's server components against the latest draft data. Without
// it, the iframe only ever shows whatever was rendered on its first load.
export const LivePreviewListener = () => {
  const router = useRouter();

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={SITE_URL} />;
};
