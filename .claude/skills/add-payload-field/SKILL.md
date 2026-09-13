---
name: add-payload-field
description: >-
  Safely add or change a field on an existing Payload collection/global
  (Articles, SiteInfo, ContactMessages), or add a brand-new collection,
  in the WellWithHer app — covering the collection config, the
  dev-mode-only schema push to the live Neon database, type generation,
  and updating the mapper/interface/renderer chain. Use when asked to
  add a field to Articles or SiteInfo, change the CMS schema, or add a
  new Payload collection.
---

# add-payload-field

The single most error-prone recurring task in this stack — this app has **no migrations**, schema
changes only push in dev mode, and it's easy to change the collection config, forget to push, and
have the app fail at runtime instead of build time. Follow every step in order.

## 0. Which kind of change is this?

- **New field on an existing collection/global** (`src/collections/Articles.ts`,
  `src/globals/SiteInfo.ts`) — go to §1.
- **Brand-new collection** — do §1's field edits in a new `src/collections/<Name>.ts` file, then
  **also** register it in `payload.config.ts`'s `collections: [...]` array (see how
  `ContactMessages` was added — this step is easy to forget and the collection silently won't
  exist without it).

## 1. Edit the collection/global config

Fields follow Payload's field config API (`type: "text" | "email" | "select" | "upload" | ...`).
Match this project's existing style:

- `required: true` on anything the frontend assumes exists (avoids `| null` everywhere downstream).
- `admin: { description: "..." }` for anything non-obvious to an editor (see `pinId`'s description
  explaining it must match the live Pinterest pin).
- For a genuinely new collection, decide `access` deliberately, don't just accept Payload's
  wide-open defaults:
  - If only this app's own server code should ever write to it (a Server Action via the Local
    API), set `access.create: () => false` to close the public REST/GraphQL create endpoint
    against spam — the Local API **bypasses `access` control by default**, so this doesn't break
    your own Server Action. See `ContactMessages.ts` for the real pattern and reasoning.
  - `read`/`delete` typically gate on `req.user` (logged-in editors) or `req.user?.role === "admin"`.

## 2. Push the schema to the live Neon DB — dev mode only, and easy to skip by accident

**`npm run generate:types` does NOT push schema to Postgres.** It only regenerates
`payload-types.ts` from the config. The actual schema push (drizzle-kit's "Pulling schema from
database" step you'll see in the terminal) only happens when Payload actually boots in dev mode:

```bash
npm run seed        # simplest — re-runs the (idempotent) seed script, which boots Payload
# or:
npx payload run scripts/<any-throwaway-script>.ts   # any real Payload boot works
# or: next dev, if you're going to be iterating live anyway
```

`next build` **never** pushes schema (production mode). If you only ever run `next build`/CI
after a schema change with no local `npm run seed` in between, the live DB won't have the new
column/table and the app will error at *runtime*, not build time.

Verify it actually landed:

```bash
neon psql -- -c "\d <table_name>"       # confirm the new column/table exists
# or, for a new collection:
neon psql -- -c "\dt"                   # confirm the new table exists
```

## 3. Regenerate types

```bash
npm run generate:types
```

Check the diff in `payload-types.ts` — confirm the new field/collection actually appears with the
type you expect (Payload infers types from the field config; a `select` field with no explicit
union becomes a bare `string`, for instance).

## 4. Update the domain layer

In order, each depending on the last:

1. **`src/models/interfaces/<domain>.ts`** — add the field to the domain interface (name it
   whatever the *frontend* should call it; it doesn't have to match Payload's field name, though
   it usually does for simplicity).
2. **`src/services/mappers/<domain>Mapper.ts`** — map the new Payload field onto the domain field.
   Existing tests with `toEqual(...)` fixtures for this mapper's output will now fail if they don't
   include the new field — update those fixtures, don't just add a new isolated test.
3. **Any consuming renderer/component** — actually use the new field where it belongs.

## 5. Verify end to end

```bash
npm run run-checks   # lint, typecheck, test:coverage — fixes the stale-fixture failures from §4.2
npm run build         # confirms the build still succeeds against the live DB (see run-locally / CI's DB strategy)
```

For a genuinely new collection or a write path, verify the actual create/read/delete against the
live Neon DB with a throwaway `payload run <script>.ts` (see `add-service`'s §5) before considering
this done — type-correctness doesn't guarantee the live schema actually matches.

## Common mistakes this skill exists to prevent

- Editing the collection config, regenerating types, and forgetting §2 entirely — the app then
  typechecks fine locally but breaks at runtime against the real (unpushed) database.
- Adding a new collection but forgetting to register it in `payload.config.ts`'s `collections`
  array — Payload silently doesn't expose it at all, no error.
- Leaving a new collection's `access` at Payload's wide-open defaults when only your own Server
  Action should ever write to it.
