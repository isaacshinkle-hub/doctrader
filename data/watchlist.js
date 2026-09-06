/* ============================================================
   DocTrader — Dr. Ting's watchlist
   ------------------------------------------------------------
   This ONE file drives the Dashboard, the home-page "Earnings ahead"
   strip, the ticker tape, and the Watchlist table.

   To add a stock: copy a block, edit it, save, commit.
   To remove one:  delete its block (optionally add it to REMOVED below).

   Fields
   tv            TradingView symbol  EXCHANGE:TICKER  (NASDAQ:NVDA, NYSE:ORCL)
   name          Company name
   group         Heading the tile sits under (any text; tiles are grouped by it)
   status        "watching" | "noted" | "core" | "long" | "trim"
   why           One line: why it's on the list  (optional)
   watchFor      What would make me act           (optional)

   earnings      What I write down, in my own words: "Oct 21-28", "Nov 2 and Nov 9",
                 "Oct 28 (confirmed)". Shown as-is on the tile.
   earningsDate  "YYYY-MM-DD" — the EARLIEST possible date, used for sorting and
                 the countdown. Leave "" if unknown.
   earningsConfirmed  true once the company has announced the date.

   exDividend    "YYYY-MM-DD" or ""      dividendYield  "0.4%" or ""
   notes         Free text shown in the detail panel (HTML allowed)
   added / review  "YYYY-MM-DD"
   ============================================================ */

window.WATCHLIST_META = {
  owner: "Dr. Ting",
  lastReviewed: "2026-09-06",
  earningsNote: "Earnings dates are my running notes and estimates until confirmed — not updated every day. Each ticker has a verify link.",
  cap: 25
};

window.WATCHLIST = [
  /* ---------- AI leaders ---------- */
  { tv: "NASDAQ:GOOG", name: "Alphabet", group: "AI leaders", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "Oct 26 to Nov 4", earningsDate: "2026-10-26", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:META", name: "Meta Platforms", group: "AI leaders", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "Oct 28", earningsDate: "2026-10-28", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:MSFT", name: "Microsoft", group: "AI leaders", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "Oct 28", earningsDate: "2026-10-28", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:AMZN", name: "Amazon", group: "AI leaders", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "Oct 29", earningsDate: "2026-10-29", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:NVDA", name: "NVIDIA", group: "AI leaders", status: "watching",
    why: "AI stock list — chips.", watchFor: "",
    earnings: "Nov 17", earningsDate: "2026-11-17", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },

  /* ---------- AI infrastructure ---------- */
  { tv: "NASDAQ:AVGO", name: "Broadcom", group: "AI infrastructure", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NYSE:ORCL", name: "Oracle", group: "AI infrastructure", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:TSLA", name: "Tesla", group: "AI infrastructure", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "Oct 21-28", earningsDate: "2026-10-21", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },

  /* ---------- Chips & memory ---------- */
  { tv: "NASDAQ:MU", name: "Micron", group: "Chips & memory", status: "watching",
    why: "AI stock list — memory.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:AMD", name: "AMD", group: "Chips & memory", status: "watching",
    why: "AI stock list.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NYSE:DELL", name: "Dell Technologies", group: "Chips & memory", status: "watching",
    why: "AI stock list — servers.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:NVTS", name: "Navitas Semiconductor", group: "Chips & memory", status: "watching",
    why: "Semiconductor.", watchFor: "",
    earnings: "Nov 2 and Nov 9", earningsDate: "2026-11-02", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:SNDK", name: "Sandisk", group: "Chips & memory", status: "watching",
    why: "Memory.", watchFor: "",
    earnings: "Oct 30 and Nov 9", earningsDate: "2026-10-30", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:INTC", name: "Intel", group: "Chips & memory", status: "noted",
    why: "Noted.", watchFor: "",
    earnings: "", earningsDate: "", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },

  /* ---------- Also tracking ---------- */
  { tv: "NASDAQ:AAPL", name: "Apple", group: "Also tracking", status: "watching",
    why: "", watchFor: "",
    earnings: "Oct 29", earningsDate: "2026-10-29", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:PLTR", name: "Palantir", group: "Also tracking", status: "watching",
    why: "", watchFor: "",
    earnings: "Nov 2", earningsDate: "2026-11-02", earningsConfirmed: false,
    exDividend: "", dividendYield: "", notes: "", added: "2026-09-06", review: "" },
  { tv: "NASDAQ:SPCX", name: "SPCX (ticker to verify)", group: "Also tracking", status: "noted",
    why: "", watchFor: "",
    earnings: "Nov 3-5", earningsDate: "2026-11-03", earningsConfirmed: false,
    exDividend: "", dividendYield: "",
    notes: "<em>Ticker copied from notes as written — please confirm the symbol and exchange; the chart won't load until it's right.</em>",
    added: "2026-09-06", review: "" }
];

/* Names that came off the list, kept for honesty. Shown at the bottom of the Watchlist page. */
window.WATCHLIST_REMOVED = [
  // { ticker: "XYZ", was: "Why it was on the list", removed: "2026-10-01", why: "Thesis played out / broke" }
];
