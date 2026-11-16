// Shared by the city page (index.html) and the static venue/band pages the
// concerts pipeline writes beside it. BASE is this folder, e.g. /venues/okc/.
const BASE = new URL('.', document.currentScript.src).pathname;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = n => n == null ? '' : '$' + (Number.isInteger(n) ? n : n.toFixed(2));
// PreKindle lists face value; fees are added at checkout and aren't in our data.
const cost = n => n == null ? '' : `${money(n)} <span class="fees">+ fees</span>`;
const day = s => new Date(s + 'T00:00:00');
const fmt = (s, o) => day(s).toLocaleDateString('en-US', o);
const BILLING = { headliner: 'Headliner', support: 'Support', opener: 'Opener' };
let D;

function bars(months) {
  const entries = Object.entries(months).sort().slice(-3);  // the last three months, current included
  if (!entries.length) return '<div class="sub">—</div>';
  const max = Math.max(...entries.map(e => e[1]));
  // Many months: single-letter labels, and counts only on hover/tap.
  const many = entries.length > 6;
  return `<div class="bars">${entries.map(([m, n]) => `<div class="col" title="${fmt(m + '-01', { month: 'short', year: 'numeric' })}: ${n} shows">${many ? '' : `<i>${n}</i>`}<div class="bar" style="height:${Math.max(3, n / max * 34)}px"></div><small>${fmt(m + '-01', { month: many ? 'narrow' : 'short' })}</small></div>`).join('')}</div>`;
}
function stats(v) {
  return `<div class="stats">
    <div class="stat"><b>${v.upcoming.length}</b><span>Upcoming</span></div>
    <div class="stat"><b>${cost(v.avg_price)}</b><span>Avg ticket</span></div>
    <div class="stat">${bars(v.months)}<span>Shows / month</span></div></div>`;
}

