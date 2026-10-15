---
name: wordpress-backup-sync
description: >-
  Keep docs/wordpress/backup/ identical to the live HerWellChapter WordPress
  design (custom CSS, single-post template, footer, Home and category pages)
  and keep docs/wordpress/README.md current. Use after any design or template
  change on herwellchapter.com, when asked whether the backups are up to
  date, or before restoring the design from the repo.
---

# wordpress-backup-sync

`docs/wordpress/backup/` is the repo's copy of every design customization on the live site. The
README's "Restoring" section relies on it, so it has to match the live site byte for byte. Hostinger's
daily backups cover everything else (posts, media, Complianz settings).

| Backup file | Live source (REST, `context=edit`) |
|---|---|
| `global-styles.css` | `global-styles/5` → `styles.css` |
| `global-styles.json` | `global-styles/5` → `settings` + `styles` without `css` (palette, fonts, buttons) |
| `single.html` | `templates/hostinger-ai-theme//single` → `content.raw` |
| `footer.html` | `template-parts/hostinger-ai-theme//footer` → `content.raw` |
| `pages/<slug>.html` | pages `home`, `womens-health`, `sleep`, `nutrition`, `wellness` → `content.raw` |

Each file ends with a single newline that WordPress doesn't store; nothing else differs.

## 1. Compare

In the logged-in admin tab (see the `wordpress-chrome` skill), run the contents of
`scripts/live-hashes.js` with `javascript_tool`. Then pass its JSON output to:

```bash
python3 .claude/skills/wordpress-backup-sync/scripts/compare_hashes.py '<json>'
```

`global-styles.json` isn't hashed. Diff it by hand only if palette, fonts or button styles changed.

## 2. Bring a DIFF file up to date

`javascript_tool` truncates long results, so you can't paste a whole template out in one call.
Either way works:

- **You know what changed** (you made the edit): apply the same string change to the local file,
  re-run the compare, and write the file only once it says OK.
- **Someone else changed it** (the wife in the editor): `live-hashes.js` leaves the sources on
  `window.__live`. Read the file in slices with
  `JSON.stringify(window.__live['single.html'].slice(0, 900))`, then `900, 1800`, and so on.
  Rebuild the file from the slices, then compare again.

Things that have already caused differences:
- The wife rewrites text in the editor (the About card bio, the banner).
- Saving a page in the editor normalizes the markup, for example by dropping
  `<!-- wp:html -->` wrappers or adding `"excludeCurrent":null` to query blocks.
- Media IDs and upload URLs change when images are replaced.

Don't "fix" the live site to match an old backup unless the user asks for a restore. The live
site is the source of truth.

## 3. Update the docs

In `docs/wordpress/README.md`:
- **New design decision:** note it in the matching section (Design, Templates, Content
  structure), with media or post IDs if the restore steps depend on them.
- **Changed IDs:** if a restore step names an ID that changed (e.g. the home hero media ID),
  update the "Restoring" section.
- **Open items:** close or reword the item when you finish it, and add new ones you find.

Durable facts (new IDs, new decisions) also belong in the project memory. Don't save there what
the README already records.

## 4. Ship

Commit only when the user asks. Work on a branch (never `main`) with the `croschel` GitHub account
(`gh auth switch -u croschel`; never `GH_TOKEN`). Don't include the user's local `.gitignore`
change or the `.claude/.headroom_*` files. Use the `open-pr` skill for the PR.
