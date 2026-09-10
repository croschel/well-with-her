# Wife's Pinterest-to-Article Site — Architecture & Build Plan

## Context
Site built for Caique's wife. It's a content/blog site whose purpose is to
receive traffic from Pinterest pins, present an article that talks about
the pin's topic, and end with a call-to-action driving the reader to an
external e-commerce site for purchase. Domain: **hercozygrowth.com**.

## User flow
1. Person browses wife's Pinterest page.
2. Clicks a pin, which links to a URL she defines when creating the pin,
   shaped like:
   `https://hercozygrowth.com/wellness/pin002/article-002/?utm_source=pinterest&utm_medium=pin&utm_content=pin01`
3. The route (`category/pinId/slug`) determines which article renders.
   UTM params are analytics-only — capture client-side on load, forward to
   analytics (GA4 / Pinterest tag), never use them to decide what renders.
4. Article page shows the main content (written by wife via CMS), a shared
   sitewide "About the site / About [wife]" aside box, and a CTA button.
5. CTA button links out to an external e-commerce site that handles
   checkout/payment — out of scope for this project.

## Site structure
Real routes for every section (not client-side tab switching — SEO
indexing was the whole reason for choosing Next.js, and a JS tab switcher
that doesn't change the URL is invisible to Google):
- `/` — Home
- `/[category]` — category listing page, e.g. `/wellness`, shows all
  articles tagged with that category
- `/[category]/[pinId]/[slug]` — individual article page
- `/contact` — contact page

## Content model
**Article** (per-article content, one per pin):
```
category: string           // e.g. "wellness" — also the URL segment
pinId: string                // e.g. "pin002" — set by wife when creating the pin link
slug: string                  // e.g. "article-002"
mainArticleContent: richtext  // the one restricted, wife-editable section for now —
                               // schema is extensible to add more sections later
                               // without changing what she's able to touch outside them
buyButtonUrl: string
heroImage: media
galleryImages: media[]
videoEmbedUrl?: string        // YouTube/Vimeo link — see Media handling below
ogImage?, ogDescription?
publishedAt: date
```

**Site Info** (singleton/global — edited once, rendered on every article page):
```
asideContent: richtext   // "About the site" / "About [wife]" box
```

## CMS: Payload CMS
Decided on **Payload CMS** over Strapi/Sanity — reasons:
- TypeScript-native, matches the rest of the stack; schema is defined in
  code (version-controlled, not a UI you click through).
- Because the content schema is code-first, the wife's editable surface is
  exactly the fields you define (`mainArticleContent` for now) — no raw
  HTML entry, no separate sanitization step needed, since Payload's rich
  text field controls what's possible to enter.
- Built-in admin UI + auth + role/access control per field/collection —
  no custom login panel to build.
- Self-hosted: needs a Postgres database (Vercel Postgres or Neon both
  work well alongside a Vercel-hosted Next.js frontend) and a storage
  adapter for uploaded media (Vercel Blob, Cloudflare R2, or S3).

## Media handling
- **Images**: uploaded directly through Payload's media library, stored
  via the configured storage adapter.
- **Video**: store as an embed URL field (YouTube/Vimeo), not a raw
  uploaded file. Self-hosting video files directly gets expensive fast
  (storage, bandwidth, no automatic compression/streaming) — still open
  whether the wife will upload raw files or just paste a link; worth
  confirming before building the field, since it changes what the CMS
  config needs to do.

## SEO & Pinterest integration
- `generateMetadata` per route, `sitemap.ts`, `robots.ts`.
- `Article` (not `Product`) JSON-LD structured data on article pages.
- Pinterest domain verification meta tag; `og:title` / `og:description` /
  `og:image` on every article; run pages through Pinterest's Rich Pin
  validator before launch (article rich pins, not product rich pins).

## Rendering & updates
- Static Generation for article and category pages.
- On-demand ISR: a Payload webhook (fires on publish) hits a Next.js route
  calling `revalidatePath` for the affected article and its category page,
  so edits go live immediately rather than waiting on a timer.

## Hosting & domain (unchanged)
- Hosting: Vercel (Next.js frontend). Payload CMS itself needs its own
  small always-on host (e.g. Railway/Render) since it's a Node server, not
  a static site — separate from the Vercel frontend deploy.
- Domain: hercozygrowth.com, via Cloudflare Registrar or Porkbun. DNS on
  Cloudflare; add the CNAME Vercel provides for the frontend.

## Step-by-step build plan
1. Buy domain — done: hercozygrowth.com.
2. Provision Postgres (Vercel Postgres or Neon) and a media storage bucket
   (Vercel Blob or Cloudflare R2).
3. Scaffold Payload CMS, define the `Article` collection and `Site Info`
   global per the schema above, set up the wife's user with an Editor role
   restricted to those fields.
4. Scaffold Next.js app (`npx create-next-app@latest --typescript --app`),
   connect it to the Payload API.
5. Build routes: `/`, `/[category]`, `/[category]/[pinId]/[slug]`,
   `/contact`.
6. Add SEO essentials (metadata, sitemap, robots, Article JSON-LD) and
   Pinterest meta tags/verification.
7. Wire on-demand ISR via a Payload publish webhook.
8. Deploy Next.js frontend to Vercel; deploy Payload CMS to its own host
   (Railway/Render); connect the custom domain to the Vercel project.
9. Add analytics (Vercel Analytics or Plausible, GA4 and/or Pinterest
   conversion tag) reading the forwarded UTM params.
10. Submit sitemap to Google Search Console post-launch.

## Open questions
- Will the wife upload raw video files, or paste embed links (YouTube/
  Vimeo)? Decides whether `videoEmbedUrl` is enough or a media upload
  field is also needed.
- Any need for a staging/preview step before content goes live, or is
  "publish immediately" fine?
- UI/UX mockups still to come — will likely sharpen the exact shape of
  `mainArticleContent` (single rich-text field vs. multiple named blocks).

## Getting started (local scaffold)
```bash
npx create-next-app@latest wellwithher \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```
Payload gets installed into this same project (Next.js-native, see CMS
section above) once the project exists — do that as a follow-up step, not
part of this initial scaffold.

## Design reference
A working prototype was built in Claude Design: **WellWithHer** —
implements Home, Category, Article, and Contact pages against the brand
screenshot's palette and a layout modeled on depoisdosquinze.com (top nav
with category links, card-grid article listing, article page with hero
image + body + floating CTA + aside bio box, topic-grouped footer).

