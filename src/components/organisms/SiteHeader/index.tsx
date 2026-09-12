"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

import { CategoryIcon } from "@/components/atoms/CategoryIcon";
import { NextLink } from "@/components/atoms/NextLink";
import { NavSearch } from "@/components/organisms/NavSearch";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";

import { LOGO_ARIA_LABEL, NAV_ARIA_LABEL, SITE_NAME } from "./constants";

const CATEGORIES = Object.values(Category);

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Stack sx={{ py: 2, gap: 1.5 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              component={NextLink}
              href={ROUTES.home}
              aria-label={LOGO_ARIA_LABEL}
              variant="h5"
              sx={{ color: "text.primary", textDecoration: "none" }}
            >
              {SITE_NAME}
            </Typography>

            <NavSearch />
          </Stack>

          <Stack
            component="nav"
            aria-label={NAV_ARIA_LABEL}
            direction="row"
            spacing={3}
            sx={{ overflowX: "auto" }}
          >
            {CATEGORIES.map((category) => {
              const isActive = pathname === ROUTES.category(category);
              return (
                <Stack
                  key={category}
                  component={NextLink}
                  href={ROUTES.category(category)}
                  aria-current={isActive ? "page" : undefined}
                  direction="row"
                  spacing={0.5}
                  sx={{
                    alignItems: "center",
                    flexShrink: 0,
                    textDecoration: "none",
                    color: isActive ? "primary.main" : "text.secondary",
                    borderBottom: "2px solid",
                    borderColor: isActive ? "primary.main" : "transparent",
                    pb: 0.5,
                  }}
                >
                  <CategoryIcon category={category} fontSize="small" />
                  <Typography
                    component="span"
                    variant="button"
                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                  >
                    {CATEGORY_LABELS[category]}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
