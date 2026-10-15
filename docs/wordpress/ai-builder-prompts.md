# WellWithHer → Hostinger AI WordPress builder

> The brand was renamed **HerWellChapter** on 2026-10-15 (see [README.md](README.md)). These are the
> prompts as sent, under the old name.

Each prompt is under the builder's 2000-character limit. Paste them one at a time, in order.

---

## Prompt 1: create the site (1780 chars)

```text
Create a wellness blog for women called WellWithHer. Tagline: "Evidence-inspired tips for a healthier, more vibrant life." US audience arriving from Pinterest. Each article ends with an affiliate button "Shop this pick →" to an external store.

Style: calm, warm, editorial. Cream backgrounds, sage green accents, dark brown text, generous white space, rounded corners, soft shadows.
Colors: background #F8F2EA, cards #FFFAF3, footer #EFE4D2, headings #4A3222, body text #6B5C4A, accent sage #8A9678, borders #D8CDB8. Buttons: pill shape, dark brown #4A3222, cream text.
Fonts: Playfair Display for headings, Jost for body, Parisienne script only for small taglines.

Pages: Home, Women's Health, Sleep, Nutrition, Wellness (category archives), Contact, Privacy Policy, Affiliate Disclosure.

Header: sticky, cream, thin bottom border. Left: logo (thin sage circle with "WH") + "WellWithHer". Right: category links in small uppercase + search icon.

Home: full-width hero banner image, then a centered row of the 4 categories (sage line icon above small uppercase label), then "Latest Articles" in a 3-column grid of 6 posts.

Post cards: 4:3 image, small uppercase sage category, Playfair title, short excerpt, sage "Read more". Cream card, 10px radius, shadow grows on hover.

Footer (#EFE4D2), 4 columns: logo + "Evidence-inspired tips for a healthier life." | Categories | Company: About, Contact, Privacy Policy, Affiliate Disclosure | Follow: Pinterest, Instagram. Bottom: "© 2026 WellWithHer. All rights reserved."

Contact: title "Get in Touch", script subtitle "We'd love to hear from you.", form (name, email, message, "Send message"), side column with hello@wellwithher.com and Pinterest/Instagram.

Add a cookie consent banner with Accept all / Reject all / Customize.
```

---

## Prompt 2: article template (1295 chars)

```text
Redesign the single blog post template as a two-column layout, max width 1160px:

Top, full width: featured image about 420px tall with 12px rounded corners. Below it: small uppercase sage (#8A9678) category label, then the post title in Playfair Display, 37px, #4A3222, then a byline "By the WellWithHer Editors · 6 min read" in 13px taupe #9C8F78.

Main column (about 2/3 width): body text 17px, line height 1.85, color #4A3A2C. Style blockquotes as centered pull quotes in Parisienne script, 23px, sage #7C8A63, no border.

At the end of every post: a small gray disclosure line "This post contains affiliate links. We may earn a commission at no extra cost to you." and below it a pill button "Shop this pick →" (background #4A3222, cream #F8F2EA text, 24px radius) that opens the store link in a new tab.

Right column (about 1/3 width), sticky while scrolling: a card with background #FFFAF3, 1px border #E6DCC8, 12px radius, centered content: the WH logo circle, heading "About WellWithHer" (Playfair, 17px), text "We're a small team of writers and researchers sharing evidence-inspired wellness tips for women — on sleep, nutrition, and everyday balance." (14px, #6B5C4A), and a sage link "Get in touch →" to the Contact page.

On mobile, stack the columns: post first, about card below.
```

---

## Prompt 3: category pages (696 chars)

```text
Style each category archive page (Women's Health, Sleep, Nutrition, Wellness) the same way: a centered header with the category's sage (#8A9678) line icon, the category name in Playfair Display, and a one-line description in #6B5C4A, then the same 3-column post card grid used on the home page (cream cards, 4:3 image, uppercase sage category, Playfair title, excerpt, "Read more").

Descriptions:
- Women's Health: "Hormones, cycles, and caring for your body."
- Sleep: "Rest better, wake up brighter."
- Nutrition: "Simple, evidence-inspired food and supplement guidance."
- Wellness: "Everyday rituals for a calmer, more balanced life."

Use the same header and footer as the rest of the site.
```

---

## Things the AI builder won't do (finish by hand)

- **Hero image:** upload `docs/design-reference/home-hero-banner.png` from the repo.
- **Categories:** create them as WordPress post categories with slugs `womens-health`, `sleep`, `nutrition`, `wellness`, so the menus and category pages use them.
- **Permalinks:** Settings → Permalinks → custom `/%category%/%postname%/`. The old `/[category]/[pinId]/[slug]` shape needs a custom field + rewrite code; not worth it unless pins already point at old URLs.
- **Affiliate links:** add `rel="sponsored noopener"` and open in a new tab. Save the store URL in each post's button block.
- **SEO:** install Rank Math (free): meta descriptions, Open Graph images for Pinterest, Article schema, sitemap.
- **Cookies:** use Complianz or CookieYes (free) with Google Consent Mode v2, then add GTM/GA through Site Kit or the consent plugin.
- **Contact form:** use the builder's own form or WPForms Lite. Send it to the real inbox.
- **Wife's access:** give her the **Author** or **Editor** role, not Administrator.
- **Privacy Policy / Affiliate Disclosure:** copy the text from the current CMS (SiteInfo global).
