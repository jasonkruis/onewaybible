# One Way Bible — website

A static site, organized as a **library**: content is written in Markdown, tagged
by topic and type, and browsed by topic. Eleventy builds it into plain HTML;
Cloudflare Pages or Netlify hosts it for free. No database, no plugins. The whole
site is portable text files you own.

---

## The mental model

- Every piece of content is a **resource** — one file in `src/resources/`.
- Each resource has ONE home **topic** (where it's filed and where it appears in
  the library) and, optionally, several **tags** (a separate cross-reference layer).
- **Topics** are the fixed list in the left rail. A resource lives under exactly one.
- **Tags** don't affect filing. They let a reader click a subject and find every
  resource sharing it, across all topics. Each tag gets its own page automatically.
- Within a topic, resources are grouped by **type** (writing, audio, video, slides,
  graphic) and ordered by a priority number you set.
- You **add** a resource file, **build**, and **deploy** (`git push`).

---

## One-time setup (on your computer)

1. Install [Node.js](https://nodejs.org/) — the **LTS** version. This gives you `npm`.
2. Download and unpack this folder.
3. Open a terminal (Mac: the **Terminal** app; Windows: **PowerShell**), and point it
   at the folder:
   ```
   cd /path/to/onewaybible
   ```
   (Tip: type `cd ` then drag the folder onto the terminal window to paste its path.)
4. Run:
   ```
   npm install
   ```
   Only needed once — it downloads Eleventy into the folder.

To preview while working: `npm run serve`, then open the address it prints
(usually `http://localhost:8080`). `Ctrl-C` stops it.
To build the finished site: `npm run build` (creates the `_site/` folder).

---

## Adding a written article

1. Copy `src/resources/dead-men-cant-climb-ladders.md`, rename it. The file name
   becomes the web address: `the-near-word.md` → `/writing/the-near-word/`.
2. Edit the settings block at the top:
   ```
   ---
   layout: article.njk
   type: writing
   topic: The Law
   tags: [Reading the Bible, Leviticus 18:5, Law and Grace]
   order: 1
   title: Your Title Here
   description: One sentence for the topic-page listing.
   eyebrow: The Law
   ---
   ```
   - `type` — always `writing` for an article.
   - `topic` — the ONE home topic. **Must match a topic name in
     `src/_data/topics.json`.** This determines where the resource is filed.
   - `tags` — optional, in square brackets, comma-separated. A separate
     cross-reference layer: each tag gets its own page listing everything that
     shares it, across all topics. Tags do NOT change where the resource is filed.
     A tag can be anything — another topic's name, a book of the Bible, a theme.
   - `order` — priority within its topic-and-type group. Lower first. No `order`
     sinks to the bottom.
   - `title`, `description` — as before.
   - `date` — optional; not displayed, not used for ordering. Can be omitted.
3. Write the article in Markdown below the block. `## Heading`, blank lines between
   paragraphs, `*italic*`, `**bold**`, `> blockquote`. For a small Scripture
   reference: `<span class="ref">(Romans 10:8)</span>`.

---

## Adding audio, video, slides, or a graphic

Same idea, but these usually **link out** to where the media is hosted (you don't
put big media files on the site — that keeps it fast and durable). Host audio on a
podcast/file host, video on YouTube or Vimeo, and link to it:

```
---
layout: base.njk
type: video
topics: [The Gospel]
title: The Gospel in One Sentence
description: A short talk.
link: https://www.youtube.com/watch?v=XXXXXXXX
date: 2026-07-01
permalink: false
---
```

- `type` — `audio`, `video`, `slides`, or `graphic`.
- `link` — the URL where the media actually lives. On topic pages the resource
  links straight there.
- `permalink: false` — for link-out resources that don't need their own page.
- Small explanatory **graphics** (images) can live on the site: put the image in
  `src/assets/`, and use `link: /assets/your-image.png`.

(These types show up on topic pages under their own headings — Audio, Video,
Slides, Graphics — in that order, below Writing.)

---

## Managing topics

Topics live in **`src/_data/topics.json`**. To rename, add, remove, or reorder
topics, edit that file. Each entry:

```
{
  "slug": "assurance",
  "name": "Assurance",
  "blurb": "Knowing where you stand with God — and how you know it."
}
```

- `name` — what shows on the site. A resource's `topics:` list must use this exact name.
- `slug` — the URL piece (`/topics/assurance/`). Lowercase, hyphens, no spaces.
- `blurb` — one line shown on the home grid and the topic page.
- **Order in the file = order on the site.**

The placeholder set (Reading the Bible, The Law, The Gospel, Assurance, Pastoral)
is just a starting point — rename and expand freely.

## The About page

The About page lives at `src/about.njk` and shows up in the top navigation. It's a
normal page — edit the text inside the `<div class="prose">` block. The current
text is a first draft in your voice; revise it freely. (It's `.njk` rather than
`.md` only so it can carry its own settings; the writing inside is plain HTML
paragraphs — `<p>...</p>` — and `<h2>...</h2>` for headings.)

---

## Publishing

### Recommended: Cloudflare Pages or Netlify with Git
1. Put this folder in a Git repository (GitHub — free, gives backups + history).
2. Connect it in Cloudflare Pages or Netlify.
3. Build command `npm run build`, output directory `_site`.
4. Every `git push` rebuilds and publishes automatically.

### Simplest: drag-and-drop
Run `npm run build`, then drag the `_site` folder onto Netlify Drop
(app.netlify.com/drop).

### Your domain
Once live, the host walks you through connecting `onewaybible.org` (a couple of DNS
records at your registrar — the one fiddly step; changes take a few hours). Make
**.org** canonical and redirect **.com**/**.net** to it.

---

## License

Content is shared under **CC BY-NC 4.0** — free to copy and redistribute
non-commercially, with attribution; commercial rights reserved. See `LICENSE`.
