import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: "card",
        width: 600,
      },
      {
        name: "gallery",
        width: 1200,
      },
      {
        name: "hero",
        width: 1600,
      },
    ],
  },
};
