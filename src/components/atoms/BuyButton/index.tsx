"use client";

import { Button } from "@mui/material";
import { Suspense } from "react";

import { useUtmParams } from "@/hooks/useUtmParams";
import { appendUtmParams } from "@/utils/utm";

export interface BuyButtonProps {
  label: string;
  href: string;
}

// External destination (the shop/affiliate link), so this is a plain <a>,
// not NextLink — Next's Link is for internal client-side navigation.
const renderButton = (label: string, href: string) => (
  <Button
    component="a"
    href={href}
    target="_blank"
    rel="noopener sponsored"
    variant="contained"
    color="primary"
  >
    {label}
  </Button>
);

const BuyButtonLink = ({ label, href }: BuyButtonProps) => {
  const utmParams = useUtmParams();
  return renderButton(label, appendUtmParams(href, utmParams));
};

// `useSearchParams` (inside useUtmParams) requires a Suspense boundary for
// static generation to keep working — wrapped here so callers don't need
// to think about it. The fallback renders the plain, un-decorated link;
// in practice this resolves in the same tick, so it's never visibly shown.
export const BuyButton = ({ label, href }: BuyButtonProps) => (
  <Suspense fallback={renderButton(label, href)}>
    <BuyButtonLink label={label} href={href} />
  </Suspense>
);
