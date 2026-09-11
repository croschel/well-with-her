import type { Block } from "payload";

import { validateVideoEmbedUrl } from "@/utils/validateVideoEmbedUrl";

export const VideoEmbedBlock: Block = {
  slug: "videoEmbedBlock",
  labels: {
    singular: "Video Embed",
    plural: "Video Embeds",
  },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      validate: validateVideoEmbedUrl,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};
