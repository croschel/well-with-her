"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";

import type { ParsedVideoEmbed } from "@/models/interfaces";

import { PLAY_BUTTON_LABEL } from "./constants";

export interface LazyVideoEmbedProps {
  video: ParsedVideoEmbed;
  title: string;
}

// §2.4: an eagerly loaded video iframe costs ~500KB and wrecks Core Web
// Vitals on an SEO-driven page — load the real embed only after a click.
export const LazyVideoEmbed = ({ video, title }: LazyVideoEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <Box sx={{ position: "relative", aspectRatio: "16 / 9" }}>
        <Box
          component="iframe"
          src={`${video.embedUrl}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        aspectRatio: "16 / 9",
        borderRadius: "10px",
        overflow: "hidden",
        bgcolor: "text.primary",
        backgroundImage: video.thumbnailUrl
          ? `url(${video.thumbnailUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <IconButton
        aria-label={PLAY_BUTTON_LABEL}
        onClick={() => setIsLoaded(true)}
        sx={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 64,
          height: 64,
          bgcolor: "rgba(248, 242, 234, 0.9)",
          "&:hover": { bgcolor: "background.default" },
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 32, color: "text.primary" }} />
      </IconButton>
    </Box>
  );
};
