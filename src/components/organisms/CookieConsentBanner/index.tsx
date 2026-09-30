"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { ConsentPreferencesDialog } from "@/components/molecules/ConsentPreferencesDialog";
import { OPEN_CONSENT_EVENT } from "@/constants/consent";
import { useConsent } from "@/hooks/useConsent";
import { isGpcEnabled } from "@/utils/consent";

import {
  ACCEPT_ALL_LABEL,
  BANNER_ARIA_LABEL,
  BANNER_TEXT,
  CUSTOMIZE_LABEL,
  REJECT_ALL_LABEL,
} from "./constants";

const NO_CHOICE = { analytics: false, advertising: false };

// Fixed to the viewport (bottom sheet on mobile, bottom-left card on
// desktop) so it never shifts layout, and it renders only after mount
// (useConsent.isReady) so it can't cause a hydration mismatch. Accept all
// and Reject all are deliberately identical in weight.
export const CookieConsentBanner = () => {
  const { isReady, consent, hasDecided, save, acceptAll, rejectAll } =
    useConsent();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const open = () => setDialogOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (!isReady) return null;

  // Every way of choosing also closes the dialog.
  const choose = (action: () => void) => () => {
    action();
    setDialogOpen(false);
  };

  return (
    <>
      {!hasDecided && !dialogOpen ? (
        <Paper
          component="section"
          role="region"
          aria-label={BANNER_ARIA_LABEL}
          elevation={6}
          sx={(theme) => ({
            position: "fixed",
            zIndex: theme.zIndex.snackbar,
            bottom: { xs: 0, sm: 16 },
            left: { xs: 0, sm: 16 },
            right: { xs: 0, sm: "auto" },
            width: { sm: 400 },
            maxWidth: "100%",
            p: 2,
            borderRadius: { xs: "16px 16px 0 0", sm: 3 },
          })}
        >
          <Stack spacing={1.5}>
            <Typography variant="body2">{BANNER_TEXT}</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button variant="contained" size="small" onClick={acceptAll}>
                {ACCEPT_ALL_LABEL}
              </Button>
              <Button variant="contained" size="small" onClick={rejectAll}>
                {REJECT_ALL_LABEL}
              </Button>
              <Button size="small" onClick={() => setDialogOpen(true)}>
                {CUSTOMIZE_LABEL}
              </Button>
            </Box>
          </Stack>
        </Paper>
      ) : null}
      <ConsentPreferencesDialog
        open={dialogOpen}
        initialChoice={
          consent
            ? { analytics: consent.analytics, advertising: consent.advertising }
            : NO_CHOICE
        }
        gpcEnabled={isGpcEnabled()}
        onSave={(choice) => choose(() => save(choice))()}
        onAcceptAll={choose(acceptAll)}
        onRejectAll={choose(rejectAll)}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
