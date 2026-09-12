import { Box, Typography } from "@mui/material";

import { LazyVideoEmbed } from "@/components/molecules/LazyVideoEmbed";
import { parseVideoEmbedUrl } from "@/utils/parseVideoEmbedUrl";

export interface VideoEmbedBlockFields {
  url: string;
  caption?: null | string;
}

export const VideoEmbedBlockRenderer = ({
  url,
  caption,
}: VideoEmbedBlockFields) => {
  const video = parseVideoEmbedUrl(url);
  if (!video) return null;

  return (
    <Box sx={{ my: 3 }}>
      <LazyVideoEmbed video={video} title={caption ?? "Embedded video"} />
      {caption ? (
        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ display: "block", mt: 1, textAlign: "center" }}
        >
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
};
