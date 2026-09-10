import type { Block } from "payload";

export const GalleryBlock: Block = {
  slug: "galleryBlock",
  labels: {
    singular: "Gallery",
    plural: "Galleries",
  },
  fields: [
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      minRows: 2,
      required: true,
    },
  ],
};
