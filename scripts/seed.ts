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
    ogDescription:
      "A tiny five-minute ritual that sets a calmer tone for the whole day.",
    buyButtonUrl: "https://example.com/shop/morning-reset-kit",
    publishedAt: new Date().toISOString(),
  },
  {
    category: "sleep" as const,
    pinId: "pin002",
    slug: "wind-down-routine-for-better-sleep",
    title: "A Wind-Down Routine for Better Sleep",
    ogDescription:
      "A simple evening sequence that signals to your body it's time to rest.",
    buyButtonUrl: "https://example.com/shop/sleep-kit",
    publishedAt: new Date().toISOString(),
  },
  {
    category: "nutrition" as const,
    pinId: "pin003",
    slug: "simple-anti-inflammatory-breakfast",
    title: "A Simple Anti-Inflammatory Breakfast",
    ogDescription:
      "An easy, real-food breakfast that's gentle on inflammation and quick to make.",
    buyButtonUrl: "https://example.com/shop/breakfast-kit",
    publishedAt: new Date().toISOString(),
  },
];

const findOrUploadMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  alt: string,
  fileName: string,
) => {
  const existing = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
  });
  if (existing.docs[0]) return existing.docs[0];

  return payload.create({
    collection: "media",
    data: { alt },
    filePath: `${import.meta.dirname}/seed-assets/${fileName}`,
  });
};

const run = async () => {
  const payload = await getPayload({ config });

  const placeholderImage = await findOrUploadMedia(
    payload,
    "Placeholder seed image",
    "placeholder.png",
  );

  const heroImage = await findOrUploadMedia(
    payload,
    "A woman relaxing in cream loungewear by a sunlit window — placeholder from the design reference, replace with licensed photography before launch.",
    "home-hero-placeholder.png",
  );

  await payload.updateGlobal({
    slug: "site-info",
    data: {
      homeHeroImage: heroImage.id,
      asideContent: richText(
        "About WellWithHer — seed placeholder copy, replace in the admin.",
      ),
      disclosure:
        "Some links on this site are affiliate links. We may earn a commission at no extra cost to you.",
    },
  });

  let created = 0;
  for (const article of SAMPLE_ARTICLES) {
    const existing = await payload.find({
      collection: "articles",
      where: { pinId: { equals: article.pinId } },
      limit: 1,
    });
    if (existing.docs[0]) continue;

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
    created += 1;
  }

  console.log(`Seeded ${created} new article(s) and updated the SiteInfo global.`);
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
