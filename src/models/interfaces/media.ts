export interface MediaAssetSize {
  url: string;
  width: number;
  height: number;
}

export interface MediaAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: {
    card?: MediaAssetSize;
    gallery?: MediaAssetSize;
    hero?: MediaAssetSize;
  };
}
