"use client";

// Next 16 + MUI: passing next/link directly to a MUI `component` prop from
// a Server Component throws "Functions cannot be passed directly to Client
// Components." A 'use client' re-export fixes it — use this everywhere
// instead of importing next/link directly.
export { default as NextLink } from "next/link";
