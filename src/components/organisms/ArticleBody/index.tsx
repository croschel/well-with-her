import { Box } from "@mui/material";
import type { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import {
  type JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import type { RichTextContent } from "@/models/interfaces";
import { ARTICLE_BODY_TEXT_COLOR, BODY_TEXT_COLOR } from "@/theme/palette";

import { type CtaBlockFields,CtaBlockRenderer } from "./blocks/CtaBlockRenderer";
import { type GalleryBlockFields,GalleryBlockRenderer } from "./blocks/GalleryBlockRenderer";
import { type ImageBlockFields,ImageBlockRenderer } from "./blocks/ImageBlockRenderer";
import {
  type VideoEmbedBlockFields,
  VideoEmbedBlockRenderer,
} from "./blocks/VideoEmbedBlockRenderer";

type ArticleBlockNode = SerializedBlockNode<
  | (ImageBlockFields & { blockType: "imageBlock" })
  | (GalleryBlockFields & { blockType: "galleryBlock" })
  | (VideoEmbedBlockFields & { blockType: "videoEmbedBlock" })
  | (CtaBlockFields & { blockType: "ctaBlock" })
>;

const converters: JSXConvertersFunction<DefaultNodeTypes | ArticleBlockNode> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    imageBlock: ({ node }) => <ImageBlockRenderer {...node.fields} />,
    galleryBlock: ({ node }) => <GalleryBlockRenderer {...node.fields} />,
    videoEmbedBlock: ({ node }) => <VideoEmbedBlockRenderer {...node.fields} />,
    ctaBlock: ({ node }) => <CtaBlockRenderer {...node.fields} />,
  },
});

export interface ArticleBodyProps {
  content: RichTextContent;
}

// §Article page spec: body copy uses a 4th text tone distinct from
// text.secondary/BODY_TEXT_COLOR, and pull-quotes render in the Parisienne
// script font per the extracted design reference.
export const ArticleBody = ({ content }: ArticleBodyProps) => (
  <Box
    sx={{
      "& p": {
        fontSize: "17px",
        lineHeight: 1.85,
        color: ARTICLE_BODY_TEXT_COLOR,
        my: 2,
      },
      "& h2, & h3": {
        color: "text.primary",
        mt: 4,
        mb: 2,
      },
      "& a": {
        color: "primary.dark",
      },
      "& ul, & ol": {
        color: ARTICLE_BODY_TEXT_COLOR,
        fontSize: "17px",
        lineHeight: 1.85,
        pl: 3,
      },
      "& blockquote": {
        fontFamily: "var(--font-parisienne), cursive",
        fontSize: "23px",
        color: "primary.dark",
        textAlign: "center",
        lineHeight: 1.5,
        margin: "14px 0",
        borderLeft: "none",
        pl: 0,
      },
      "& figcaption": {
        color: BODY_TEXT_COLOR,
      },
    }}
  >
    <RichText
      data={content as unknown as Parameters<typeof RichText>[0]["data"]}
      converters={converters}
    />
  </Box>
);
