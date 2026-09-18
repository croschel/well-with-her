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
import type { CollectionConfig, Where } from "payload";

import { CtaBlock } from "@/blocks/CtaBlock";
import { GalleryBlock } from "@/blocks/GalleryBlock";
import { ImageBlock } from "@/blocks/ImageBlock";
import { VideoEmbedBlock } from "@/blocks/VideoEmbedBlock";
import { importArticleHtmlHandler } from "@/collections/endpoints/importArticleHtml";
import { SITE_URL } from "@/constants/seo";
import { revalidateArticlePaths } from "@/utils/revalidateArticlePaths";
import { validateVideoEmbedUrl } from "@/utils/validateVideoEmbedUrl";

export const Articles: CollectionConfig = {
  slug: "articles",
  access: {
    // `publishedAt` alone isn't enough to gate public access — it's a plain
    // content field that defaults to "now" the moment an article is first
    // saved, draft or not. `_status` is Payload's own draft/publish state;
    // both must hold for an anonymous reader to see the article.
    read: ({ req }) => {
      if (req.user) return true;
      const publicOnly: Where[] = [
        { _status: { equals: "published" } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ];
      return { and: publicOnly };
    },
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "pinId", "publishedAt"],
    livePreview: {
      url: ({ data }) => `${SITE_URL}/${data.category}/${data.pinId}/${data.slug}`,
    },
  },
  endpoints: [
    { path: "/import-html", method: "post", handler: importArticleHtmlHandler },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc, operation }) => {
        revalidateArticlePaths(doc);

        // The article may have moved category or changed its URL entirely
        // (pinId/slug) — the old paths need revalidating too, or the
        // stale category listing / old URL would keep serving cached
        // content indefinitely.
        const moved =
          operation === "update" &&
          previousDoc &&
          (previousDoc.category !== doc.category ||
            previousDoc.pinId !== doc.pinId ||
            previousDoc.slug !== doc.slug);
        if (moved) {
          revalidateArticlePaths(previousDoc);
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateArticlePaths(doc);
      },
    ],
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
      name: "title",
      type: "text",
      required: true,
      admin: {
        description:
          "The article's headline — used on cards, the article page, and the browser title.",
      },
    },
    {
      name: "htmlImportPanel",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "@/components/organisms/HtmlImportPanel",
            exportName: "HtmlImportPanel",
          },
        },
      },
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
      name: "buyButtonLabel",
      type: "text",
      required: true,
      defaultValue: "Shop this pick →",
      admin: {
        description: "The text shown on the buy button at the end of the article.",
      },
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
