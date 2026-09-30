const HTTP_URL_PATTERN = /^https?:\/\/\S+$/i;

export const validateHttpUrl = (
  value: string | null | undefined,
): string | true => {
  if (!value) return "Enter a URL.";
  return HTTP_URL_PATTERN.test(value)
    ? true
    : "Enter a full URL starting with http:// or https://.";
};
