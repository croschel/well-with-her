# Writing for WellWithHer — a guide for the admin panel

This is a plain-language walkthrough for creating and editing articles on WellWithHer. No
technical background needed. If something on screen doesn't match this guide, or something looks
broken, see "When something looks wrong" at the bottom before you worry too much — most issues
have a quick fix.

## Logging in

Go to `/admin` on the site (e.g. `hercozygrowth.com/admin`, or the QA link Caique gave you) and
sign in with your email and password.

## Creating a new article

Click **Articles** in the left sidebar, then **Create New**. Here's what each field means:

- **Category** — pick one of the four: Women's Health, Sleep, Nutrition, Wellness. This decides
  which category page the article shows up on.
- **Pin ID** — a short code that must exactly match the Pinterest pin you're linking to this
  article, e.g. `pin014`. This is how Pinterest traffic finds the right page — get it wrong and
  the pin links to nothing. Ask Caique if you're not sure what the next number should be.
- **Slug** — the URL-friendly version of the title, e.g. `five-minute-morning-reset`. Lowercase,
  words separated by hyphens, no spaces or punctuation. Once a pin is live and people are clicking
  it, **avoid changing the slug** — changing it changes the article's URL, and anyone who already
  saved or shared the old link will hit a dead page.
- **Title** — the headline. Shows on the article page, the category grid, and the browser tab.
- **Main Article Content** — the body of the article. This is a normal rich-text editor (bold,
  italic, headings, lists, links, quote blocks) plus four special content blocks you can insert
  from the toolbar's "+" button:
  - **Image** — a single photo with an optional caption.
  - **Gallery** — 2 or more photos shown in a grid.
  - **Video Embed** — paste a YouTube or Vimeo URL (any format works — a full `youtube.com/watch?v=`
    link, a short `youtu.be/` link, or a Vimeo link). Readers see a thumbnail and click to load
    the actual video, so it doesn't slow the page down for people who don't watch it.
  - **Call to Action** — a second buy-style button you can drop mid-article if you want to link a
    specific product mentioned in that paragraph, separate from the main "Shop this pick" button
    below (see next field).
- **Buy Button URL** — the link for the main "Shop this pick →" button at the bottom of the
  article. This is required on every article.
- **Hero Image** — the big photo at the top of the article. Required.
- **Gallery Images** — optional, a set of extra photos not tied to a specific spot in the body
  (rarely needed — prefer the Gallery block inside Main Article Content instead, so you control
  where it appears).
- **Video Embed URL** — optional, a YouTube/Vimeo link. This is separate and older; prefer the
  Video Embed *block* inside the body instead, so you control where it appears.
- **OG Image** — the photo shown when the article link is shared on Pinterest, Facebook, iMessage,
  etc. If left blank, the Hero Image is used instead — you only need to set this if you want a
  different photo for sharing than the one shown at the top of the article.
- **OG Description** — the short blurb shown under the title on the category grid, and under the
  link when shared. Keep it to **one sentence, under ~155 characters** — anything longer gets cut
  off by Pinterest/Google/Facebook when they display it.
- **Published At** — defaults to right now. You can backdate or schedule this if needed.

## What makes a good photo for this site

- **Hero image**: wide/landscape orientation works best — it gets cropped to a wide banner shape
  at the top of the article.
- **OG image**: this is what people see on Pinterest/social before they click — make it eye-catching
  and readable even as a small thumbnail.
- Every image needs **alt text** (the text description you type when uploading) — it's required,
  and it's what search engines and screen readers use to understand the photo. Describe what's
  actually in the image in a few words, e.g. "Woman in cream loungewear sitting by a sunlit window."

## Draft, Preview, and Publish

Every article is saved as a **draft** until you're ready. While editing, use **Live Preview** (in
the panel on the right, or the "Preview" button) to see exactly how the article will look on the
real site before it goes live — it updates as you type.

When you're happy with it, click **Publish**. The live site updates within a few seconds — you
don't need to ask Caique to "deploy" anything for a normal content edit.

## Editing a published article

Open the article, make your changes, and Publish again. A couple of things to know:

- If you change the **Category**, **Pin ID**, or **Slug** of an already-published article, the old
  URL stops showing the updated content (it may show a 404 or stale content). Only change these if
  you're sure the pin/link needs to move — check with Caique first if traffic is already flowing
  to the old link.
- Everything else (title, images, body content, buy link) updates in place safely, any time.

## The "About WellWithHer" text and the contact page

Go to **Site Info** (under Globals in the sidebar) to edit the "About" blurb shown on every
article's sidebar, the disclosure text shown near buy buttons (the "some links are affiliate
links..." line — this is a legal requirement, don't remove it, just keep it accurate), and the
home page's hero photo.

## When something looks wrong

- **A pin links to a blank/404 page** — the Pin ID or Slug on the article doesn't match what's in
  the URL the pin points to. Double check both against the actual Pinterest pin's link.
- **An image doesn't show up** — make sure it finished uploading (there's a progress indicator)
  before publishing.
- **A video doesn't embed** — only YouTube and Vimeo links work; other video hosts aren't
  supported.
- **You changed something and it's not showing on the live site** — hard-refresh the page
  (Cmd+Shift+R on Mac). If it still doesn't show after a minute, message Caique.
- **Anything else** — take a screenshot and send it to Caique. Nothing you do in the admin panel
  can break the site for readers; drafts are never shown publicly until you hit Publish.
