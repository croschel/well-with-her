# WellWithHer: hosting and domain decision summary

> **Historical snapshot (2026-09-30).** Kept as the record of the cost comparison. Option B2
> (this Next.js app on Hostinger managed Node.js) later proved unviable, and the project moved to
> WordPress on Hostinger instead — see [README.md](README.md).

Handoff for Claude Code. This summarizes a planning conversation (Sep 30, 2026) about where to host the site and buy the domain. Use it to evaluate the options against the actual repo. Items marked **UNVERIFIED** were not confirmed and need a technical check.

## 1. Project context (already decided)

- Site: WellWithHer (`hercozygrowth.com`), a wellness article blog built for the user's wife. It captures Pinterest traffic and funnels readers to an external e-commerce site via a CTA button at the end of each article.
- Audience: **US readers**. The user is in Brazil and pays in BRL.
- Stack: Next.js (App Router) + TypeScript, Payload CMS 3.x mounted at `/admin` in the same project, Neon (external Postgres), Tailwind, atomic-design components.
- Routes: `/`, `/[category]/[pinId]/[slug]`, `/[category]`, `/contact`.
- Article fields: category, pinId, slug, mainArticleContent (rich text), buyButtonUrl, heroImage, galleryImages, videoEmbedUrl, ogImage, ogDescription, publishedAt. A `SiteInfo` global is shown on every article page.
- Revalidation: on-demand ISR. A Payload publish webhook calls `revalidatePath`. No time-based ISR.
- Access control: the wife's CMS access is restricted to the Articles collection and the SiteInfo global through Payload RBAC.
- Media storage: **still undecided** (bucket/adapter TBD).
- The site currently runs fine on Vercel preview URLs. The domain is not attached yet.

## 2. Question being answered

Where to buy the domain, whether to stay on Vercel, and what each hosting path costs in BRL, for a site that is monetized (CTA to e-commerce).

## 3. Findings

### Domain

- Buy the `.com` at **Cloudflare Registrar**: ~US$10.44/year, renewals at the same at-cost price. It requires Cloudflare DNS, which is fine.
- Porkbun is a close alternative (~US$1 more, keeps DNS flexibility).
- Avoid first-year promos with high renewals (Namecheap renewals ~US$14-17, GoDaddy-style jumps).
- Brazilian registrars in BRL for a `.com`: Hostinger R$29.99 first year then R$79.99, Superdomínios R$61.99/R$79.99, Homehost R$69/R$99. Registro.br only sells `.br` (`.com.br` ~R$40/year), which is irrelevant for a US audience.
- If DNS stays on Cloudflare pointing to Vercel, set the records to **DNS only (grey cloud)**, so Vercel handles SSL and caching.

### Vercel

- The Hobby (free) plan is **non-commercial only**. Per the pricing terms, ads, affiliate links and donations count as commercial. This site funnels to a store, so **Pro is required once it is live and promoted**.
- Pro is US$20/seat/month, with usage credit and 1 TB bandwidth included. Hobby is fine during development.
- Likely cost risk is image bandwidth and optimization, not compute. Offloading media to Cloudflare R2 (no egress fees) or Vercel Blob is recommended.

### Hostinger managed Node.js (user found this; confirmed on hostinger.com/pricing and /nodejs-hosting)

- **Unlimited** plan: US$3.99/mo on a 48-month term (US$191.52 paid upfront), renews at **US$16.99/mo**.
- Includes a free domain for 1 year, 50 GB NVMe, daily backups, CDN, WAF/DDoS, SSL, Node.js, and a dedicated Next.js hosting page with GitHub/GitLab deploy.
- Compare-table specs (shared): 3 GB RAM, 2 CPU cores. "Unlimited" features fall under the Fair Usage Policy.
- Managed DB offered is MySQL. The project would keep **Neon Postgres**.
- 30-day money-back guarantee is advertised.

## 4. Options and costs

Assumptions: USD/BRL 5.50 + 3.5% IOF (effective ~5.69 per USD). Card issuer spread not included. Prices as of Sep 2026 and subject to change.

