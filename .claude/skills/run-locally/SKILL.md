---
name: run-locally
description: >-
  Bring the WellWithHer Next.js + Payload CMS app up locally against the
  live Neon database: env check, DB reachability, next dev, the admin
  panel, and seeding/restoring sample content. Use when asked to start
  the dev server, run the project locally, set up a fresh clone, or
  troubleshoot why local dev isn't working.
---

# run-locally

## 1. Check the environment file

```bash
test -f .env && echo "exists" || cp .env.example .env
```

Required for anything to work: `DATABASE_URI` (Neon pooled connection string) and `PAYLOAD_SECRET`
(any non-empty string locally — see `vercel-deploy-checklist.md` for why production needs a real
generated one, not the placeholder). Everything else in `.env.example` is optional and gated —
blank env vars for Pinterest/GA4/etc. just mean those features render nothing, not an error.

If `.env` is missing `DATABASE_URI` entirely and there's no Neon project linked yet, this is a
first-time setup, not a "run locally" problem — see the Neon CLI: `neon link` (interactively picks
the org/project/branch and writes `.neon` + pulls env). This project's Neon project is
`plain-flower-68266193`, branch `production` — there's no separate dev/staging branch, the same DB
backs local dev, CI, and (per the Vercel checklist) every Vercel environment for now.

## 2. Confirm the database is reachable

```bash
neon psql -- -c "\dt"
```

Should list `articles`, `articles_rels`, `_articles_v`, `_articles_v_rels`, `contact_messages`,
`media`, `payload_kv`, `payload_locked_documents(+_rels)`, `payload_migrations`,
`payload_preferences(+_rels)`, `site_info`, `users`, `users_sessions`. If `psql` isn't on `PATH`,
the `neon` CLI transparently falls back to an embedded TypeScript psql — that's expected, not an
error.

## 3. Start the dev server

```bash
npm run dev
```

Next 16 uses Turbopack by default — no flag needed. If Turbopack and Payload's admin bundle ever
conflict (hasn't happened in this project's history, but Payload + Turbopack interactions are
still maturing upstream), fall back with `next dev --webpack` as a temporary workaround, not a
permanent config change.

**First boot pushes schema.** Any real Payload boot in dev mode (`next dev`, `payload run <script>`)
runs a drizzle-kit schema push against the live DB — you'll see "Pulling schema from database" in
the terminal. This is normal and is how schema changes actually land (see `add-payload-field`) —
`next build` alone never does this.

## 4. Sign in / create the first admin user

Visit `/admin`. If no user exists yet, Payload shows a "Create first user" screen — pick any
email/password, this is a real credential for the live DB, not a seed value (seeding never creates
users). If a user already exists, sign in normally; ask whoever set up the project for credentials
rather than trying to recreate the first-user flow.

## 5. Seed or check sample content

```bash
npm run seed
```

Idempotent — safe to re-run any time. Looks up existing rows by a stable key (`pinId` for
articles, `alt` text for media) before creating anything, so re-running after a schema change or a
partial failure won't duplicate content. If you need to verify what's actually in the DB rather
than assume the seed worked:

```bash
neon psql -- -c "SELECT id, title, pin_id, category FROM articles;"
```

## 6. Verify the app itself

- `/` — home page, hero image, category nav, latest articles
- `/sleep` (or any category) — category grid
- `/wellness/pin001/five-minute-morning-reset` (or whatever the seed produced) — full article page
- `/contact` — contact form
- `/admin` — CMS, Live Preview should work on an Article edit screen

## Common issues

- **Blank/broken images** — `BLOB_READ_WRITE_TOKEN` isn't required for local dev (media falls back
  to local disk storage), but if it's set to an invalid value, uploads/reads can fail. Unset it
  locally unless you specifically need to test against real Vercel Blob storage.
- **"the page is stale" after an edit** — Payload's `afterChange`/`afterDelete` hooks call
  `revalidatePath` automatically for article/category/home paths in a real request context. If
  you're driving changes through a bare script (not `next dev`'s request context), revalidation is
  silently skipped by design — see `revalidateArticlePaths`'s try/catch and its reasoning. That's
  expected for scripted writes, not a bug.
- **`next typegen` / route-type errors** — `npm run typecheck` runs `next typegen && tsc --noEmit`.
  If you're seeing stale `PageProps<...>` type errors after adding a new route, that's almost
  always a typegen-not-yet-run issue, not a real type error — just re-run `npm run typecheck`.
