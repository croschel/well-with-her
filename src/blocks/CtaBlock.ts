import type { Block } from "payload";

import { validateHexColor } from "@/utils/validateHexColor";
import { validateHttpUrl } from "@/utils/validateHttpUrl";

export const CtaBlock: Block = {
  slug: "ctaBlock",
  labels: {
    singular: "Call to Action",
    plural: "Calls to Action",
  },
  fields: [
    {
      name: "style",
      type: "select",
      defaultValue: "button",
      options: [
        { label: "Button", value: "button" },
        { label: "Text link", value: "link" },
      ],
    },
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
      validate: validateHttpUrl,
    },
    {
      name: "backgroundColor",
      type: "text",
      validate: validateHexColor,
      admin: {
        description: "Hex color, e.g. #C2185B. Leave empty for the default.",
        condition: (_, siblingData) => siblingData?.style !== "link",
      },
    },
    {
      name: "textColor",
      type: "text",
      validate: validateHexColor,
      admin: {
        description: "Hex color, e.g. #FFFFFF. Leave empty for the default.",
      },
    },
    {
      name: "alignment",
      type: "select",
      defaultValue: "left",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    {
      name: "size",
      type: "select",
      defaultValue: "medium",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.style !== "link",
      },
    },
    {
      name: "openInNewTab",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "sponsored",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Mark as an affiliate/sponsored link (rel=\"sponsored\").",
      },
    },
  ],
};
