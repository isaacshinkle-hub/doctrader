/* ============================================================
   DocTrader — Morning Update index
   ------------------------------------------------------------
   Newest first. One entry per post. The post itself is a small
   HTML file in /updates/ made from /updates/_template.html.

   To post a morning update:
     1. Copy updates/_template.html  ->  updates/YYYY-MM-DD.html
     2. Write the update in that file (see the comments inside it).
     3. Add ONE entry at the TOP of the list below.
     4. Commit + push. Done — home page and Updates page pick it up.

   Fields
   date     "YYYY-MM-DD"  (also the filename)
   title    Short headline
   summary  One or two sentences shown in the list and on the home page
   tone     "bull" | "bear" | "neutral"   (colors the little dot)
   tags     ["Fed", "Earnings", "AAPL"]   optional
   ============================================================ */

window.UPDATES = [
  {
    date: "2026-09-09",
    title: "Mixed tape, oil bid",
    summary: "SPY +0.08% vs yesterday. QQQ +1.23%. Watching the open; no plan written before the bell.",
    tone: "neutral",
    tags: ["Auto"]
  },
  {
    date: "2026-09-08",
    title: "Welcome to the Morning Update",
    summary: "What this daily note is, when it posts, and the fixed format I'll use every trading day so you know where to look.",
    tone: "neutral",
    tags: ["Housekeeping"]
  }
];
