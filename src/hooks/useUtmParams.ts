"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { parseUtmParams, type UtmParams } from "@/utils/utm";

export const useUtmParams = (): UtmParams => {
  const searchParams = useSearchParams();
  return useMemo(() => parseUtmParams(searchParams), [searchParams]);
};
