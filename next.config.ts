import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required because this app has multiple root layouts ((site) and
  // (payload)) — Next can't compose a single global 404 from either one,
  // so a truly unmatched URL needs its own standalone document.
  experimental: {
    globalNotFound: true,
  },
};

export default withPayload(nextConfig);
