/** Split a headline into text/ticker segments so tickers render as badges. */
export function segmentHeadline(
  headline: string,
  tickers: string[]
): Array<{ text: string; ticker: boolean }> {
  if (!tickers.length) return [{ text: headline, ticker: false }];
  const pattern = new RegExp(`\\b(${tickers.map(escapeRe).join("|")})\\b`, "g");
  const out: Array<{ text: string; ticker: boolean }> = [];
  let last = 0;
  for (const m of headline.matchAll(pattern)) {
    if (m.index! > last) out.push({ text: headline.slice(last, m.index), ticker: false });
    out.push({ text: m[0], ticker: true });
    last = m.index! + m[0].length;
  }
  if (last < headline.length) out.push({ text: headline.slice(last), ticker: false });
  return out;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
