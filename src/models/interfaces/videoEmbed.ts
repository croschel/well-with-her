export interface ParsedVideoEmbed {
  provider: "youtube" | "vimeo";
  embedUrl: string;
  thumbnailUrl?: string;
}
