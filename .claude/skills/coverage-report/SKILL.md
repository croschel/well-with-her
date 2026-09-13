---
name: coverage-report
description: >-
  Run the WellWithHer test suite with coverage and report exactly which
  files are under threshold and which specific branches/lines are
  uncovered, ranked by how much writing that test would move the
  number. Use when asked for a coverage report, to check test coverage,
  to find untested code, or to get the suite back to 100%.
---

# coverage-report

## 1. Run it

```bash
npm run test:coverage
```

This is `vitest run --coverage` — thresholds are set in `vitest.config.ts`
(`statements`/`branches`/`functions`/`lines`, all 90%). The command **fails the process** if any
threshold isn't met, so a clean exit already means the floor is cleared; the interesting work is
usually pushing specific files from "covered enough" to "actually fully covered."

## 2. Read the per-file table

Vitest only prints a row for files below 100% on at least one metric — a fully clean run prints an
empty table between the header rules, which is the expected steady state for this project (every
merged ticket has shipped at 100% on its new/changed files). If you see any rows at all, something
regressed or a new file's tests are incomplete.

For each row, the `Uncovered Line #s` column names exact line numbers — go straight to those, don't
guess. Common real patterns from this codebase's own history:

- **A branch of an `??`/`?.` fallback never exercised** — e.g. `formData.get("name") ?? ""`'s
  fallback only fires when a field is entirely absent from the FormData, not just empty-string;
  a test that always calls `.set()` for every field never hits it. Fix: one test that constructs
  `FormData` with a key genuinely omitted.
- **One arm of a small set of parallel block-type converters never rendered** — e.g. `ArticleBody`
  wiring 4 Lexical block converters (`imageBlock`/`galleryBlock`/`videoEmbedBlock`/`ctaBlock`) but
  only one type getting exercised by existing tests. Fix: one test per block type, not just one for
  the whole converter map.
- **A CI-only or once-per-file top-level `const` read from `process.env`** — e.g.
  `AnalyticsScripts`'s env-gated scripts. These need `vi.resetModules()` + a dynamic `await
  import(...)` per test case to actually re-evaluate the module with a different env value; a
  plain re-import after mutating `process.env` won't retrigger the top-level read.
- **The "everything is missing" edge case of several independent validations** — e.g. a form
  validator that checks 3 fields independently; a test with all 3 empty/invalid at once closes
  every remaining branch in one shot rather than needing 3 separate near-duplicate tests.

## 3. Prioritize

Rank by branches-closed-per-test, not file size:

1. A single test that closes an entire row (e.g. the "all fields missing" case above) — highest
   value, do these first.
2. Files with only 1-2 uncovered lines — usually one missing test case, fast to identify and fix.
3. Files with many uncovered lines — usually means a whole code path (an error branch, an entire
   block type) was never exercised at all; needs a real new test, not a tweak to an existing one.

## 4. Where new tests belong

Follow the mirror convention (`add-component` skill has the full rule) —
`src/foo/bar.ts → src/__tests__/foo/bar.test.ts`. Don't add coverage by testing implementation
details through a back door; test the same public behavior real callers rely on.

## 5. Re-run and confirm

```bash
npm run test:coverage
```

Confirm the summary block reads 100% across all four metrics before considering this done — see
step 2 on why anything less isn't this project's actual bar, even though the configured threshold
is 90%.
