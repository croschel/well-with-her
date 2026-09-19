import { getPayload } from "payload";

import config from "../payload.config";

const richTextParagraphs = (paragraphs: string[]) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: null,
    children: paragraphs.map((text) => ({
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
    })),
  },
});

const richText = (text: string) => richTextParagraphs([text]);

const PRIVACY_POLICY_CONTENT = richTextParagraphs([
  "Effective date: September 2026. This Privacy Policy explains what information WellWithHer (\"we\", \"us\") collects from visitors to this site, and how it's used.",
  "Analytics: we use Google Analytics (GA4) and the Pinterest Tag to understand which content resonates with our readers — for example, which pages are viewed and which links are clicked. These tools may set cookies and collect information such as your IP address, browser type, and pages visited. We do not use this data to identify you personally.",
  "Contact form: if you use our contact form, we collect the name, email address, and message you submit. This information is stored securely and is only accessible to our editorial team — we do not sell or share it with third parties, and we do not use it for marketing unless you separately opt in.",
  "Accounts and newsletter: WellWithHer does not currently offer visitor accounts or a newsletter. The only login on this site is for our internal editorial team.",
  "Cookies: aside from any cookies set by the analytics tools described above, we do not currently use tracking cookies. If this changes, we will update this policy and provide a way to manage your cookie preferences.",
  "Affiliate links: some articles contain affiliate links, meaning we may earn a commission if you make a purchase through them, at no extra cost to you. See our Affiliate Disclosure page for details.",
  "Questions about this policy? Reach out through our Contact page.",
]);

const AFFILIATE_DISCLOSURE_CONTENT = richTextParagraphs([
  "WellWithHer participates in affiliate marketing. This means that some of the products we recommend in our articles — including the \"buy this pick\" buttons — contain affiliate links.",
  "If you click one of these links and make a purchase, we may earn a commission at no additional cost to you. We only recommend products we genuinely believe can help our readers.",
  "In line with the Federal Trade Commission's guidance on endorsements, a short version of this disclosure is also shown directly above the buy button on every article that contains an affiliate link, so the relationship is clear right where the recommendation appears — not just here.",
  "If you have questions about a specific recommendation, feel free to reach out through our Contact page.",
]);

const SAMPLE_ARTICLES = [
  {
    category: "wellness" as const,
    pinId: "pin001",
    slug: "five-minute-morning-reset",
    title: "The Five-Minute Morning Reset",
    ogDescription:
      "A tiny five-minute ritual that sets a calmer tone for the whole day.",
    buyButtonLabel: "Shop this pick →",
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
    buyButtonLabel: "Shop this pick →",
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
    buyButtonLabel: "Shop this pick →",
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
    "A woman in cream loungewear sitting by a sunlit window next to potted greenery — WellWithHer home hero banner, placeholder from the design reference, replace with licensed photography before launch.",
    "home-hero-banner.png",
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
      privacyPolicyContent: PRIVACY_POLICY_CONTENT,
      affiliateDisclosureContent: AFFILIATE_DISCLOSURE_CONTENT,
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
