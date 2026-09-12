"use client";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

import { SEARCH_PLACEHOLDER, SEARCH_TOGGLE_LABEL } from "./constants";

// UI-only for now, per Ticket 3's scope ("search affordance"). This becomes
// the project's one TanStack Query consumer (§6) once search actually
// queries the articles service — not part of this ticket.
export const NavSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <IconButton
        aria-label={SEARCH_TOGGLE_LABEL}
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon />
      </IconButton>
    );
  }

  return (
    <TextField
      autoFocus
      size="small"
      placeholder={SEARCH_PLACEHOLDER}
      onBlur={() => setIsOpen(false)}
      slotProps={{
        htmlInput: { "aria-label": SEARCH_TOGGLE_LABEL },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
