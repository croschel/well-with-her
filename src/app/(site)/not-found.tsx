import { Button, Container, Stack, Typography } from "@mui/material";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { CATEGORY_LABELS } from "@/constants/category";
import {
  BROWSE_CATEGORIES_HEADING,
  HOME_LINK_LABEL,
  NOT_FOUND_HEADING,
  NOT_FOUND_SUBHEADING,
} from "@/constants/notFound";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";

const CATEGORIES = Object.values(Category);

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        {NOT_FOUND_HEADING}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {NOT_FOUND_SUBHEADING}
      </Typography>

      <Button
        component={NextLink}
        href={ROUTES.home}
        variant="contained"
        sx={{ mb: 6 }}
      >
        {HOME_LINK_LABEL}
      </Button>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", mb: 2 }}
      >
        {BROWSE_CATEGORIES_HEADING}
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        sx={{ justifyContent: "center", flexWrap: "wrap" }}
      >
        {CATEGORIES.map((category) => (
          <Stack
            key={category}
            component={NextLink}
            href={ROUTES.category(category)}
            spacing={0.5}
            sx={{
              alignItems: "center",
              color: "text.secondary",
              textDecoration: "none",
            }}
          >
            <CategoryIcon category={category} />
            <Typography variant="body2">{CATEGORY_LABELS[category]}</Typography>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
