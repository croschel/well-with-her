import { Box } from "@mui/material";

import { ImageGallery } from "@/components/molecules/ImageGallery";
import { resolveMediaAssetList } from "@/services/mappers/mediaMapper";

import type { Media } from "../../../../../payload-types";

export interface GalleryBlockFields {
  images: (Media | number)[];
}

export const GalleryBlockRenderer = ({ images }: GalleryBlockFields) => (
  <Box sx={{ my: 3 }}>
    <ImageGallery images={resolveMediaAssetList(images)} />
  </Box>
);
