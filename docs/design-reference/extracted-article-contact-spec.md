# Article & Contact page spec — extracted from the design artifact

Decoded directly from the Claude Design artifact's bundle manifest on 2026-09-12 (see
`docs/implementation-plan.md`'s "Design alignment pass" note for how). This is the exact source,
not a description — use it directly for Ticket 6 (Article) and Ticket 7 (Contact).

## Article page

Two-column layout, `max-width: 1160px`, gap `52px`, main column `flex: 2 1 560px`, aside
`flex: 1 1 260px`, `align-items: flex-start`.

**Hero**: full-width image/video area, `height: min(52vw, 420px)`, `min-height: 240px`.

**Main column, top to bottom:**
1. Category row: small icon (16px, `stroke: #8a9678`) + label (12px, uppercase, letter-spacing 1px,
   `color: #8a9678`, weight 500)
2. Title: Playfair Display, 37px, weight 600, `color: #4a3222`, `line-height: 1.22`
3. Byline: `"By the WellWithHer Editors · 6 min read"` — 13px, `color: #9c8f78` (our `secondary.main`)
4. Body copy: 17px, `line-height: 1.85`, `color: #4a3a2c` (a fourth text tone, distinct from both
   `text.secondary` and `BODY_TEXT_COLOR` — not yet a theme token; add one when this ticket starts)
5. A centered pull-quote block appears mid-body: Parisienne script, 23px, `color: #7c8a63`
   (`primary.dark`), `line-height: 1.5`, `margin: 14px 0`
6. CTA: `"Shop this pick →"` — pill button, `background: #4a3222`, `color: #f8f2ea`,
   `padding: 12px 22px`, `border-radius: 24px`, 13px, letter-spacing 0.4px. This is exactly the
   `MuiButton` `variant="contained" color="primary"` override already added in the design-alignment
   pass — reuse it as-is, don't hand-roll a new style.

**Aside (sticky, `top: 96px`):** card — `background: #fffaf3`, `border: 1px solid #e6dcc8`,
`border-radius: 12px`, `padding: 26px`, centered content:
- `LogoMark` size 52, no accent (`showAccent` omitted/false)
- Heading: `"About WellWithHer"` — Playfair Display, 17px, weight 600
- Body: `"We're a small team of writers and researchers sharing evidence-inspired wellness tips
  for women — on sleep, nutrition, and everyday balance."` — 14px, `BODY_TEXT_COLOR`,
  `line-height: 1.7`
- Link: `"Get in touch →"` — 13px, `color: primary.main`, links to `/contact`

This aside is a real, reusable rendering of `SiteInfo.asideContent` (the CMS-editable "about"
richtext) plus the static "Get in touch →" link — not literal hardcoded copy in the final
implementation; the heading/body above are what the *design* shows as its placeholder content.

## Contact page

`max-width: 820px`, centered.

**Header**: `"Get in Touch"` (Playfair Display, 34px, weight 600) + `"We'd love to hear from you."`
(Parisienne script, 22px, `primary.dark`).

**Two columns**, gap 44px: form (`flex: 2 1 360px`) + info sidebar (`flex: 1 1 220px`).

**Form**: name / email / message (textarea, 5 rows) — simple bordered inputs
(`border: 1px solid #d8cdb8`, `border-radius: 6px`, `background: #fffaf3`, `padding: 13px 16px`,
15px), submit button `"Send message"` (same dark-ink pill CTA style as the article buy button).

**Success state** (after submit): card — `"Thank you!"` (Playfair Display, 20px) +
`"We'll get back to you soon."` (14px, `BODY_TEXT_COLOR`).

**Sidebar**: `"Email"` label (11px, uppercase, `primary.main`) + `hello@wellwithher.com`; `"Follow"`
label + Pinterest/Instagram (no real URLs yet — same non-link treatment as the footer, per the
design-alignment pass's reasoning).
