import type { MediaAsset, MediaAssetSize } from "@/models/interfaces";

import type { Media as PayloadMedia } from "../../../payload-types";

interface PayloadMediaSize {
  url?: string | null;
  width?: number | null;
  height?: number | null;
}

const mapSize = (size?: PayloadMediaSize | null): MediaAssetSize | undefined => {
  if (!size?.url || !size.width || !size.height) return undefined;
  return { url: size.url, width: size.width, height: size.height };
};

export const mapMediaAsset = (media: PayloadMedia): MediaAsset => ({
  url: media.url ?? "",
  alt: media.alt,
  width: media.width ?? undefined,
  height: media.height ?? undefined,
  sizes: {
    card: mapSize(media.sizes?.card),
    gallery: mapSize(media.sizes?.gallery),
    hero: mapSize(media.sizes?.hero),
  },
});

// Payload relation fields resolve to the full document only when fetched
// with sufficient `depth`. A raw numeric ID here means a service forgot
// that option — fail loudly rather than silently rendering a broken image.
export const resolveMediaAsset = (media: PayloadMedia | number): MediaAsset => {
  if (typeof media === "number") {
    throw new Error(
      "Expected a populated media relation — check the service's depth option.",
    );
  }
  return mapMediaAsset(media);
};

export const resolveOptionalMediaAsset = (
  media: PayloadMedia | number | null | undefined,
): MediaAsset | undefined => {
  if (media == null) return undefined;
  return resolveMediaAsset(media);
};

export const resolveMediaAssetList = (
  media: (PayloadMedia | number)[] | null | undefined,
): MediaAsset[] => (media ?? []).map(resolveMediaAsset);
