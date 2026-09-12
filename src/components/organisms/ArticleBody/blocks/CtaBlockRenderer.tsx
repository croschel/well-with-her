import { Box } from "@mui/material";

import { BuyButton } from "@/components/atoms/BuyButton";

export interface CtaBlockFields {
  label: string;
  url: string;
}

export const CtaBlockRenderer = ({ label, url }: CtaBlockFields) => (
  <Box sx={{ my: 3 }}>
    <BuyButton label={label} href={url} />
  </Box>
);
