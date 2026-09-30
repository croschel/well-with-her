"use client";

import { Button, Link } from "@mui/material";
import { Suspense } from "react";

import { useUtmParams } from "@/hooks/useUtmParams";
import { appendUtmParams } from "@/utils/utm";

export interface BuyButtonProps {
  label: string;
  href: string;
  // Everything below is optional and defaults to the original look/behavior,
  // so the end-of-article buy button (which passes none of it) is unchanged.
  variant?: "button" | "link";
  backgroundColor?: string | null;
  textColor?: string | null;
  size?: "small" | "medium" | "large";
  openInNewTab?: boolean;
  sponsored?: boolean;
}

// External destination (the shop/affiliate link), so this is a plain <a>,
// not NextLink — Next's Link is for internal client-side navigation.
const renderButton = (
  label: string,
  href: string,
  {
    variant = "button",
    backgroundColor,
    textColor,
    size = "medium",
    openInNewTab = true,
    sponsored = true,
  }: Omit<BuyButtonProps, "label" | "href">,
) => {
  const linkProps = {
    href,
    target: openInNewTab ? "_blank" : undefined,
    rel: ["noopener", sponsored && "sponsored"].filter(Boolean).join(" "),
  };

  if (variant === "link") {
    return (
      <Link {...linkProps} sx={textColor ? { color: textColor } : undefined}>
        {label}
      </Link>
    );
  }

  return (
    <Button
      component="a"
      {...linkProps}
      variant="contained"
      color="primary"
      size={size}
      sx={{
        ...(backgroundColor && {
          backgroundColor,
          "&:hover": { backgroundColor, filter: "brightness(0.92)" },
        }),
        ...(textColor && { color: textColor }),
      }}
    >
      {label}
    </Button>
  );
};

const BuyButtonLink = ({ label, href, ...style }: BuyButtonProps) => {
  const utmParams = useUtmParams();
  return renderButton(label, appendUtmParams(href, utmParams), style);
};

// `useSearchParams` (inside useUtmParams) requires a Suspense boundary for
// static generation to keep working — wrapped here so callers don't need
// to think about it. The fallback renders the plain, un-decorated link;
// in practice this resolves in the same tick, so it's never visibly shown.
export const BuyButton = ({ label, href, ...style }: BuyButtonProps) => (
  <Suspense fallback={renderButton(label, href, style)}>
    <BuyButtonLink label={label} href={href} {...style} />
  </Suspense>
);
