---
name: wordpress-chrome
description: >-
  Operate the live HerWellChapter WordPress site (herwellchapter.com, Hostinger)
  through the user's logged-in Chrome tab: read and edit posts, pages,
  templates, global CSS, site settings, SEO fields and media via the
  WordPress REST API, upload images, purge the cache, and verify the public
  result. Use for any change to the live site's content, design, logo,
  favicon or SEO text, or when asked to inspect what the site currently has.
  Not for the legacy Next.js code in src/.
---

# wordpress-chrome

The live site is WordPress on Hostinger, not the Next.js app in this repo (see
`docs/wordpress/README.md` for the why and the full architecture). Every change goes through the
user's own Chrome session, logged in as admin, using the `mcp__claude-in-chrome__*` tools.

## Facts you'll need

| Thing | Value |
|---|---|
| Site | `https://herwellchapter.com` (admin at `/wp-admin`). Brand: **HerWellChapter** (was WellWithHer until 2026-10-15) |
| Theme | `hostinger-ai-theme` (block theme, Gutenberg). Never Elementor |
| Global styles record | `/wp/v2/global-styles/5`; custom CSS lives in `styles.css` |
| Templates | `/wp/v2/templates/hostinger-ai-theme//single`, `/wp/v2/template-parts/hostinger-ai-theme//footer` (header part is the builder's; restyled only through CSS) |
| Pages | Home 67, Contact 72, About 73, Privacy Policy 3, Affiliate Disclosure 106, Cookie Policy (Complianz-generated) |
| Categories | `womens-health` 5, `sleep` 6, `nutrition` 7, `wellness` 8 |
| Media | site icon 197 `herwellchapter-icon.png`; logo mark 212 `herwellchapter-logo-mark.png` (transparent, used as CSS background in the header `::before` and `.wwh-logo`); home banner 193 |
| CSS class prefix | `wwh-` (kept on purpose after the rename; don't rename) |
| Plugins | Complianz (cookie banner), LiteSpeed Cache, WPCode Lite, Hostinger AI/Tools/Reach/Affiliate |

## 1. Start the session

1. `tabs_context_mcp` with `createIfEmpty: true`, then work in a tab of that group. Don't reuse
   tabs from other sessions.
2. Navigate to any `https://herwellchapter.com/wp-admin/...` page. If it shows the login screen,
   stop and ask the user to log in. Never type passwords.
3. Get a REST nonce once per page load and keep it on `window`:

```js
window.__n = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce').then(r => r.text());
```

Navigating wipes `window.__n`. Fetch it again after every navigation.

## 2. Read and edit through the REST API

Always read with `context=edit` to get the raw block markup, change it as a string, and write back
only the fields you changed:

```js
const h = {'X-WP-Nonce': window.__n, 'Content-Type': 'application/json'};
const it = await (await fetch('/wp-json/wp/v2/pages/73?context=edit', {headers: h})).json();
const content = it.content.raw.replace('old text', 'new text');
const r = await fetch('/wp-json/wp/v2/pages/73', {method: 'POST', headers: h, body: JSON.stringify({content})});
r.status
```

- **Global CSS:** POST `{styles: {...g.styles, css}, settings: g.settings}` to
  `/wp/v2/global-styles/5`. Send the whole `styles` object back, or the palette and fonts are lost.
  Before replacing a rule, check that `css.includes(oldRule)`; if not, stop and re-read instead of
  guessing.
- **Site settings:** `/wp/v2/settings` (`title`, `description`, `site_icon`, …). Don't return
  the full object to the chat: it contains the admin email (the wife's personal address).
- **Posts with a featured image:** on this Hostinger WP, creating a post with `featured_media` set
  causes a fatal error. Create it first, then set `featured_media` in a second request.
- Posts, pages, templates and global styles keep revisions, so REST edits can be undone from the
  editor. Settings and post meta can't.

### Output filter gotchas

- **`[BLOCKED: Cookie/query string data]`:** the tool hides results that look like URLs with query
  strings or cookies. Return only the fields you need, and strip `?`, `&` and `=` from text you
  echo back (`.replace(/[?&=]/g, '_')`). The edit itself still ran when the result is blocked, so
  verify with a separate read before retrying.
- **Truncation:** long results come back cut off with `[TRUNCATED]`. To read a whole template or
  page, keep it on `window` and read it in slices,
  `JSON.stringify(window.__src.slice(0, 900))`, then `900, 1800`, and so on. To compare with a
  file in the repo, compare hashes instead (see the `wordpress-backup-sync` skill).

## 3. Things the REST API doesn't reach

- **SEO title, description and keywords** set by the Hostinger AI builder are post meta
  (`hostinger_ai_post_meta_title`, `…_description`, `…_seo_keywords`). REST doesn't expose them.
  Edit them through the editor's **Custom Fields** panel:
  1. Open the page in the editor and go to ⋮ Options → Preferences → General → Advanced.
  2. Turn on "Campos personalizados" (Custom fields), then click "Mostrar e recarregar página".
  3. In `#the-list`, change each `textarea` and click that row's `Atualizar` (Update) button.
  4. **Turn the panel back off** afterwards ("Esconder e recarregar página"), so the wife's editor
     looks the way she knows it.
- **Media upload:** go to `/wp-admin/media-new.php?browser-uploader`, find the file input and use
  `file_upload` with an absolute path inside the repo (e.g. `.tmp/…`; paths outside shared
  folders are rejected), then click `Enviar`. Get the new ID with
  `/wp/v2/media?search=<filename>`. Set alt text and title with a POST to `/wp/v2/media/<id>`.
- **Site icon (favicon):** POST `{site_icon: <media id>}` to `/wp/v2/settings`. The image must be
  square and at least 512 px. Crop tight around the mark so it reads at 16 px.
- **Don't create PHP snippets** (WPCode or similar) to reach the database. The safety classifier
  blocks it as remote-code surface, and it's the wrong tool anyway. Use the UI paths above.

## 4. Purge the cache, then verify publicly

LiteSpeed and the Hostinger CDN cache pages, so purge after every change. On any admin page:

```js
const a = [...document.querySelectorAll('#wpadminbar a')].find(a => /purge_all/i.test(a.href));
if (a) await fetch(a.href); 'purged ' + !!a
```

Then verify from the shell with a cache-busting query, never only from the editor:

```bash
curl -s "https://herwellchapter.com/<path>/?v=$RANDOM" | grep -c 'expected text'
```

For brand or domain sweeps, list every public URL from `https://herwellchapter.com/wp-sitemap.xml`
plus `/feed/` and `/llms.txt` and grep each one. Prefer Python over `grep -oE` with long
context patterns: the shell's grep is ugrep, which rejects complex patterns.

For visual checks, take a screenshot. The Complianz banner covers the lower right of the page.
Hide it for the screenshot with
`document.querySelector('.cmplz-cookiebanner')?.style.setProperty('display','none','important')`
and don't click Accept or Reject on the user's behalf.

## 5. Rules

- **Privacy:** never put the wife's personal email on public pages, in the repo, in third-party
  sign-ups, or in screenshots. hPanel opens as admin access to her account and shows her email in
  a top bar, so crop that bar out of any capture.
- **Confirm before** accepting terms, starting trials or anything billed, buying, connecting
  external services (QUIC.cloud, Cookiedatabase, …), sending email, or deleting media and pages.
  In hPanel flows, stop at the confirmation dialog and ask.
- **After any design change** (CSS, `single`, `footer`, Home or category pages), run the
  `wordpress-backup-sync` skill so `docs/wordpress/backup/` keeps matching the live site.
- **Wife's guide:** if a change affects how she edits the site, update `.tmp/guia-wordpress/` (in
  Portuguese, gitignored) and regenerate `~/Desktop/guia-herwellchapter.zip`.
- When you're done, close the tabs you opened.
