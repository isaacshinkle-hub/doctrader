/* DocTrader — tiny vanilla JS. No build step.
   Sections: nav · helpers · TradingView loader · dashboard · updates list · watchlist table */
(function () {
  'use strict';

  /* ---------- nav + footer year ---------- */
  var t = document.querySelector('.nav-toggle'), n = document.getElementById('nav-links');
  if (t && n) t.addEventListener('click', function () {
    var open = n.classList.toggle('open'); t.setAttribute('aria-expanded', open);
  });
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* Optional Dr. Ting portrait slideshow (home / dashboard / gallery) */
  var shows = document.querySelectorAll('[data-ting-show]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(shows, function (el) {
    var slides = el.querySelectorAll('img');
    if (slides.length < 2) return;
    var i = 0;
    if (!el.querySelector('.is-on')) slides[0].classList.add('is-on');
    if (reduceMotion) return;
    setInterval(function () {
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
    }, 4200);
  });

  /* ---------- helpers ---------- */
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function parseDate(s) { if (!s) return null; var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDate(s, withDay) {
    var d = parseDate(s); if (!d) return '—';
    var out = MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    return withDay ? DAYS[d.getDay()] + ', ' + out : out;
  }
  function daysUntil(s) {
    var d = parseDate(s); if (!d) return null;
    var today = new Date(); today.setHours(0,0,0,0);
    return Math.round((d - today) / 86400000);
  }
  function ticker(tv) { return tv.split(':')[1] || tv; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function statusLabel(s) { return { core: 'Core', watching: 'Watching', noted: 'Noted', long: 'Long', trim: 'Trim' }[s] || s; }
  function earnLabel(w) { if (!w.earnings && !w.earningsDate) return ''; var t = w.earnings || fmtDate(w.earningsDate); return t + (w.earningsConfirmed ? '' : ' <i class="est" title="estimate / not confirmed">est.</i>'); }
  function earningsUrl(tv) { return 'https://www.nasdaq.com/market-activity/stocks/' + ticker(tv).toLowerCase() + '/earnings'; }
  function tvUrl(tv) { return 'https://www.tradingview.com/symbols/' + tv.replace(':', '-') + '/'; }
  function inDepth(base) { return (document.body.getAttribute('data-root') || '') + base; }

  window.DT = { fmtDate: fmtDate, daysUntil: daysUntil, ticker: ticker, esc: esc };

  /* ---------- TradingView widget loader ----------
     Widgets are official TradingView embeds. Each is an <iframe> served by
     TradingView; nothing runs from our domain. Loaded on demand.  */
  function tvWidget(container, script, config) {
    container.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'tradingview-widget-container';
    var inner = document.createElement('div'); inner.className = 'tradingview-widget-container__widget';
    var s = document.createElement('script');
    s.type = 'text/javascript'; s.async = true;
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + script + '.js';
    s.textContent = JSON.stringify(config);
    wrap.appendChild(inner); wrap.appendChild(s); container.appendChild(wrap);
  }
  var TV_BASE = { locale: 'en', colorTheme: 'dark', isTransparent: true };
  function merge(a, b) { var o = {}; for (var k in a) o[k] = a[k]; for (var j in b) o[j] = b[j]; return o; }

  /* Ticker tape (any page with #ticker-tape) */
  var tape = document.getElementById('ticker-tape');
  if (tape && window.WATCHLIST) {
    tvWidget(tape, 'ticker-tape', merge(TV_BASE, {
      symbols: window.WATCHLIST.map(function (w) { return { proName: w.tv, title: ticker(w.tv) }; }),
      showSymbolLogo: true, displayMode: 'adaptive'
    }));
  }

  /* ---------- Dashboard ---------- */
  var dash = document.getElementById('dashboard');
  if ((dash || document.getElementById('earnings-ahead')) && window.WATCHLIST) {
    var list = window.WATCHLIST;
    var tiles = document.getElementById('wl-tiles') || document.createElement('div');
    var detail = document.getElementById('wl-detail') || document.createElement('div');
    var filterBtns = document.querySelectorAll('[data-filter]');
    var current = null, currentTab = 'overview', filter = 'all';

    function renderTiles() {
      var shown = list.filter(function (w) { return filter === 'all' || w.status === filter; });
      var groups = [], byG = {};
      shown.forEach(function (w) { var g = w.group || 'Watchlist'; if (!byG[g]) { byG[g] = []; groups.push(g); } byG[g].push(w); });
      tiles.innerHTML = groups.map(function (g) {
        return '<h4 class="tile-group">' + esc(g) + '</h4>' + byG[g].map(function (w) {
          var du = daysUntil(w.earningsDate);
          var soon = du !== null && du >= 0 && du <= 14;
          return '<button class="tile' + (current && current.tv === w.tv ? ' active' : '') + '" data-tv="' + esc(w.tv) + '">' +
            '<div class="tile-top"><span class="ticker">' + esc(ticker(w.tv)) + '</span><span class="pill ' + esc(w.status) + '">' + statusLabel(w.status) + '</span></div>' +
            '<div class="tile-name">' + esc(w.name) + '</div>' +
            '<div class="tile-meta">' + (w.earnings || w.earningsDate ? '<span class="' + (soon ? 'soon' : '') + '">Earnings: ' + earnLabel(w) + (soon ? ' (' + du + 'd)' : '') + '</span>' : '<span class="muted">Earnings: not set</span>') +
            '</div></button>';
        }).join('');
      }).join('');
      Array.prototype.forEach.call(tiles.querySelectorAll('.tile'), function (b) {
        b.addEventListener('click', function () { select(b.getAttribute('data-tv')); });
      });
    }

    function keyDate(label, val, extra) {
      var du = daysUntil(val);
      var when = val ? fmtDate(val, true) + (du !== null ? ' <span class="muted">(' + (du === 0 ? 'today' : du > 0 ? 'in ' + du + 'd' : Math.abs(du) + 'd ago') + ')</span>' : '') : '<span class="muted">not set</span>';
      return '<div class="kd"><span>' + label + '</span><b>' + when + '</b>' + (extra || '') + '</div>';
    }

    function renderDetail() {
      var w = current;
      if (!w) { detail.innerHTML = '<div class="empty"><h3>Pick a ticker</h3><p class="muted">Select any tile to load its live chart, fundamentals, technicals, and news — plus Dr. Ting\'s notes and key dates.</p></div>'; return; }
      detail.innerHTML =
        '<div class="detail-head">' +
          '<div><div class="detail-ticker"><span class="ticker">' + esc(ticker(w.tv)) + '</span><span class="pill ' + esc(w.status) + '">' + statusLabel(w.status) + '</span></div>' +
          '<h2>' + esc(w.name) + '</h2><p class="muted small">' + esc(w.group || '') + ' · on the list since ' + fmtDate(w.added) + (w.review ? ' · review by ' + fmtDate(w.review) : '') + '</p></div>' +
          '<div class="detail-links"><a class="btn ghost small" target="_blank" rel="noopener" href="' + tvUrl(w.tv) + '">Open on TradingView ↗</a></div>' +
        '</div>' +
        '<div class="detail-grid">' +
          '<section class="panel notes-panel">' + (w.why ? '<h3>Why it\'s on the list</h3><p>' + esc(w.why) + '</p>' : '') +
            (w.watchFor ? '<h3>What I\'m watching for</h3><p>' + esc(w.watchFor) + '</p>' : '') +
            (!w.why && !w.watchFor && !w.notes ? '<h3>Notes</h3><p class="muted">No notes yet.</p>' : '') +
            (w.notes ? '<h3>Notes</h3><div>' + w.notes + '</div>' : '') + '</section>' +
          '<section class="panel dates-panel"><h3>Key dates</h3>' +
            '<div class="kd"><span>Earnings</span><b>' + (w.earnings || w.earningsDate ? earnLabel(w) + (daysUntil(w.earningsDate) !== null ? ' <span class="muted">(' + (function (d) { return d === 0 ? 'today' : d > 0 ? 'in ' + d + 'd' : Math.abs(d) + 'd ago'; })(daysUntil(w.earningsDate)) + ')</span>' : '') : '<span class="muted">not set</span>') + '</b><a class="small" target="_blank" rel="noopener" href="' + earningsUrl(w.tv) + '">verify ↗</a></div>' +
            keyDate('Ex-dividend', w.exDividend, w.dividendYield ? '<span class="small muted">yield ' + esc(w.dividendYield) + '</span>' : '') +
            '<p class="small muted" style="margin:10px 0 0">' + esc((window.WATCHLIST_META && window.WATCHLIST_META.earningsNote) || '') + '</p></section>' +
        '</div>' +
        '<div class="tabs" role="tablist">' +
          ['overview','financials','technicals','profile','news'].map(function (k) {
            return '<button role="tab" data-tab="' + k + '" aria-selected="' + (k === currentTab) + '">' + k.charAt(0).toUpperCase() + k.slice(1) + '</button>';
          }).join('') +
        '</div>' +
        '<div id="tab-body" class="tab-body"></div>';
      Array.prototype.forEach.call(detail.querySelectorAll('[data-tab]'), function (b) {
        b.addEventListener('click', function () { currentTab = b.getAttribute('data-tab'); renderDetail(); });
      });
      renderTab();
    }

    function renderTab() {
      var body = document.getElementById('tab-body'); if (!body || !current) return;
      var sym = current.tv;
      body.innerHTML = '';
      if (currentTab === 'overview') {
        var a = document.createElement('div'); a.className = 'tv-box tv-info';
        var b = document.createElement('div'); b.className = 'tv-box tv-chart';
        body.appendChild(a); body.appendChild(b);
        tvWidget(a, 'symbol-info', merge(TV_BASE, { symbol: sym, width: '100%' }));
        tvWidget(b, 'advanced-chart', { autosize: true, symbol: sym, interval: 'D', timezone: 'America/Los_Angeles', theme: 'dark', style: '1', locale: 'en', hide_top_toolbar: false, allow_symbol_change: false, calendar: false, backgroundColor: 'rgba(12, 10, 7, 1)', gridColor: 'rgba(58, 48, 33, 0.4)', support_host: 'https://www.tradingview.com' });
      } else if (currentTab === 'financials') {
        var f = document.createElement('div'); f.className = 'tv-box tv-tall'; body.appendChild(f);
        tvWidget(f, 'financials', merge(TV_BASE, { symbol: sym, width: '100%', height: '100%', displayMode: 'regular', largeChartUrl: '' }));
      } else if (currentTab === 'technicals') {
        var tt = document.createElement('div'); tt.className = 'tv-box tv-tall'; body.appendChild(tt);
        tvWidget(tt, 'technical-analysis', merge(TV_BASE, { symbol: sym, width: '100%', height: '100%', interval: '1D', showIntervalTabs: true, displayMode: 'multiple' }));
      } else if (currentTab === 'profile') {
        var p = document.createElement('div'); p.className = 'tv-box tv-tall'; body.appendChild(p);
        tvWidget(p, 'symbol-profile', merge(TV_BASE, { symbol: sym, width: '100%', height: '100%' }));
      } else if (currentTab === 'news') {
        var nn = document.createElement('div'); nn.className = 'tv-box tv-tall'; body.appendChild(nn);
        tvWidget(nn, 'timeline', merge(TV_BASE, { feedMode: 'symbol', symbol: sym, width: '100%', height: '100%', displayMode: 'regular' }));
      }
    }

    function select(tv) {
      if (!dash) { location.href = (document.body.getAttribute('data-root') || '') + 'dashboard.html#' + ticker(tv); return; }
      current = list.filter(function (w) { return w.tv === tv; })[0] || null;
      if (current) { try { history.replaceState(null, '', '#' + ticker(current.tv)); } catch (e) {} }
      renderTiles(); renderDetail();
      if (window.innerWidth < 900 && detail) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    Array.prototype.forEach.call(filterBtns, function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-filter');
        Array.prototype.forEach.call(filterBtns, function (x) { x.setAttribute('aria-pressed', x === b); });
        renderTiles();
      });
    });

    /* Earnings-ahead strip */
    var strip = document.getElementById('earnings-ahead');
    if (strip) {
      var soonList = list.filter(function (w) { var d = daysUntil(w.earningsDate); return d !== null && d >= -1 && d <= 75; })
        .sort(function (a, b) { return daysUntil(a.earningsDate) - daysUntil(b.earningsDate); });
      strip.innerHTML = soonList.length
        ? soonList.map(function (w) { var d = daysUntil(w.earningsDate); return '<button class="chip" data-tv="' + esc(w.tv) + '"><b>' + esc(ticker(w.tv)) + '</b> ' + earnLabel(w) + ' <span class="muted">(' + (d === 0 ? 'today' : d + 'd') + ')</span></button>'; }).join('')
        : '<span class="muted small">No earnings dates set within the next 75 days.</span>';
      Array.prototype.forEach.call(strip.querySelectorAll('[data-tv]'), function (b) { b.addEventListener('click', function () { select(b.getAttribute('data-tv')); }); });
    }

    var meta = document.getElementById('wl-meta');
    if (meta && window.WATCHLIST_META) meta.textContent = list.length + ' names · last reviewed ' + fmtDate(window.WATCHLIST_META.lastReviewed);

    if (dash) {
      renderTiles();
      var hash = (location.hash || '').replace('#', '').toUpperCase();
      var fromHash = list.filter(function (w) { return ticker(w.tv) === hash; })[0];
      if (fromHash) select(fromHash.tv); else if (list.length) { current = list[0]; renderTiles(); renderDetail(); } else renderDetail();
    }
  }

  /* ---------- Updates list (Updates page + home "latest") ---------- */
  function toneDot(t) { return '<span class="dot ' + esc(t || 'neutral') + '" title="' + esc(t || 'neutral') + '"></span>'; }
  function updateCard(u, root) {
    return '<a class="update-card" href="' + root + 'updates/' + esc(u.date) + '.html">' +
      '<div class="update-date">' + toneDot(u.tone) + fmtDate(u.date, true) + '</div>' +
      '<h3>' + esc(u.title) + '</h3><p>' + esc(u.summary) + '</p>' +
      (u.tags && u.tags.length ? '<div class="tags">' + u.tags.map(function (g) { return '<span class="tag">' + esc(g) + '</span>'; }).join('') + '</div>' : '') +
      '</a>';
  }
  var latest = document.getElementById('latest-update');
  if (latest && window.UPDATES && window.UPDATES.length) {
    var u0 = window.UPDATES[0];
    latest.innerHTML = updateCard(u0, latest.getAttribute('data-root') || '');
  }
  var ulist = document.getElementById('updates-list');
  if (ulist && window.UPDATES) {
    var root = ulist.getAttribute('data-root') || '';
    var byMonth = {};
    window.UPDATES.forEach(function (u) { var k = u.date.slice(0, 7); (byMonth[k] = byMonth[k] || []).push(u); });
    ulist.innerHTML = Object.keys(byMonth).sort().reverse().map(function (k) {
      var d = parseDate(k + '-01');
      return '<section class="month"><h2 class="month-head">' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + '</h2><div class="update-grid">' + byMonth[k].map(function (u) { return updateCard(u, root); }).join('') + '</div></section>';
    }).join('');
    var count = document.getElementById('updates-count'); if (count) count.textContent = window.UPDATES.length + (window.UPDATES.length === 1 ? ' post' : ' posts');
  }

  /* Post pages: prev/next nav + date header from the manifest */
  var post = document.querySelector('[data-post-date]');
  if (post && window.UPDATES) {
    var pd = post.getAttribute('data-post-date');
    var idx = -1; window.UPDATES.forEach(function (u, i) { if (u.date === pd) idx = i; });
    var dh = document.getElementById('post-date'); if (dh) dh.textContent = fmtDate(pd, true);
    var nav = document.getElementById('post-nav');
    if (nav && idx >= 0) {
      var newer = window.UPDATES[idx - 1], older = window.UPDATES[idx + 1];
      nav.innerHTML = (older ? '<a href="' + esc(older.date) + '.html">← ' + esc(older.title) + '</a>' : '<span></span>') +
                      (newer ? '<a href="' + esc(newer.date) + '.html">' + esc(newer.title) + ' →</a>' : '<span></span>');
    }
  }

  /* ---------- Watchlist page table ---------- */
  var wtable = document.getElementById('watchlist-table');
  if (wtable && window.WATCHLIST) {
    wtable.innerHTML = window.WATCHLIST.map(function (w) {
      return '<tr><td><a class="ticker" href="dashboard.html#' + esc(ticker(w.tv)) + '">' + esc(ticker(w.tv)) + '</a></td><td>' + esc(w.name) + '</td><td>' + esc(w.why) + '</td><td>' + esc(w.watchFor) + '</td>' +
        '<td><span class="pill ' + esc(w.status) + '">' + statusLabel(w.status) + '</span></td><td class="num">' + (earnLabel(w) || '—') + '</td><td>' + esc(w.group || '') + '</td></tr>';
    }).join('');
    var rem = document.getElementById('removed-table');
    if (rem) rem.innerHTML = (window.WATCHLIST_REMOVED && window.WATCHLIST_REMOVED.length)
      ? window.WATCHLIST_REMOVED.map(function (r) { return '<tr><td class="ticker">' + esc(r.ticker) + '</td><td>' + esc(r.was) + '</td><td class="num">' + fmtDate(r.removed) + '</td><td>' + esc(r.why) + '</td></tr>'; }).join('')
      : '<tr><td class="muted" colspan="4">No removals yet.</td></tr>';
    var wm = document.getElementById('wl-meta');
    if (wm && window.WATCHLIST_META) wm.textContent = 'Last reviewed ' + fmtDate(window.WATCHLIST_META.lastReviewed, true) + ' · ' + window.WATCHLIST.length + ' names · cap ~' + window.WATCHLIST_META.cap;
  }
})();
