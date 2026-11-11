// Builds today's Life HQ Reality Check for the widget.
// Same rule as the Life HQ dashboard: index = (dayNumber * 37) % 72,
// where dayNumber = whole days from 1 Jan 1970 to today's date.
// "Today" is the calendar date in Perth (Australia/Perth, UTC+8, no daylight saving).
// No dependencies. Run with:  node build.mjs   (optional: node build.mjs 2026-11-12)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const TZ = "Australia/Perth";
const MESSAGES = JSON.parse(readFileSync(new URL("./messages.json", import.meta.url), "utf8"));
if (!Array.isArray(MESSAGES) || MESSAGES.length === 0) throw new Error("messages.json must be a non-empty list");

export function perthDate(now = new Date()) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function dayNumber(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}
export function pick(ymd) {
  const index = (dayNumber(ymd) * 37) % MESSAGES.length;
  return { index, message: MESSAGES[index] };
}
function addDays(ymd, n) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function longDate(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
}
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const date = process.argv[2] || perthDate();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date must look like 2026-11-12");
const { index, message } = pick(date);

// Only date-based content goes in the files, so re-running on the same day changes nothing.
const today = { date, timezone: TZ, label: longDate(date), title: "Today's reality check", message, index, total: MESSAGES.length, tagline: "Less juggling. More living." };
const days = {};
for (let i = -1; i <= 400; i++) { const d = addDays(date, i); days["d" + d.replaceAll("-", "")] = pick(d).message; }

mkdirSync(new URL("./docs/", import.meta.url), { recursive: true });
writeFileSync(new URL("./docs/today.json", import.meta.url), JSON.stringify(today, null, 2) + "\n");
writeFileSync(new URL("./docs/today.txt", import.meta.url), message + "\n");
writeFileSync(new URL("./docs/days.json", import.meta.url), JSON.stringify({ timezone: TZ, from: addDays(date, -1), days }, null, 1) + "\n");
writeFileSync(new URL("./docs/.nojekyll", import.meta.url), "");
writeFileSync(new URL("./docs/index.html", import.meta.url), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Today's Reality Check</title>
<style>
:root{--cream:#FBF6F1;--blush:#F3D9D8;--terracotta:#9C5640;--ink:#3B2C2B;--muted:#7A6662}
@media (prefers-color-scheme:dark){:root{--cream:#1D1716;--blush:#3E2A2C;--terracotta:#E3A08A;--ink:#F4E9E4;--muted:#BBA8A2}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--cream);color:var(--ink);font-family:Georgia,"Times New Roman",serif;padding:24px 16px;box-sizing:border-box}
.card{max-width:34rem;background:var(--blush);border-radius:24px;padding:28px 28px 24px}
.k{font:600 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--terracotta)}
p{font-style:italic;font-size:clamp(20px,5vw,26px);line-height:1.35;margin:10px 0 14px}
.d{font:13px system-ui,sans-serif;color:var(--muted)}
</style></head>
<body><main class="card"><div class="k">Today's reality check</div><p>${esc(message)}</p><div class="d">${esc(today.label)} · Less juggling. More living.</div></main></body></html>
`);
console.log(`${date} (${TZ}) → #${index}: ${message}`);
