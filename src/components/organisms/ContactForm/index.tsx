"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useActionState } from "react";

import { BODY_TEXT_COLOR } from "@/theme/palette";

import { submitContactForm } from "./actions";
import {
  EMAIL_LABEL,
  MESSAGE_LABEL,
  NAME_LABEL,
  SUBMIT_LABEL,
  SUBMIT_PENDING_LABEL,
  SUCCESS_MESSAGE,
  SUCCESS_TITLE,
} from "./constants";
import type { ContactFormState } from "./types";

const INITIAL_STATE: ContactFormState = { status: "idle" };

export const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          p: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-playfair-display), serif",
            fontWeight: 600,
            fontSize: 20,
            mb: 1,
          }}
        >
          {SUCCESS_TITLE}
        </Typography>
        <Typography sx={{ color: BODY_TEXT_COLOR }}>{SUCCESS_MESSAGE}</Typography>
      </Box>
    );
  }

  return (
    <Stack component="form" action={formAction} spacing={2.5}>
      <TextField
        name="name"
        label={NAME_LABEL}
        required
        error={Boolean(state.errors?.name)}
        helperText={state.errors?.name}
      />
      <TextField
        name="email"
        type="email"
        label={EMAIL_LABEL}
        required
        error={Boolean(state.errors?.email)}
        helperText={state.errors?.email}
      />
      <TextField
        name="message"
        label={MESSAGE_LABEL}
        required
        multiline
        rows={5}
        error={Boolean(state.errors?.message)}
        helperText={state.errors?.message}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isPending}
        sx={{ alignSelf: "flex-start" }}
      >
        {isPending ? SUBMIT_PENDING_LABEL : SUBMIT_LABEL}
      </Button>
    </Stack>
  );
};
