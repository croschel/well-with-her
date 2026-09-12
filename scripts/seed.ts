import { getPayload } from "payload";

import config from "../payload.config";

const richText = (text: string) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: null,
    children: [
      {
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: null,
        children: [
          {
            type: "text",
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
            version: 1,
            text,
          },
        ],
      },
    ],
  },
});

const SAMPLE_ARTICLES = [
  {
    category: "wellness" as const,
    pinId: "pin001",
    slug: "five-minute-morning-reset",
    title: "The Five-Minute Morning Reset",
    buyButtonUrl: "https://example.com/shop/morning-reset-kit",
    publishedAt: new Date().toISOString(),
  },
  {
    category: "sleep" as const,
    pinId: "pin002",
    slug: "wind-down-routine-for-better-sleep",
    title: "A Wind-Down Routine for Better Sleep",
    buyButtonUrl: "https://example.com/shop/sleep-kit",
    publishedAt: new Date().toISOString(),
  },
  {
    category: "nutrition" as const,
    pinId: "pin003",
    slug: "simple-anti-inflammatory-breakfast",
    title: "A Simple Anti-Inflammatory Breakfast",
    buyButtonUrl: "https://example.com/shop/breakfast-kit",
    publishedAt: new Date().toISOString(),
  },
];

const run = async () => {
  const payload = await getPayload({ config });

  const placeholderImage = await payload.create({
    collection: "media",
    data: { alt: "Placeholder seed image" },
    filePath: `${import.meta.dirname}/seed-assets/placeholder.png`,
  });

  await payload.updateGlobal({
    slug: "site-info",
    data: {
      asideContent: richText(
        "About WellWithHer — seed placeholder copy, replace in the admin.",
      ),
      disclosure:
        "Some links on this site are affiliate links. We may earn a commission at no extra cost to you.",
    },
  });

  for (const article of SAMPLE_ARTICLES) {
    await payload.create({
      collection: "articles",
      data: {
        ...article,
        heroImage: placeholderImage.id,
        mainArticleContent: richText(
          "Seed placeholder content — replace in the admin.",
        ),
      },
    });
  }

  console.log(`Seeded ${SAMPLE_ARTICLES.length} articles and the SiteInfo global.`);
};

try {
  // Top-level await: `payload run` exits as soon as the dynamic import()
  // of this file resolves, so a fire-and-forget run().catch(...) here
  // would let the CLI exit before the seed work ever completes.
  await run();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
