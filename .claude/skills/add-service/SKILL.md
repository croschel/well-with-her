---
name: add-service
description: >-
  Add a new domain data-access slice to the WellWithHer app end to end:
  model interface + enum + barrel exports, a services/<domain>.ts data
  layer, its mapper, and only a TanStack Query layer if the feature is
  genuinely client-interactive. Use when asked to add a new domain/data
  type, wire up a new Payload collection's read side, or add a
  "service" for something in this repo.
---

# add-service

Adds one domain data-access slice, matching the real pattern used by `articles`, `siteInfo`, and
`contactMessages` in this codebase.

## 1. Domain model (`src/models/interfaces/<domain>.ts`)

Plain TypeScript interfaces describing the *domain* shape — not Payload's generated shape. Keep
richtext fields loose (`Record<string, unknown>`, see `RichTextContent` in `article.ts`) — the
domain layer shouldn't commit to Lexical's exact node structure; a renderer types it precisely
where it's actually consumed.

```ts
// src/models/interfaces/<domain>.ts
export interface <Domain> {
  id: string;
  // ...fields, in the shape components actually want, not Payload's raw doc shape
}
```

Add enums to `src/models/enums/` only for genuinely closed, small value sets (see
`models/enums/category.ts`). Update both barrels:

```ts
// src/models/interfaces/index.ts
export type { <Domain> } from "./<domain>";
// src/models/enums/index.ts  (plain export, not `export type`)
export { <SomeEnum> } from "./<someEnum>";
```

## 2. Mapper (`src/services/mappers/<domain>Mapper.ts`)

One pure function per mapping direction, Payload doc → domain model. Never call Payload or fetch
anything here — pure in, pure out, 100%-unit-testable.

```ts
import type { <Domain> } from "@/models/interfaces";
import type { <Domain> as Payload<Domain> } from "../../../payload-types";

export const map<Domain> = (doc: Payload<Domain>): <Domain> => ({
  id: String(doc.id),
  // ...
});
```

For `upload`-type relation fields, reuse `resolveMediaAsset` / `resolveOptionalMediaAsset` /
`resolveMediaAssetList` from `services/mappers/mediaMapper.ts` — they throw loudly if a relation
comes back as a raw numeric ID instead of a populated document, which means a service forgot to
pass a sufficient `depth` option. That's a deliberate fail-fast, not a bug to work around.

## 3. Service (`src/services/<domain>.ts`)

Thin, one function per operation, using `getPayloadClient()` from `services/payloadClient.ts`
(never construct a Payload client any other way):

```ts
import { getPayloadClient } from "./payloadClient";
import { map<Domain> } from "./mappers/<domain>Mapper";

export const list<Domain>s = async (): Promise<<Domain>[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({ collection: "<slug>", depth: 1 });
  return result.docs.map(map<Domain>);
};
```

Real gotchas already hit in this codebase, worth checking against before assuming a query will
just work:

- **Native Postgres enum columns** (e.g. `Article.category`) have no `contains`/`ilike` operator —
  only exact `equals` matches. See `services/articles.ts`'s `search()` for the real workaround
  (exact match against a known enum value, only when the search term matches one).
- **`select`** trims the query to exactly the fields a caller needs (see `listPublishedRefs`'s
  `{ category: true, pinId: true, slug: true, publishedAt: true }`) — cheaper than fetching whole
  docs when only route-identity fields are needed.
- If a collection should only expose published rows to anonymous readers, that's an `access.read`
  rule on the *collection* (see `Articles.ts`), not something to filter for in the service layer.

## 4. TanStack Query — only if this is genuinely client-interactive

**`@tanstack/react-query` is installed but not yet wired into the app.** There's no
`QueryClientProvider` in `AppProviders.tsx` yet and `src/queries/` is empty. The plan's intended
boundary (see implementation-plan.md §6): Server Components fetch directly via the service layer
for anything server-rendered; TanStack Query is reserved for state that's genuinely
client-driven and needs caching/refetching *in the browser* — the concrete planned example is
`NavSearch` (currently UI-only, see its own top-of-file comment) becoming query-driven once search
actually calls `services/articles.search()`.

**Do not add a query layer reflexively for a new domain just because one exists for others.** Only
add `src/queries/<domain>/{queryKeys.ts,queries.ts}` when the feature is:
1. Rendered from a Client Component, not a Server Component, and
2. Needs client-side caching, background refetch, or is driven by user input after the initial
   page load (a search box, a "load more" button — not a page's initial data).

If this is the *first* time the query layer is actually wired up, that also means adding
`QueryClientProvider` (with a `queryClient.ts` singleton) to `AppProviders.tsx` — check whether
that's still missing before assuming it exists.

## 5. Tests

Mock `services/payloadClient.ts`'s `getPayloadClient`, not the Payload SDK itself — see
`src/__tests__/services/articles.test.ts` for the real pattern:

```ts
vi.mock("@/services/payloadClient", () => ({ getPayloadClient: vi.fn() }));
// ...
const mockFind = vi.fn();
beforeEach(() => {
  vi.mocked(getPayloadClient).mockResolvedValue({ find: mockFind } as unknown as ...);
});
```

Test the mapper separately and directly (pure function, no mocking needed) — see
`src/__tests__/services/mappers/articleMapper.test.ts`.

For a genuinely new write path (a Server Action, a Payload hook), verify it for real against the
live Neon DB with a throwaway `payload run <script>.ts` before considering the ticket done — mocked
unit tests alone don't catch schema/connection issues. Delete the throwaway script after.