| Option                                                                                                                                   | Month                              | Year                                 | 3 years                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| **A.** Vercel Pro + Cloudflare domain                                                                                                    | ~R$119                             | ~R$1,426                             | ~R$4,277                                                                             |
| **B.** Same Next.js site on Hostinger VPS KVM 1 (R$29.99/mo promo for 24 months, renews R$59.99; ~R$720 upfront) + Cloudflare CDN/domain | ~R$35 first 24 months, ~R$65 after | ~R$419, then ~R$779                  | ~R$1,618                                                                             |
| **B2.** Same Next.js site on Hostinger managed Node.js Unlimited (US$191.52 upfront ~R$1,090, free domain year 1)                        | ~R$23                              | ~R$273 year 1, ~R$332 after (domain) | ~R$940, then ~R$97/mo after 48 months                                                |
| **C.** Rebuild in WordPress on Hostinger Premium (48 months, R$10.99/mo)                                                                 | ~R$11 (no paid plugins)            | ~R$132 year 1, ~R$212 after          | ~R$556 without paid plugins, ~R$3,218 with Rank Math Pro + Elementor Pro (~R$887/yr) |

Context: the wife's tutor teaches Pinterest marketing with Hostinger + WordPress, which is why C was priced. The user does **not** want to change the custom site.

### Leaning so far

- Domain at Cloudflare, DNS-only records.
- Host on Vercel Pro at launch (best DX, previews, CDN, ISR just works), unless the technical review below shows B/B2 is viable.
- B2 is the cheapest way to keep the custom site, but it is unproven for this stack.

## 5. WordPress migration reality check (option C)

Almost none of the code migrates (React/Next/TS do not run in WordPress). Reusable: design tokens, CSS/Tailwind classes, SVG icons, markup from the HTML prototype, content model, URL structure, SEO decisions. Estimated 5-15% literal code reuse.

| Current                      | WordPress equivalent                              |
| ---------------------------- | ------------------------------------------------- |
| Articles collection          | Custom Post Type + ACF fields                     |
| category                     | Taxonomy                                          |
| `/[category]/[pinId]/[slug]` | Custom rewrite rules                              |
| Rich text                    | Gutenberg                                         |
| videoEmbedUrl                | Native oEmbed                                     |
| ogImage/ogDescription        | SEO plugin (Rank Math or Yoast)                   |
| SiteInfo global              | ACF options page or reusable pattern              |
| Payload RBAC                 | WP roles, plus a plugin or code to restrict menus |
| Atomic components            | Template parts, patterns, blocks                  |
| ISR + webhook                | Not needed (PHP rendering + page cache)           |
| Design tokens                | `theme.json` (block theme)                        |

Paths: classic PHP theme (closest to current dev workflow), block theme, Elementor (no code reuse), or headless WordPress (keeps Next.js but pays for both hosts, so it defeats the purpose).

## 6. What Claude Code should check in the repo

Evaluate feasibility of B / B2 versus staying on Vercel (A). Please inspect and report:

1. Next.js and Payload versions, `next.config` (output mode, `images` config/remote patterns), and whether `output: 'standalone'` is workable.
2. Where ISR is used: the `revalidatePath` webhook route, any `revalidate`/`fetch` cache options, and whether anything depends on Vercel-specific behavior (Edge runtime, middleware, Vercel Blob/Analytics/Edge Config, cron).
3. `next/image` usage (sharp requirement, optimization on a shared Node host) and the plan for media storage (R2 vs filesystem vs Vercel Blob) with a Payload storage adapter.
4. Build memory and time. Would `next build` with Payload fit in ~3 GB shared RAM, or should it be built in CI (GitHub Actions) and shipped?
5. Neon region and Postgres connection handling (pooling, serverless vs long-running driver) if the app moves from Vercel functions to a long-running Node process.
6. Environment variables and secrets required, and the webhook URL changes needed when the production domain is attached.
7. Any dependence on Vercel preview URLs for staging, and what a staging flow would look like elsewhere.
8. Admin (`/admin`) performance expectations for a non-technical editor.

## 7. Open items (UNVERIFIED)

- Whether Hostinger managed Node.js supports the full feature set used here (SSR, on-demand revalidation, image optimization, Payload 3 admin), and its server location options (a US datacenter is preferred).
- How many Node.js "Web Apps" the Unlimited plan allows (the compare table shows a "Web Apps" row that was unclear).
- Whether the Premium plan (US$2.99/mo) can run Node.js apps.
- Brazilian checkout price in BRL for the Node.js plan. A coupon site listed "from R$13.99/mo" (unofficial).
- Neon and R2 free-tier limits at expected traffic.
- Real-world cost of Vercel image bandwidth for an image-heavy Pinterest-driven blog.

## 8. Related deliverable

A visual comparison for the wife (cost, quality, maintainability, strengths and weaknesses for options A, B and C) exists as `comparativo-opcoes-site.html`, with an editable USD/BRL rate. It does **not** yet include option B2.
