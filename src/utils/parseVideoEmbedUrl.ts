import type { ParsedVideoEmbed } from "@/models/interfaces";

const YOUTUBE_PATTERN = /youtube\.com\/watch\?v=([\w-]+)|youtu\.be\/([\w-]+)/;
const VIMEO_PATTERN = /vimeo\.com\/(\d+)/;

export const parseVideoEmbedUrl = (url: string): ParsedVideoEmbed | null => {
  const youtubeMatch = YOUTUBE_PATTERN.exec(url);
  if (youtubeMatch) {
    const id = youtubeMatch[1] ?? youtubeMatch[2];
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeoMatch = VIMEO_PATTERN.exec(url);
  if (vimeoMatch) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
};
