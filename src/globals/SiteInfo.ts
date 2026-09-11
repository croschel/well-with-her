import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

export const SiteInfo: GlobalConfig = {
  slug: "site-info",
  fields: [
    {
      name: "asideContent",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: "disclosure",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Affiliate/sponsored-link disclosure shown above the buy button on every article (FTC requirement).",
      },
    },
  ],
};
