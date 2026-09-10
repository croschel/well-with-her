const VIDEO_EMBED_HOST_PATTERN =
  /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//;

export const validateVideoEmbedUrl = (
  value: string | null | undefined,
): string | true => {
  if (!value) return true;
  return VIDEO_EMBED_HOST_PATTERN.test(value)
    ? true
    : "Enter a YouTube or Vimeo URL.";
};
