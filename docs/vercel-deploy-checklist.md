# Vercel deploy checklist (Ticket 12)

Connecting this repo to Vercel requires your Vercel account — this is the part of Ticket 12 that
has to happen in the Vercel dashboard by hand. Everything below is what to do and why; nothing here
needs code changes on top of what's already merged.

**Scope for now: QA-only.** No custom domain, no separate staging database — every Vercel
environment (Production, Preview, Development) points at the same single Neon `production` branch
this project has used all along. That's an intentional simplification for the pre-launch phase, not
an oversight — revisit when the site is actually taking real traffic.

## 1. Import the repo

1. In the Vercel dashboard: **Add New → Project → Import** `croschel/well-with-her`.
2. Framework preset: Vercel should auto-detect **Next.js** — leave build/output settings at their
   defaults (`next build`, no custom output directory). Root directory: repo root (this is a single
   app, not a monorepo).
3. Don't click Deploy yet — set the environment variables first (§2), or the first build will fail
   on a missing `DATABASE_URI`.

## 2. Environment variables

Project Settings → Environment Variables. Apply everything below to **all three environments**
(Production, Preview, Development) unless noted otherwise — see the QA-only note above for why.

| Variable | What to set | Why |
|---|---|---|
| `DATABASE_URI` | Same Neon connection string already in local `.env` | Same DB for every environment right now |
| `PAYLOAD_SECRET` | **A new, randomly generated secret** — do not reuse the local `local-dev-secret-change-me` placeholder | Signs Payload's admin session tokens; a real deployment needs a real secret |
| `REVALIDATE_SECRET` | **A new, randomly generated secret** — same reasoning as above | Protects the manual `/api/revalidate` escape hatch |
| `BLOB_READ_WRITE_TOKEN` | Don't set manually | Add the **Vercel Blob** storage integration to this project first (Storage tab → Create → Blob) — it injects this automatically |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for the very first deploy, come back after (see §3) | Needed for canonical URLs, OG tags, and JSON-LD to resolve correctly |
| `PINTEREST_DOMAIN_VERIFY_CODE` | Leave blank | Only needed once a real Pinterest business account is connected |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Leave blank | Only needed once GA4 is actually set up |
| `NEXT_PUBLIC_PINTEREST_TAG_ID` | Leave blank | Only needed once the Pinterest conversion tag is actually set up |

Generate a random secret however you like — e.g. `openssl rand -base64 32` in a terminal.

## 3. First deploy, then set the real site URL

1. Deploy. Vercel gives you a `*.vercel.app` URL once it finishes.
2. Go back to Environment Variables and set `NEXT_PUBLIC_SITE_URL` to that URL (`https://<your-project>.vercel.app`, no trailing slash).
3. Redeploy (Deployments tab → the latest deployment → **Redeploy** — no new commit needed).

## 4. Verify the deploy

- [ ] `/` (home), a category page, and an article page all load and show real content
- [ ] Images load correctly (confirms the Vercel Blob storage integration is wired)
- [ ] `/admin` loads and you can log in
- [ ] `/sitemap.xml` and `/robots.txt` both return real content, not errors
- [ ] View source on an article page — canonical URL, OG tags, and the JSON-LD script all show the
      real `*.vercel.app` URL, not `localhost:3000` (confirms step 3 worked)

## 5. Verify preview-per-PR

This should work automatically once the repo is connected — no extra setup. Open (or reopen) any
PR against `main` and confirm Vercel posts a preview deployment link as a check/comment on it.
Note: PR previews write to and read from the **same** database as production right now (§ scope
note above) — don't worry about isolating this until the site has real traffic to protect.

## 6. Pinterest Rich Pin validator

Once a real article URL is live, run it through Pinterest's own URL debugger tool (search "Pinterest Rich Pin validator" /
"Pinterest URL debugger" from their developer docs if this link has moved) to confirm the OG tags
and JSON-LD this project already ships (Ticket 6) produce a proper Rich Pin. Nothing to build here —
this step is pure verification of what's already shipped.

## Operational note: schema changes after this point

`next build` (what Vercel runs) never pushes schema changes to Postgres — only a real Payload boot
in dev mode does (`npm run seed`, or `next dev`), a behavior already documented in Ticket 1. Once
this is deployed, **any future collection/field change still needs its schema pushed by running
`npm run seed` (or any `payload run` script) locally against the same `DATABASE_URI`** before (or
right after) merging — Vercel's build will not do this for you, and a mismatched schema will error
at runtime, not at build time.
