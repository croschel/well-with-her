---
name: add-component
description: >-
  Scaffold a new React component (atom, molecule, or organism) for the
  WellWithHer Next.js app, following this project's exact conventions:
  arrow-function named exports, MUI `sx` (never `styled`), labels pulled
  from a co-located `constants.ts`, MUI v9's `Grid` API, and a mirrored
  Vitest test file under `src/__tests__/`. Use when asked to create a new
  component, add a UI piece, build an atom/molecule/organism, or scaffold
  a React component in this repo.
---

# add-component

Scaffolds one new component with this project's real, established conventions — every rule below
is copied from an actual file already in the codebase, not a guess.

## 1. Decide the tier

- **Atom** — a single, self-contained UI primitive with no business logic beyond presentation.
  Example: `src/components/atoms/BuyButton/index.tsx` (one `<Button component="a">`, a couple of
  props). If it needs client-only browser APIs (`useSearchParams`, `useState`), it can still be an
  atom — see `BuyButton`'s own Suspense-wrapped client boundary for a real example.
- **Molecule** — composes a couple of atoms/primitives into one reusable, still-generic unit.
  Example: `src/components/molecules/ArticleCard/index.tsx` (a `Card` combining an image, category
  label, title, and a "Read more" link), `src/components/molecules/ImageGallery/index.tsx`.
- **Organism** — a distinct, often page-section-sized piece, frequently composing molecules/atoms
  and sometimes owning real logic (data fetching props, hooks, effects). Examples:
  `SiteHeader`, `ArticleBody` (wires Lexical `RichText` to 4 block renderers),
  `ContactForm` (owns a Server Action + `useActionState`), `UtmTracker` (headless, renders `null`).

If genuinely unsure, err toward **molecule** for anything combining 2+ visual pieces, and
**organism** for anything that's really "a section of a page."

## 2. File layout

Minimum is just `index.tsx`. Add `constants.ts` only when there's user-facing copy (labels, error
messages, headings) to pull out — never hardcode strings inline when there's more than one.
Add `types.ts` only when the component's props/local types are non-trivial (see `ContactForm`,
which also has an `actions.ts` for its Server Action — that pattern is specific to
`useActionState`-driven forms, not a general rule).

```
src/components/<tier>/<ComponentName>/
├── index.tsx        # always
├── constants.ts      # only if there's copy to extract
└── types.ts           # only if props/local types are non-trivial
```

Sub-components that only make sense nested under a parent (e.g. `ArticleBody`'s 4 block renderers)
go in a `blocks/` (or similarly named) subfolder next to that parent's `index.tsx` — see
`src/components/organisms/ArticleBody/blocks/`.

## 3. `index.tsx` conventions

- **Arrow function, named export — never a default export, never `function ComponentName() {}`.**
  ```tsx
  export const ComponentName = ({ prop }: ComponentNameProps) => (
    <Box>...</Box>
  );
  ```
- **Props interface** named `<ComponentName>Props`, defined either inline in `index.tsx` (the
  common case) or in `types.ts` if it's shared with a sibling file (e.g. an `actions.ts`).
- **Styling is always `sx`, never `styled()` or a separate CSS file.** Reuse theme tokens
  (`"primary.main"`, `"text.secondary"`, `"background.paper"`) over hardcoded hex — check
  `src/theme/palette.ts` first; only reach for a raw hex value when the design genuinely needs a
  4th tone the theme has no slot for (see `ARTICLE_BODY_TEXT_COLOR`'s comment in `palette.ts` for
  the reasoning on when that's justified).
- **MUI v9's `Grid` uses the `size` prop, not `item`/breakpoint props directly:**
  ```tsx
  <Grid container spacing={4.5}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>...</Grid>
  </Grid>
  ```
  (See `SiteFooter/index.tsx` for a real 4-column responsive layout using this.)
- **`Stack`'s `alignItems`/`justifyContent` go through `sx`, not as direct props** — MUI v9 removed
  them as top-level `Stack` props. `direction`/`spacing` still work directly.
- **Internal links use the `NextLink` atom** (`src/components/atoms/NextLink/index.tsx`), never
  `next/link` directly — it's a `'use client'` re-export, because passing `next/link` straight into
  a MUI `component` prop from a Server Component throws "Functions cannot be passed directly to
  Client Components." External links (buy buttons, affiliate links) are a plain `<a>` via
  `component="a"` with `target="_blank" rel="noopener sponsored"` — see `BuyButton`.
- **Never pass a function as an `sx` value on a component a Server Component might render** — e.g.
  `sx={{ transition: (theme) => ... }}`. It breaks Server→Client prop serialization in a real
  `next build` even though `next dev` won't catch it (bit the project once in the design-alignment
  pass — use a plain CSS string instead).
- **If the component needs `useSearchParams()`, `useActionState()`, or any hook requiring a
  Suspense boundary or client runtime**, wrap it internally (see `BuyButton`'s
  `<Suspense fallback={...}><InnerComponent /></Suspense>` pattern) so *callers* never need to
  think about it.

## 4. Test file

Mirror path, **not** colocated:

```
src/components/molecules/ArticleCard/index.tsx
  → src/__tests__/components/molecules/ArticleCard.test.tsx

src/components/organisms/ContactForm/index.tsx        (has actions.ts, types.ts too)
  → src/__tests__/components/organisms/ContactForm/index.test.tsx
  → src/__tests__/components/organisms/ContactForm/actions.test.ts
```

Use the nested-folder form only when the component itself has sibling files worth testing
separately (actions, sub-block renderers); otherwise use the flat `<Name>.test.tsx` form.

Testing Library + `@testing-library/user-event` for interaction. `vitest.setup.ts` already
provides global `afterEach(cleanup)` and a default `useSearchParams` mock (empty
`URLSearchParams`) — override the latter per-test with
`vi.mocked(useSearchParams).mockReturnValue(...)` only when the component's behavior actually
depends on query params.

If the component uses `useActionState` (a form), don't try to drive a real `<form>` submission in
jsdom — React 19's form-action mechanism isn't reliably submittable there. Mock `useActionState`
itself to test each state (idle/error/success) directly; test the actual Server Action logic in
its own separate, non-component test file. See `ContactForm`'s two test files for the real split.

## 5. Verify

```bash
npm run typecheck && npm run lint && npm run test:coverage
```

New files must not drop overall coverage below the 90% threshold in `vitest.config.ts` — this
project has consistently shipped every ticket at 100% on new/changed files; match that bar.
