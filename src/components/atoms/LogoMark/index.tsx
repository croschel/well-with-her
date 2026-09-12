import { Box, Typography } from "@mui/material";

export interface LogoMarkProps {
  size?: number;
  showAccent?: boolean;
}

export const LogoMark = ({ size = 38, showAccent = false }: LogoMarkProps) => (
  <Box
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      border: "1px solid",
      borderColor: "primary.main",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <Typography
      component="span"
      sx={{
        fontFamily: "var(--font-playfair-display), serif",
        fontSize: size * 0.32,
        color: "text.primary",
        letterSpacing: "0.5px",
      }}
    >
      WH
    </Typography>
    {showAccent ? (
      <Box
        component="svg"
        width={18}
        height={11}
        viewBox="0 0 30 18"
        fill="none"
        stroke="#8a9678"
        strokeWidth={1.6}
        sx={{ position: "absolute", bottom: -3, right: -4 }}
      >
        <path d="M2 16C10 16 14 8 26 3" />
        <path d="M10 13C10 13 9 9 13 8" />
      </Box>
    ) : null}
  </Box>
);
