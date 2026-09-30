"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useId, useState } from "react";

import { NextLink } from "@/components/atoms/NextLink";
import { ROUTES } from "@/constants/routes";
import type { ConsentChoice } from "@/models/interfaces";

import {
  ACCEPT_ALL_LABEL,
  ADVERTISING_DESCRIPTION,
  ADVERTISING_LABEL,
  ANALYTICS_DESCRIPTION,
  ANALYTICS_LABEL,
  DIALOG_INTRO,
  DIALOG_TITLE,
  GPC_NOTE,
  NECESSARY_DESCRIPTION,
  NECESSARY_LABEL,
  PRIVACY_POLICY_LINK_LABEL,
  REJECT_ALL_LABEL,
  SAVE_LABEL,
} from "./constants";

export interface ConsentPreferencesDialogProps {
  open: boolean;
  // Starting position of the switches (the stored choice, or all off).
  initialChoice: ConsentChoice;
  gpcEnabled: boolean;
  onSave: (choice: ConsentChoice) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleRow = ({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: ToggleRowProps) => {
  const labelId = useId();
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Stack sx={{ flex: 1 }}>
        <Typography id={labelId} variant="subtitle2">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        slotProps={{ input: { "aria-labelledby": labelId } }}
      />
    </Stack>
  );
};

// Mounted only while the dialog is open (MUI unmounts closed Dialog
// children), so the switch state always restarts from `initialChoice`.
const PreferencesBody = ({
  initialChoice,
  gpcEnabled,
  onSave,
  onAcceptAll,
  onRejectAll,
}: Omit<ConsentPreferencesDialogProps, "open" | "onClose">) => {
  const [choice, setChoice] = useState(initialChoice);

  return (
    <>
      <DialogContent>
        <Stack spacing={2.5}>
          <Typography variant="body2">{DIALOG_INTRO}</Typography>
          {gpcEnabled ? (
            <Typography variant="body2" color="text.secondary" role="note">
              {GPC_NOTE}
            </Typography>
          ) : null}
          <ToggleRow
            label={NECESSARY_LABEL}
            description={NECESSARY_DESCRIPTION}
            checked
            disabled
          />
          <ToggleRow
            label={ANALYTICS_LABEL}
            description={ANALYTICS_DESCRIPTION}
            checked={choice.analytics}
            onChange={(analytics) =>
              setChoice((current) => ({ ...current, analytics }))
            }
          />
          <ToggleRow
            label={ADVERTISING_LABEL}
            description={ADVERTISING_DESCRIPTION}
            checked={choice.advertising}
            onChange={(advertising) =>
              setChoice((current) => ({ ...current, advertising }))
            }
          />
          <Typography
            component={NextLink}
            href={ROUTES.privacyPolicy}
            variant="body2"
            sx={{ color: "primary.dark" }}
          >
            {PRIVACY_POLICY_LINK_LABEL}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ flexWrap: "wrap", gap: 1, px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onRejectAll}>
          {REJECT_ALL_LABEL}
        </Button>
        <Button variant="outlined" onClick={onAcceptAll}>
          {ACCEPT_ALL_LABEL}
        </Button>
        <Button variant="contained" onClick={() => onSave(choice)}>
          {SAVE_LABEL}
        </Button>
      </DialogActions>
    </>
  );
};

export const ConsentPreferencesDialog = ({
  open,
  onClose,
  ...bodyProps
}: ConsentPreferencesDialogProps) => {
  const titleId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id={titleId}>{DIALOG_TITLE}</DialogTitle>
      <PreferencesBody {...bodyProps} />
    </Dialog>
  );
};
