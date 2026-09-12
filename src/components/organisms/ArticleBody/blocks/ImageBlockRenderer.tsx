import { Box, Typography } from "@mui/material";

import { resolveMediaAsset } from "@/services/mappers/mediaMapper";

import type { Media } from "../../../../../payload-types";

export interface ImageBlockFields {
  image: Media | number;
  caption?: null | string;
}

export const ImageBlockRenderer = ({ image, caption }: ImageBlockFields) => {
  const asset = resolveMediaAsset(image);

  return (
    <Box component="figure" sx={{ m: 0, my: 3 }}>
      <Box
        component="img"
        src={asset.sizes?.gallery?.url ?? asset.url}
        alt={asset.alt}
        sx={{ width: "100%", borderRadius: "10px", display: "block" }}
      />
      {caption ? (
        <Typography
          component="figcaption"
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
