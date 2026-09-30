const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const validateHexColor = (
  value: string | null | undefined,
): string | true => {
  if (!value) return true;
  return HEX_COLOR_PATTERN.test(value)
    ? true
    : "Enter a hex color like #C2185B.";
};
