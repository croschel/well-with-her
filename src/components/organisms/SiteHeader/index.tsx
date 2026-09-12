"use client";

import { Box, Stack, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/atoms/LogoMark";
import { NextLink } from "@/components/atoms/NextLink";
import { NavSearch } from "@/components/organisms/NavSearch";
import { CATEGORY_LABELS } from "@/constants/category";
import { ROUTES } from "@/constants/routes";
import { Category } from "@/models/enums";

import { LOGO_ARIA_LABEL, NAV_ARIA_LABEL, SITE_NAME } from "./constants";

const CATEGORIES = Object.values(Category);

export const SiteHeader = () => {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.home;

  return (
    <Stack
      component="header"
      direction="row"
      spacing={2}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        bgcolor: "rgba(248, 242, 234, 0.93)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 5,
        py: 2.25,
      }}
    >
      <Stack
        component={NextLink}
        href={ROUTES.home}
        aria-label={LOGO_ARIA_LABEL}
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          textDecoration: "none",
          color: "text.primary",
        }}
      >
        <LogoMark showAccent />
        <Typography component="span" variant="h5" color="text.primary">
          {SITE_NAME}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={3}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        {isHome ? null : (
          <Stack
            component="nav"
            aria-label={NAV_ARIA_LABEL}
            direction="row"
            spacing={3}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            {CATEGORIES.map((category) => {
              const isActive = pathname === ROUTES.category(category);
              return (
                <Typography
                  key={category}
                  component={NextLink}
                  href={ROUTES.category(category)}
                  aria-current={isActive ? "page" : undefined}
                  variant="button"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    textDecoration: "none",
                    color: isActive ? "text.primary" : "text.secondary",
                    borderBottom: "1px solid",
                    borderColor: isActive ? "primary.main" : "transparent",
                    pb: 0.5,
                  }}
                >
                  {CATEGORY_LABELS[category]}
                </Typography>
              );
            })}
            <Box sx={{ width: "1px", height: 16, bgcolor: "divider" }} />
          </Stack>
        )}
        <NavSearch />
      </Stack>
    </Stack>
  );
};
