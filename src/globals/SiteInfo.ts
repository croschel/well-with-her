import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

export const SiteInfo: GlobalConfig = {
  slug: "site-info",
  fields: [
    {
      name: "homeHeroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Full-bleed photo at the top of the home page.",
      },
    },
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
    {
      name: "privacyPolicyContent",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
      admin: {
        description: "Full content of the public /privacy-policy page.",
      },
    },
    {
      name: "affiliateDisclosureContent",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
      admin: {
        description: "Full content of the public /affiliate-disclosure page.",
      },
    },
  ],
};
