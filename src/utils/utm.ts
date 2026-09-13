const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];
export type UtmParams = Partial<Record<UtmParamKey, string>>;

export const parseUtmParams = (
  searchParams: Pick<URLSearchParams, "get">,
): UtmParams => {
  const params: UtmParams = {};
  for (const key of UTM_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) params[key] = value;
  }
  return params;
};

// Appends UTM params onto an outbound URL so the shop can attribute the
// click back to the Pinterest pin that drove it. Returns the URL
// unchanged if there's nothing to append (no trailing "?" noise on every
// buy link for direct/non-Pinterest visitors).
export const appendUtmParams = (url: string, utmParams: UtmParams): string => {
  const entries = Object.entries(utmParams).filter(([, value]) => value);
  if (entries.length === 0) return url;

  const [base, existingQuery] = url.split("?");
  const query = new URLSearchParams(existingQuery);
  for (const [key, value] of entries) {
    query.set(key, value as string);
  }
  return `${base}?${query.toString()}`;
};
