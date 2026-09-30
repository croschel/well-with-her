import { Box } from "@mui/material";

import { BuyButton } from "@/components/atoms/BuyButton";

// Every styling field is optional: blocks saved before these fields existed
// have none of them and must keep rendering as the original primary button.
export interface CtaBlockFields {
  label: string;
  url: string;
  style?: "button" | "link" | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  alignment?: "left" | "center" | "right" | null;
  size?: "small" | "medium" | "large" | null;
  openInNewTab?: boolean | null;
  sponsored?: boolean | null;
}

export const CtaBlockRenderer = ({
  label,
  url,
  style,
  backgroundColor,
  textColor,
  alignment,
  size,
  openInNewTab,
  sponsored,
}: CtaBlockFields) => (
  <Box sx={{ my: 3, textAlign: alignment ?? "left" }}>
    <BuyButton
      label={label}
      href={url}
      variant={style ?? undefined}
      backgroundColor={backgroundColor}
      textColor={textColor}
      size={size ?? undefined}
      openInNewTab={openInNewTab ?? undefined}
      sponsored={sponsored ?? undefined}
    />
  </Box>
);
