// Paste into mcp__claude-in-chrome__javascript_tool on any herwellchapter.com/wp-admin page.
// Returns {file: sha256} for every backed-up design source, hashing the raw markup exactly as
// WordPress stores it. Compare with scripts/compare_hashes.py.
const n = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce').then((r) => r.text());
const h = { 'X-WP-Nonce': n };
const get = async (p) => (await fetch(`/wp-json/wp/v2/${p}${p.includes('?') ? '&' : '?'}context=edit`, { headers: h })).json();
const sha = async (s) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

window.__live = {};
window.__live['global-styles.css'] = (await get('global-styles/5')).styles.css;
window.__live['single.html'] = (await get('templates/hostinger-ai-theme//single')).content.raw;
window.__live['footer.html'] = (await get('template-parts/hostinger-ai-theme//footer')).content.raw;
for (const p of await get('pages?per_page=100&_fields=slug,content')) {
  if (['home', 'womens-health', 'sleep', 'nutrition', 'wellness'].includes(p.slug)) {
    window.__live[`pages/${p.slug}.html`] = p.content.raw;
  }
}
const out = {};
for (const [file, src] of Object.entries(window.__live)) out[file] = await sha(src);
JSON.stringify(out);
