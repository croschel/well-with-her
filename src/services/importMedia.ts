import { getPayloadClient } from "./payloadClient";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const FETCH_TIMEOUT_MS = 15_000;
const DEFAULT_ALT = "Imported image — add a description";

// Only ever called after importImageFromUrl has already parsed `src` as a
// URL successfully, so re-parsing here can't throw.
const filenameFromUrl = (src: string): string => {
  const { pathname } = new URL(src);
  const base = pathname.split("/").pop();
  return base && base.length > 0 ? base : `imported-${Date.now()}.png`;
};

// AI image-generation tools frequently hand back temporary URLs that expire
// within hours — embedding the source URL directly would look fine in
// preview and then silently break later. Downloading and re-uploading into
// our own Media collection (same storage every other image on the site
// already uses) makes it permanent.
export const importImageFromUrl = async (params: {
  src: string;
  alt: string;
}): Promise<{ mediaId: number | string }> => {
  const url = new URL(params.src);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported image URL protocol: ${url.protocol}`);
  }

  const response = await fetch(params.src, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${params.src}`);
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_IMAGE_BYTES) {
    throw new Error(`Image exceeds the ${MAX_IMAGE_BYTES}-byte import limit: ${params.src}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`Image exceeds the ${MAX_IMAGE_BYTES}-byte import limit: ${params.src}`);
  }

  const buffer = Buffer.from(arrayBuffer);
  const mimetype = response.headers.get("content-type") ?? "image/png";

  const payload = await getPayloadClient();
  const doc = await payload.create({
    collection: "media",
    data: { alt: params.alt.trim() || DEFAULT_ALT },
    file: {
      data: buffer,
      mimetype,
      name: filenameFromUrl(params.src),
      size: buffer.byteLength,
    },
  });

  return { mediaId: doc.id };
};
