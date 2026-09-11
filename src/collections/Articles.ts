import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

import { CtaBlock } from "@/blocks/CtaBlock";
import { GalleryBlock } from "@/blocks/GalleryBlock";
import { ImageBlock } from "@/blocks/ImageBlock";
import { VideoEmbedBlock } from "@/blocks/VideoEmbedBlock";
import { validateVideoEmbedUrl } from "@/utils/validateVideoEmbedUrl";

export const Articles: CollectionConfig = {
  slug: "articles",
  access: {
    read: ({ req }) => Boolean(req.user) || { publishedAt: { less_than_equal: new Date().toISOString() } },
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    useAsTitle: "pinId",
    defaultColumns: ["category", "pinId", "slug", "publishedAt"],
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SITE_URL}/${data.category}/${data.pinId}/${data.slug}`,
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Women's Health", value: "womens-health" },
        { label: "Sleep", value: "sleep" },
        { label: "Nutrition", value: "nutrition" },
        { label: "Wellness", value: "wellness" },
      ],
    },
    {
      name: "pinId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "The stable Pinterest pin identifier, e.g. \"pin002\".",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "mainArticleContent",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
          BoldFeature(),
          ItalicFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature(),
          BlockquoteFeature(),
          BlocksFeature({
            blocks: [ImageBlock, GalleryBlock, VideoEmbedBlock, CtaBlock],
          }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "buyButtonUrl",
      type: "text",
      required: true,
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "galleryImages",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "videoEmbedUrl",
      type: "text",
      validate: validateVideoEmbedUrl,
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "ogDescription",
      type: "textarea",
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
};
