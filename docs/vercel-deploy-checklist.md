# Vercel deploy checklist (Ticket 12)

Connecting this repo to Vercel requires your Vercel account — this is the part of Ticket 12 that
has to happen in the Vercel dashboard by hand. Everything below is what to do and why; nothing here
needs code changes on top of what's already merged.

**Databases are now split (2026-09-18 incident).** Every Vercel environment used to point at the
same single Neon `production` branch — an intentional pre-launch simplification, but it stopped
being safe the moment real content existed: a database restore taken while debugging a Preview
deployment rolled back the live site the wife actually uses. Recovered from a Neon-preserved
pre-rollback branch; see `docs/implementation-plan.md` for the incident writeup. Going forward:

- **`production`** branch — real content only. Used **exclusively** by the Vercel **Production**
  environment (the live site). Nothing else — no local dev, no CI, no Preview deployments — should
  ever hold a connection string pointing at it.
- **`development`** branch — a Neon branch forked from `production`, used by local dev, CI
  (`CI_DATABASE_URI`), and Vercel **Preview**/**Development** environments. Writes here (seed
  scripts, schema pushes, manual testing, restores) can't touch real content.

## 1. Import the repo

1. In the Vercel dashboard: **Add New → Project → Import** `croschel/well-with-her`.
2. Framework preset: Vercel should auto-detect **Next.js** — leave build/output settings at their
   defaults (`next build`, no custom output directory). Root directory: repo root (this is a single
   app, not a monorepo).
3. Don't click Deploy yet — set the environment variables first (§2), or the first build will fail
   on a missing `DATABASE_URI`.

## 2. Environment variables

Project Settings → Environment Variables. `DATABASE_URI` now differs by environment — see the
database-split note above; everything else applies to **all three environments** (Production,
Preview, Development) unless noted otherwise.

| Variable | What to set | Why |
|---|---|---|
| `DATABASE_URI` | The `production` branch's connection string for **Production only**; the `development` branch's connection string for **Preview and Development** | Keeps real content isolated from anything a dev/CI/preview run could do to it |
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
PR previews now read/write the **`development`** branch (§ database-split note above) — opening a
preview link can no longer touch real content, which is exactly the isolation the 2026-09-18
incident showed was missing.

## 6. Pinterest Rich Pin validator

Once a real article URL is live, run it through Pinterest's own URL debugger tool (search "Pinterest Rich Pin validator" /
"Pinterest URL debugger" from their developer docs if this link has moved) to confirm the OG tags
and JSON-LD this project already ships (Ticket 6) produce a proper Rich Pin. Nothing to build here —
this step is pure verification of what's already shipped.

## Operational note: schema changes after this point

`next build` (what Vercel runs) never pushes schema changes to Postgres — only a real Payload boot
in dev mode does (`npm run seed`, or `next dev`), a behavior already documented in Ticket 1. Once
this is deployed, **any future collection/field change needs its schema pushed twice, separately**:
once against the `development` branch's `DATABASE_URI` (to unblock local dev/CI/Preview), and again
against the **`production`** branch's `DATABASE_URI` (to unblock the live site) — there is no longer
one shared database that a single local push covers. Do the production push deliberately, right
before or after merging; Vercel's build will not do this for you, and a mismatched schema will error
at runtime, not at build time (this is exactly what broke PR #25's CI build on 2026-09-18).
