# DocTrader — how to update the site

Plain HTML/CSS/JS on GitHub Pages. No build step. Edit a file, commit to `main`, it's live in about a minute.

## Post a Morning Update (daily)

1. Copy `updates/_template.html` → `updates/YYYY-MM-DD.html` (today's date).
2. In the new file: set `data-post-date="YYYY-MM-DD"`, write the headline in `<h1>`, fill the four sections
   (Overnight · Levels · On deck · What I'm doing). Delete bullets you don't need.
3. Open `data/updates.js` and add one entry at the **top** of the list:
   ```js
   { date: "2026-09-09", title: "Futures flat ahead of CPI", summary: "One or two sentences.", tone: "neutral", tags: ["CPI"] },
   ```
   `tone` is `"bull"`, `"neutral"`, or `"bear"` — it only colors the dot.
4. Commit + push. The home page and the Updates page pick it up automatically; the post gets older/newer links.

## Add / edit / remove a stock

Everything is in **`data/watchlist.js`** — one block per ticker. Fields are documented at the top of the file.

- `tv` must be `EXCHANGE:TICKER` as TradingView writes it (`NASDAQ:NVDA`, `NYSE:ORCL`, `AMEX:SPY`). Wrong exchange → blank chart.
- `earnings` is free text in your own words (`"Oct 21-28"`, `"Nov 2 and Nov 9"`).
  `earningsDate` is the **earliest** possible date as `YYYY-MM-DD` — it drives the countdown and the "Earnings ahead" strip.
  Flip `earningsConfirmed: true` once the company announces; the "est." badge disappears.
- `group` is just a heading; make up new ones freely.
- `status`: `watching` · `noted` · `core` · `long` · `trim`.
- To remove a name, delete its block. Optionally add a line to `WATCHLIST_REMOVED` at the bottom so it shows in the "Removed" table.

## Change the avatar

Replace `assets/img/avatar.png` (large, square, transparent or not — shown as a rounded square),
`assets/img/avatar-face.png` (small circle for bylines), and `assets/img/avatar-square.jpg` (social preview). Same filenames, nothing else to touch.

## Add a video

In `videos.html`, replace a placeholder `<div class="video">…</div>` with

```html
<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="…" loading="lazy" allowfullscreen></iframe></div>
```

## Edit Tips & Secrets / About

They're plain HTML: `tips.html`, `about.html`. Headings with `id="…"` are linked from the table of contents — keep the ids if you rename a heading.

## Where the live data comes from

TradingView's free embeddable widgets (ticker tape, symbol info, chart, financials, technicals, profile, news). They're iframes served by TradingView — nothing to configure, no API key. They do **not** provide earnings dates, which is why those are typed into `watchlist.js` by hand. If you ever want dates auto-filled, a free Finnhub API key can be wired in without redesigning anything.

## Don'ts

- Don't delete `CNAME` (custom domain) or move `index.html`.
- Don't rename `data/*.js` or `assets/site.js` — every page loads them by path.
