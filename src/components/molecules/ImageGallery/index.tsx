import { Box } from "@mui/material";

import type { MediaAsset } from "@/models/interfaces";

export interface ImageGalleryProps {
  images: MediaAsset[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: 1.5,
    }}
  >
    {images.map((image) => (
      <Box
        key={image.url}
        component="img"
        src={image.sizes?.gallery?.url ?? image.url}
        alt={image.alt}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    ))}
  </Box>
);