// ---------- ticket price trend ----------
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
const monthName = m => fmt(m + '-01', { month: 'short' });
// Last month's change: the current month against the one before it (never a future month).
function change(mp) {
  const cur = TODAY.slice(0, 7), e = Object.entries(mp).filter(([m]) => m <= cur).sort();
  if (e.length < 2) return '';
  const [pm, [a]] = e[e.length - 2], [, [b]] = e[e.length - 1], d = b - a, pct = Math.round(d / a * 100);
  const cls = Math.abs(d) < 0.005 ? 'flat' : d > 0 ? 'up' : 'down', arrow = cls === 'flat' ? '–' : d > 0 ? '▲' : '▼';
  return `<span class="chg ${cls}">${arrow} ${money(Math.abs(Math.round(d * 100) / 100))} (${pct > 0 ? '+' : ''}${pct}%) vs ${monthName(pm)}</span>`;
}
// Months on a continuous axis (a month with no priced shows is skipped by the
// line, not plotted as zero). Solid up to today, dotted after; the future side
// sits behind a faint wash, split by a vertical "today" line.
function trendChart(mp) {
  const e = Object.entries(mp).sort();
  if (e.length < 2) return '';
  const addM = (m, n) => { const [y, mo] = m.split('-').map(Number), d = new Date(y, mo - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  const axis = []; for (let m = e[0][0]; m <= e[e.length - 1][0]; m = addM(m, 1)) axis.push(m);
  const W = 340, H = 170, L = 34, R = 18, T = 24, B = 34, vals = e.map(x => x[1][0]);
  const lo = Math.floor(Math.min(...vals) / 5) * 5, hi = Math.ceil(Math.max(...vals) / 5) * 5 || lo + 5;
  const step = (W - L - R) / Math.max(1, axis.length - 1);
  const X = m => L + axis.indexOf(m) * step, Y = v => T + (hi - v) / (hi - lo || 1) * (H - T - B);
  const cur = TODAY.slice(0, 7), [ty, tm, td] = TODAY.split('-').map(Number), dim = new Date(ty, tm, 0).getDate();
  const tx = axis.includes(cur) ? X(cur) + (td - 0.5) / dim * step - step / 2 : (cur < axis[0] ? L - step / 2 : W - R + step / 2);
  const line = `M${e.map(([m, [v]]) => X(m).toFixed(1) + ',' + Y(v).toFixed(1)).join('L')}`;
  // Label the current month, the highest and the lowest; every month gets a tick.
  const curPt = e.filter(([m]) => m <= cur).pop(), hiPt = e.reduce((a, b) => b[1][0] > a[1][0] ? b : a), loPt = e.reduce((a, b) => b[1][0] < a[1][0] ? b : a);
  const labelled = new Set([curPt && curPt[0], hiPt[0], loPt[0]]);
  const yearMark = m => m.endsWith('-01') || m === axis[0] ? `'${m.slice(2, 4)}` : '';
  const grid = [lo, hi].map(v => `<line x1="${L}" x2="${W - 4}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--rule)"/><text x="0" y="${Y(v) + 4}">$${v}</text>`).join('');
  const ticks = axis.map(m => `<g${m > cur ? ' opacity=".55"' : ''}><text x="${X(m)}" y="${H - 18}" text-anchor="middle">${monthName(m)[0]}</text>${yearMark(m) ? `<text x="${X(m)}" y="${H - 5}" text-anchor="middle">${yearMark(m)}</text>` : ''}</g>`).join('');
  const dots = e.map(([m, [v, n]]) => `<g${m > cur ? ' opacity=".55"' : ''}><circle cx="${X(m)}" cy="${Y(v)}" r="3.5" fill="var(--accent)"><title>${monthName(m)} ${m.slice(0, 4)}: ${money(v)} + fees, ${n} show${n > 1 ? 's' : ''}</title></circle>${labelled.has(m) ? `<text x="${X(m)}" y="${Y(v) - 9}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${money(v)}</text>` : ''}</g>`).join('');
  return `<svg class="trend" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:560px" role="img" aria-label="Average ticket price by month, past and announced">
    <defs><clipPath id="past"><rect x="0" y="0" width="${tx}" height="${H}"/></clipPath><clipPath id="ahead"><rect x="${tx}" y="0" width="${W}" height="${H}"/></clipPath></defs>
    ${grid}<rect x="${tx}" y="${T - 14}" width="${Math.max(0, W - 4 - tx)}" height="${H - T - B + 14}" fill="var(--paper)" opacity=".45"/>
    <line x1="${tx}" x2="${tx}" y1="${T - 14}" y2="${H - B}" stroke="var(--ink)" stroke-width="1" opacity=".5"/><text x="${tx}" y="${T - 16}" text-anchor="middle" style="fill:var(--ink)">Today</text>
    <path d="${line}" clip-path="url(#past)" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <path d="${line}" clip-path="url(#ahead)" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 4" opacity=".7"/>
    ${dots}${ticks}</svg>`;
}

function tabs(cur) {
  const t = [['', 'Venues'], ['calendar', 'Calendar'], ['shows', 'All shows']];
  return `<nav class="tabs">${t.map(([k, l]) => `<a href="${BASE}${k ? '?view=' + k : ''}"${k === cur ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
}
function index() {
  document.title = 'OKC Venues · Songelo';
  return `<h1>OKC Venues</h1>${tabs('')}` + D.venues.map(v => `<a class="panel card" href="${BASE}${v.slug}/">
    <div><h3>${esc(v.name)}</h3><div class="addr">${esc(v.address)}</div></div>${stats(v)}</a>`).join('');
}
// Every upcoming show at every venue, by date, each carrying its venue.
function allShows() {
  return D.venues.flatMap(v => v.upcoming.map(s => ({ ...s, venue: v }))).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.venue.name < b.venue.name ? -1 : 1);
}
function showRow(s, withVenue) {
  return `<div class="show">
      <div class="date"><small>${fmt(s.date, { month: 'short' })}</small><b>${day(s.date).getDate()}</b><small>${fmt(s.date, { weekday: 'short' })}</small></div>
      <div class="bill">${s.bill.length ? s.bill.map((b, k) => `<div class="${k ? 'sup' : 'hl'}"><a href="${bandHref(b.id)}">${esc(b.name)}</a></div>`).join('') : `<div class="hl">${esc(s.name)}</div>`}${withVenue ? `<div class="where"><a href="${BASE}${s.venue.slug}/">${esc(s.venue.name)}</a></div>` : ''}</div>
      <div class="price">${cost(s.price)}${s.url ? `<a href="${esc(s.url)}" rel="noopener">Tickets</a>` : ''}</div></div>`;
}

let calMonth = TODAY.slice(0, 7), calDay = null;
function calendar() {
  document.title = 'OKC Show Calendar · Songelo';
  const shows = allShows(), byDay = {};
  shows.forEach(s => (byDay[s.date] = byDay[s.date] || []).push(s));
  const last = shows.length ? shows[shows.length - 1].date.slice(0, 7) : calMonth;
  const [y, m] = calMonth.split('-').map(Number), first = new Date(y, m - 1, 1), days = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push('<div class="d pad"></div>');
  for (let d = 1; d <= days; d++) {
    const iso = `${calMonth}-${String(d).padStart(2, '0')}`, n = (byDay[iso] || []).length, past = iso < TODAY;
    const cls = ['d', n && !past ? 'has' : '', past ? 'past' : '', iso === TODAY ? 'today' : '', iso === calDay ? 'sel' : ''].filter(Boolean).join(' ');
    cells.push(n && !past ? `<button class="${cls}" data-day="${iso}" aria-label="${fmt(iso, { month: 'long', day: 'numeric' })}: ${n} show${n > 1 ? 's' : ''}"><small>${d}</small><b>${n}</b></button>`
      : `<div class="${cls}"><small>${d}</small><b></b></div>`);
  }
  const list = calDay && byDay[calDay] ? `<section class="panel"><h2>${fmt(calDay, { weekday: 'long', month: 'long', day: 'numeric' })}</h2><div>${byDay[calDay].map(s => showRow(s, true)).join('')}</div></section>` : '';
  return `<h1>OKC Venues</h1>${tabs('calendar')}
    <section class="panel"><div class="monthnav"><button id="pm" aria-label="Previous month"${calMonth <= TODAY.slice(0, 7) ? ' disabled' : ''}>‹</button><b>${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b><button id="nm" aria-label="Next month"${calMonth >= last ? ' disabled' : ''}>›</button></div>
    <div class="cal">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="dow">${d}</div>`).join('')}${cells.join('')}</div></section>${list}`;
}
let fq = '', fv = new Set(), pLo = null, pHi = null, P0 = 0, P1 = 0;
function showsView() {
  const prices = allShows().map(s => s.price).filter(p => p != null);
  // The top of the slider is the 95th percentile, rounded up to $5, and means
  // "and up": one $80 show shouldn't squash every other price into the left edge.
  prices.sort((a, b) => a - b);
  P0 = Math.floor(prices[0]); P1 = Math.ceil(prices[Math.floor(prices.length * 0.95)] / 5) * 5;
  if (pLo == null) { pLo = P0; pHi = P1; }
  document.title = 'OKC Shows · Songelo';
  return `<h1>OKC Venues</h1>${tabs('shows')}
    <section class="panel"><div class="filters">
      <input type="search" id="fq" placeholder="Search bands or shows" value="${esc(fq)}" autocomplete="off" aria-label="Search bands or shows">
      ${D.venues.map(v => `<button class="chip" data-v="${v.id}" aria-pressed="${fv.has(v.id)}">${esc(v.name)}</button>`).join('')}
      <div class="range"><div class="lbl"><span>Ticket price</span><b id="pl"></b></div>
        <div class="track"><div class="fill" id="pf"></div>
          <input type="range" id="plo" min="${P0}" max="${P1}" step="1" value="${pLo}" aria-label="Lowest ticket price">
          <input type="range" id="phi" min="${P0}" max="${P1}" step="1" value="${pHi}" aria-label="Highest ticket price"></div></div>
    </div><div id="list"></div></section>`;
}
function drawList() {
  const q = fq.trim().toLowerCase();
  const full = pLo <= P0 && pHi >= P1;
  $('pl').textContent = full ? 'Any' : `$${pLo} – $${pHi}${pHi >= P1 ? '+' : ''} + fees`;
  $('pf').style.left = (pLo - P0) / (P1 - P0) * 100 + '%'; $('pf').style.right = (P1 - pHi) / (P1 - P0) * 100 + '%';
  const rows = allShows().filter(s => (!fv.size || fv.has(s.venue.id)) && (full || (s.price != null && s.price >= pLo && (pHi >= P1 || s.price <= pHi)))
    && (!q || (s.name || '').toLowerCase().includes(q) || s.bill.some(b => b.name.toLowerCase().includes(q))));
  $('list').innerHTML = `<div class="count">${rows.length} show${rows.length === 1 ? '' : 's'}</div>` + (rows.length ? rows.map(s => showRow(s, true)).join('') : '<div class="empty">No shows match.</div>');
}
const bandHref = id => BASE + 'bands/' + ((D.bands[id] || {}).slug || id) + '/';
function render() {
  const q = new URLSearchParams(location.search), vs = q.get('v'), bs = q.get('b'), view = q.get('view');
  // Old ?v= / ?b= links go to the venue and band pages.
  if (vs) return location.replace(BASE + vs + '/');
  if (bs && D.bands[bs]) return location.replace(bandHref(bs));
  const trend = $('trend');
  if (trend) {  // a static venue page: add the price chart, nothing else
    const v = D.venues.find(x => x.slug === trend.dataset.venue);
    if (v && Object.keys(v.month_prices || {}).length > 1) {
      trend.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><h2>Average ticket by month <span class="fees">+ fees</span></h2>${change(v.month_prices)}</div>${trendChart(v.month_prices)}`;
      trend.hidden = false;
    }
    return;
  }
  if (!$('app').hasAttribute('data-city')) return;  // a static band page: nothing to draw
  $('app').innerHTML = view === 'calendar' ? calendar() : view === 'shows' ? showsView() : index();
  if (view === 'calendar') {
    $('pm').onclick = () => { calMonth = shift(calMonth, -1); calDay = null; render(); };
    $('nm').onclick = () => { calMonth = shift(calMonth, 1); calDay = null; render(); };
    $('app').querySelectorAll('button[data-day]').forEach(el => el.onclick = () => { calDay = calDay === el.dataset.day ? null : el.dataset.day; render(); });
  }
  if (view === 'shows') {
    $('fq').oninput = e => { fq = e.target.value; drawList(); };
    $('plo').oninput = e => { pLo = Math.min(+e.target.value, pHi); e.target.value = pLo; drawList(); };
    $('phi').oninput = e => { pHi = Math.max(+e.target.value, pLo); e.target.value = pHi; drawList(); };
    $('app').querySelectorAll('.chip').forEach(el => el.onclick = () => { fv.has(el.dataset.v) ? fv.delete(el.dataset.v) : fv.add(el.dataset.v); el.setAttribute('aria-pressed', fv.has(el.dataset.v)); drawList(); });
    drawList();
  }
}
function shift(month, n) { const [y, m] = month.split('-').map(Number), d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
fetch(BASE + 'venues.json', { cache: 'no-cache' }).then(r => r.json()).then(data => {
  D = data;
  render();
}).catch(() => { $('app').innerHTML = '<div class="empty">The venue data didn\'t load. Reload the page to try again.</div>'; });
