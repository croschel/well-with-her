import { Button } from "@mui/material";

export interface BuyButtonProps {
  label: string;
  href: string;
}

// External destination (the shop/affiliate link), so this is a plain <a>,
// not NextLink — Next's Link is for internal client-side navigation.
export const BuyButton = ({ label, href }: BuyButtonProps) => (
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
