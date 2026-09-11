import type { Block } from "payload";

export const CtaBlock: Block = {
  slug: "ctaBlock",
  labels: {
    singular: "Call to Action",
    plural: "Calls to Action",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
  ],
};