The exported prototype file (`WellWithHer-design-reference.html`) should be
copied into the repo, e.g. at `/design-reference/WellWithHer.html`, so
Claude Code can open it directly as the visual source of truth while
building the real pages — closer to the mark than re-describing the design
in prose.

### Design tokens (pulled from the prototype)
**Colors**
| Token | Hex | Use |
|---|---|---|
| Background (cream) | `#f8f2ea` | page background |
| Background (lightest) | `#fffaf3` | cards, elevated surfaces |
| Tint 1–4 | `#f1e9dd` `#efe6d5` `#e9dfc9` `#e6dcc8` | card/section backgrounds, badges |
| Border | `#d8cdb8` | dividers, card borders |
| Heading / primary text | `#4a3222` | logo, headings, active nav state |
| Secondary text | `#5c4a3a` | body copy, inactive nav |
| Text alt | `#6b5c4a` | secondary UI text |
| Accent (sage) | `#8a9678` | active underline, icons, links |
| Accent (deep sage) | `#7c8a63` | icon fill, hover states |
| Muted taupe | `#9c8f78` | captions, meta text |

**Typography**
- **Playfair Display** (serif) — logo, headings, article titles
- **Jost** (sans-serif) — nav labels (uppercase, letter-spaced), body copy, UI text
- **Parisienne** (script/cursive) — taglines, pull-quotes

**Category → icon mapping**
- Women's Health → leaf
- Sleep → moon
- Nutrition → sprout
- Wellness → lotus

**Radii:** mix of 6px / 8px / 10px / 12px (cards, buttons) and 24px / 50%
(pills, circular elements like the logo mark).
