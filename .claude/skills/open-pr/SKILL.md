---
name: open-pr
description: >-
  Run the WellWithHer project's full ticket workflow: sync main, branch,
  implement, verify against the live Neon DB, commit in logical units,
  push, and open a PR with a detailed body — then update the Notion
  ticket tracker. Use when asked to open a PR, start a new ticket, ship
  a change following this repo's process, or when told "merged, please
  go on."
---

# open-pr

The exact loop this project has followed for every ticket. Each step matters — this workflow has
caught real bugs (stale test fixtures, schema-push gaps, Suspense requirements) that a "just
commit and push" approach would have missed.

## 0. Only after the previous ticket is actually merged

Never start new work on top of an unmerged ticket's branch. Wait for explicit merge confirmation.

## 1. Sync and clean up

```bash
git checkout main
git pull origin main
git branch -d <previous-ticket-branch>          # -D if GitHub squash-merged (branch --merged main
                                                  # won't recognize it, `git diff main...<branch>`
                                                  # showing no diff confirms it's safe)
git push origin --delete <previous-ticket-branch>  # often already auto-deleted by GitHub; a
                                                     # "remote ref does not exist" error here is fine
```

## 2. Branch, named for the actual change

`feat/<slug>` for new functionality, `fix/<slug>` for bug fixes, `docs/<slug>` for docs-only.

```bash
git checkout -b feat/<slug>
```

**Always branch before writing any code.** This project has twice accidentally committed straight
to `main` mid-session — both times caught and fixed only because nothing had been pushed yet
(`git branch <name>` to save the commit, `git branch -f main origin/main` to rewind). If a commit
ever lands on `main` by mistake, fix it the same way *before* pushing, not after.

## 3. Implement, verifying against the real thing as you go

- Check current Next.js/Payload/MUI behavior against `node_modules/*/dist/docs` or actual source
  when it matters (see `AGENTS.md` — this project's dependencies deliberately diverge from
  training-data assumptions in places; Next 16, MUI v9, and Payload 3's real APIs have all
  differed from naive expectations at least once).
- For anything touching data: verify against the **live Neon DB**, not just mocks. A throwaway
  `payload run <script>.ts` (delete it after) is the standard way to confirm a write path actually
  works — mocked unit tests alone have never caught a real schema/connection issue in this project.
- For anything touching rendering: `npm run build` and check the route listing (`●`/`○` static vs
  `ƒ` dynamic) — several tickets (UTM capture, sitemap) specifically needed to confirm a change
  didn't silently force a route dynamic.

## 4. Full check suite before committing

```bash
npm run run-checks   # lint && typecheck && test:coverage
npm run build         # against the live DB
```

Every ticket in this project has shipped at **100%** statements/branches/functions/lines on new
and changed files — the 90% threshold in `vitest.config.ts` is a floor, not a target. Chase down
the specific uncovered branch (`test:coverage`'s output names the exact uncovered line numbers)
rather than accepting "good enough."

## 5. Commit in logical units

Not one giant commit — split by concern (e.g. "shared building blocks" → "the organism that wires
them together" → "the route page" was one ticket's real 3-commit sequence). Each commit message
explains *why*, not just what changed; end every commit with:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

## 6. Document real findings

If anything surprising was discovered — a library behaving differently than expected, a gap the
original ticket scope didn't anticipate, a decision made along the way — add a "Discovered in
Ticket N" section to `docs/implementation-plan.md` (see the existing ones for the exact format)
and commit it separately as the last commit before pushing.

## 7. Push and open the PR

```bash
git push -u origin feat/<slug>
gh pr create --title "..." --body "$(cat <<'EOF'
## What changed
...
## Real findings
...
## How to test
...
## Screenshots
Not captured — no browser in this environment. Verified via <static build output / unit tests / a
live-DB script> instead.
## Checklist
- [x] Verified against the live Neon DB
- [x] `npm run run-checks` passes (lint, typecheck, 100% coverage)
- [x] `npm run build` succeeds
- [x] Implementation plan updated with real findings
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

(This body structure — What changed / Real findings / How to test / Screenshots / Checklist — is
this project's actual established pattern, a superset of `.github/PULL_REQUEST_TEMPLATE.md`.)

If the change touches a workflow file, config that only proves itself once live, or anything else
whose correctness can't be fully confirmed locally, check the real CI run after opening the PR:

```bash
gh run list --branch feat/<slug> --limit 3
gh run watch <run-id> --exit-status
```

## 8. Update the Notion ticket tracker

Mark the ticket **In progress** with its branch name at the *start* of work (before step 2, really)
and add the PR link + a one-line note once opened. Don't mark **Done** until the user confirms the
PR is merged.

## 9. Wait

Don't start the next ticket until the user explicitly confirms this one merged. On confirmation,
go back to step 1 — sync, clean up, and mark this ticket **Done** in Notion before branching for
the next one.
