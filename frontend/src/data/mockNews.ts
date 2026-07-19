/**
 * Structured mock mirroring the live /api/news payload shape.
 * Hand-written material rows + procedural generators (2 high-impact and
 * 4 general items per market per day for 30 days) so every window —
 * Daily (24h), Weekly (7d), Monthly (30d) — is maximally populated.
 * `nextBreaking()` fabricates a fresh item for the 60s live-update loop.
 */
import type { NewsItem } from "../types";

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();
const seeded = (n: number) => (((n * 2654435761) >>> 0) % 1000) / 1000;

type Row = [
  string, string, NewsItem["market"], NewsItem["exchange"], string,
  number, string[], NewsItem["impact"], number, string
];

const ROWS: Row[] = [
[
"egx",
"EGX",
"EG",
"EGX",
"COMI reports FY net income of EGP 62.4bn, up 41% y/y — beats consensus",
14,
[
"COMI"
],
"high",
0.92,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"enterprise",
"Enterprise",
"EG",
null,
"CBE holds overnight rates steady, signals easing cycle could begin in Q4",
120,
[],
"high",
0.88,
"https://enterprise.news/egypt/en/"
],
[
"egx",
"EGX",
"EG",
"EGX",
"ETEL board approves cash dividend of EGP 4.10/share for FY",
180,
[
"ETEL"
],
"high",
0.84,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"egx",
"EGX",
"EG",
"EGX",
"TMGH board approves capital increase of EGP 8bn via rights issue",
300,
[
"TMGH"
],
"high",
0.85,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"egx",
"EGX",
"EG",
"EGX",
"ABUK Q4 profit climbs 22% on urea price recovery and export mix",
420,
[
"ABUK"
],
"high",
0.82,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"almal",
"Al Mal",
"EG",
null,
"SWDY wins USD 690mn transmission contract in Saudi Arabia",
540,
[
"SWDY"
],
"high",
0.78,
"https://almalnews.com"
],
[
"egx",
"EGX",
"EG",
"EGX",
"EAST receives approval for price increases across tobacco portfolio",
1320,
[
"EAST"
],
"high",
0.76,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"almal",
"Al Mal",
"EG",
null,
"ORAS consortium awarded USD 1.1bn infrastructure package",
1800,
[
"ORAS"
],
"high",
0.77,
"https://almalnews.com"
],
[
"arabfinance",
"Arab Finance",
"EG",
null,
"HRHO in advanced talks to acquire regional fintech platform — sources",
2880,
[
"HRHO"
],
"high",
0.81,
"https://www.arabfinance.com"
],
[
"mubasher_eg",
"Mubasher EG",
"EG",
null,
"FWRY Q2 revenue jumps 38% y/y as banking services scale",
3120,
[
"FWRY"
],
"high",
0.79,
"https://www.mubasher.info"
],
[
"egx",
"EGX",
"EG",
"EGX",
"PHDC launches EGP 15bn north coast project with 40% presold",
4620,
[
"PHDC"
],
"high",
0.72,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"mubasher_eg",
"Mubasher EG",
"EG",
null,
"EFIH shareholders approve 1-for-2 bonus share distribution",
8640,
[
"EFIH"
],
"high",
0.74,
"https://www.mubasher.info"
],
[
"arabfinance",
"Arab Finance",
"EG",
null,
"CIRA completes acquisition of two K-12 school platforms",
10560,
[
"CIRA"
],
"high",
0.7,
"https://www.arabfinance.com"
],
[
"enterprise",
"Enterprise",
"EG",
null,
"FRA issues new disclosure rules for listed companies effective September",
17280,
[],
"high",
0.72,
"https://enterprise.news/egypt/en/"
],
[
"enterprise",
"Enterprise",
"EG",
null,
"IMF completes program review, unlocking USD 1.2bn tranche",
21600,
[],
"high",
0.83,
"https://enterprise.news/egypt/en/"
],
[
"egx",
"EGX",
"EG",
"EGX",
"EKHO acquires 60% stake in Kuwaiti energy services group",
28800,
[
"EKHO"
],
"high",
0.75,
"https://www.egx.com.eg/en/newssearch.aspx"
],
[
"almal",
"Al Mal",
"EG",
null,
"MASR secures East Cairo land plot for EGP 10bn mixed-use scheme",
37440,
[
"MASR"
],
"high",
0.71,
"https://almalnews.com"
],
[
"arabfinance",
"Arab Finance",
"EG",
null,
"Moody's revises Egypt banking outlook to positive on FX stability",
40320,
[],
"high",
0.74,
"https://www.arabfinance.com"
],
[
"mubasher_eg",
"Mubasher EG",
"EG",
null,
"EGX30 closes 0.8% higher as banks lead; turnover at EGP 3.1bn",
55,
[],
"general",
0.22,
"https://www.mubasher.info"
],
[
"arabfinance",
"Arab Finance",
"EG",
null,
"Foreign investors net buyers for third straight session on EGX",
240,
[],
"general",
0.28,
"https://www.arabfinance.com"
],
[
"almal",
"Al Mal",
"EG",
null,
"Trading volumes light ahead of long weekend; mid-caps outperform",
480,
[],
"general",
0.2,
"https://almalnews.com"
],
[
"mubasher_eg",
"Mubasher EG",
"EG",
null,
"Most active: COMI, SWDY and TMGH dominate value traded",
600,
[
"COMI",
"SWDY",
"TMGH"
],
"general",
0.3,
"https://www.mubasher.info"
],
[
"arabfinance",
"Arab Finance",
"EG",
null,
"Analyst note: Egyptian banks still screen cheap vs GCC peers",
1800,
[],
"general",
0.29,
"https://www.arabfinance.com"
],
[
"almal",
"Al Mal",
"EG",
null,
"Weekly review: EGX30 adds 2.4% amid strong local appetite",
4320,
[],
"general",
0.2,
"https://almalnews.com"
],
[
"mubasher_eg",
"Mubasher EG",
"EG",
null,
"Mid-cap momentum continues as real estate names extend rally",
7200,
[],
"general",
0.24,
"https://www.mubasher.info"
],
[
"enterprise",
"Enterprise",
"EG",
null,
"What we're watching this month: budget season and FX flows",
28800,
[],
"general",
0.25,
"https://enterprise.news/egypt/en/"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"Aramco (2222) announces Q2 dividend of SAR 0.35/share; base payout maintained",
35,
[
"2222"
],
"high",
0.9,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"1120 Al Rajhi Bank H1 net profit rises 18% to SAR 10.9bn — beats estimates",
180,
[
"1120"
],
"high",
0.91,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"2010 SABIC Q2 loss narrows sharply on spreads; guides margin recovery",
360,
[
"2010"
],
"high",
0.86,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"SAMA follows Fed with 25bp cut to repo rate",
420,
[],
"high",
0.89,
"https://www.zawya.com"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"1180 SNB board appoints new chief executive effective August",
720,
[
"1180"
],
"high",
0.8,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"ACWA Power (2082) signs PPA for 2GW solar complex worth SAR 8.3bn",
1620,
[
"2082"
],
"high",
0.8,
"https://www.mubasher.info"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"2280 Almarai Q2 net income up 14% on poultry and dairy volumes",
1680,
[
"2280"
],
"high",
0.82,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"4013 Sulaiman Al Habib opens 500-bed flagship hospital in Riyadh",
3240,
[
"4013"
],
"high",
0.72,
"https://www.mubasher.info"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"Maaden (1211) board recommends SAR 9bn capital increase for expansion",
5760,
[
"1211"
],
"high",
0.83,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"flynas IPO order book covered 100x ahead of pricing",
7200,
[],
"high",
0.78,
"https://www.zawya.com"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"7010 stc raises dividend policy floor to SAR 0.55/quarter",
10080,
[
"7010"
],
"high",
0.81,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"2382 ADES wins drilling contracts worth USD 190mn in Gulf waters",
12960,
[
"2382"
],
"high",
0.7,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"CMA approves IPO of leading logistics firm on main market",
14400,
[],
"high",
0.76,
"https://www.zawya.com"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"PIF launches national industrial platform targeting SAR 60bn investment",
20160,
[],
"high",
0.75,
"https://www.zawya.com"
],
[
"tadawul",
"Tadawul",
"SA",
"TASI",
"1150 Alinma completes SAR 5bn tier-1 sukuk issuance",
30240,
[
"1150"
],
"high",
0.71,
"https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"Maaden (1211) takes FID on phosphate 3 expansion",
38880,
[
"1211"
],
"high",
0.73,
"https://www.mubasher.info"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"TASI ends flat near 12,400 as petchems offset banking gains",
80,
[],
"general",
0.24,
"https://www.mubasher.info"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"Petchem sector note: spreads bottoming but valuations full",
300,
[],
"general",
0.28,
"https://www.zawya.com"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"Top gainers and losers: insurance names swing on results season",
540,
[],
"general",
0.22,
"https://www.mubasher.info"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"Saudi market value traded holds above SAR 6bn for fifth session",
720,
[],
"general",
0.23,
"https://www.zawya.com"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"Most active by volume: 7010 stc leads Tadawul turnover",
1560,
[
"7010"
],
"general",
0.3,
"https://www.mubasher.info"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"Weekly technicals: TASI tests resistance at 12,550",
5760,
[],
"general",
0.21,
"https://www.zawya.com"
],
[
"zawya_sa",
"Zawya",
"SA",
null,
"Saudi market monthly wrap: value traded up 12% m/m",
11520,
[],
"general",
0.22,
"https://www.zawya.com"
],
[
"mubasher_sa",
"Mubasher SA",
"SA",
null,
"Foreign ownership in Saudi stocks hits new record — monthly data",
23040,
[],
"general",
0.27,
"https://www.mubasher.info"
],
[
"adx",
"ADX",
"AE",
"ADX",
"FAB Q2 net profit climbs 12% to AED 4.9bn on fee income strength",
22,
[
"FAB"
],
"high",
0.9,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ALDAR acquires prime Saadiyat land bank for AED 3.2bn development",
360,
[
"ALDAR"
],
"high",
0.82,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"PUREHEALTH completes acquisition of UK hospital group for GBP 1.1bn",
540,
[
"PUREHEALTH"
],
"high",
0.8,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ADNOCGAS signs USD 2.2bn LNG supply agreement with Asian buyer",
1680,
[
"ADNOCGAS"
],
"high",
0.79,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"IHC unit completes strategic stake purchase in regional AI infrastructure firm",
3000,
[
"IHC"
],
"high",
0.79,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ADCB prices USD 750mn green bond at tightest spread since 2021",
4320,
[
"ADCB"
],
"high",
0.74,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ADPORTS wins 25-year container terminal concession in Karachi",
11520,
[
"ADPORTS"
],
"high",
0.73,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"EAND raises stake in Vodafone to 18%, seeks board seat",
17280,
[
"EAND"
],
"high",
0.8,
"https://www.adx.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"MULTIPLY board approves AED 1bn share buyback program",
25920,
[
"MULTIPLY"
],
"high",
0.72,
"https://www.adx.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"EMAAR board approves special dividend of AED 0.25/share for H1",
65,
[
"EMAAR"
],
"high",
0.88,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"TALABAT Q2 GMV grows 25% y/y; raises full-year guidance",
480,
[
"TALABAT"
],
"high",
0.84,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"DIB prices USD 1bn sustainable sukuk at 4.85%, 5.6x oversubscribed",
660,
[
"DIB"
],
"high",
0.77,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"EMIRATESNBD H1 profit reaches AED 14.2bn on record retail lending",
1800,
[
"EMIRATESNBD"
],
"high",
0.85,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"SALIK announces CEO transition; CFO appointed interim chief",
7200,
[
"SALIK"
],
"high",
0.8,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"AIRARABIA confirms 20-aircraft order to anchor new Riyadh hub",
8640,
[
"AIRARABIA"
],
"high",
0.73,
"https://marketwatch.dfm.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"DEWA declares H1 dividend of AED 3.1bn, in line with policy",
21600,
[
"DEWA"
],
"high",
0.75,
"https://marketwatch.dfm.ae"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"CBUAE mirrors Fed decision, cuts base rate 25bp",
240,
[],
"high",
0.86,
"https://www.zawya.com"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"SCA unveils new listing framework to attract family businesses",
14400,
[],
"high",
0.72,
"https://www.zawya.com"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ADX general index slips 0.3%; EAND heaviest drag on turnover",
95,
[
"EAND"
],
"general",
0.26,
"https://www.adx.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"DFM daily bulletin: 28,400 trades, value at AED 612mn",
140,
[],
"general",
0.2,
"https://marketwatch.dfm.ae"
],
[
"adx",
"ADX",
"AE",
"ADX",
"ADX volumes concentrate in banks ahead of results week",
420,
[],
"general",
0.24,
"https://www.adx.ae"
],
[
"dfm",
"DFM",
"AE",
"DFM",
"Most active on DFM: EMAAR and DIB lead value traded",
720,
[
"EMAAR",
"DIB"
],
"general",
0.28,
"https://marketwatch.dfm.ae"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"Dubai property market note: off-plan sales cool from record pace",
4320,
[],
"general",
0.27,
"https://www.zawya.com"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"UAE markets weekly: ADX and DFM diverge as earnings season peaks",
8640,
[],
"general",
0.27,
"https://www.zawya.com"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"Monthly liquidity report: UAE ADVs up 9% m/m",
24480,
[],
"general",
0.23,
"https://www.zawya.com"
],
[
"zawya_ae",
"Zawya",
"AE",
null,
"Gulf funds monthly positioning survey shows overweight UAE equities",
31680,
[],
"general",
0.29,
"https://www.zawya.com"
]
] as Row[];

const CUR: Record<NewsItem["market"], string> = { EG: "EGP", SA: "SAR", AE: "AED" };
const POOLS = {
  EG: { tks: ["COMI","HRHO","TMGH","SWDY","EFIH","EAST","ABUK","ETEL","EKHO","FWRY","ORAS","PHDC","MASR","CIRA"],
        src: "EGX", key: "egx", exch: "EGX" as const, url: "https://www.egx.com.eg/en/newssearch.aspx" },
  SA: { tks: ["2222","1120","1180","7010","2010","1211","4013","2082","2280","2382","1150"],
        src: "Tadawul", key: "tadawul", exch: "TASI" as const,
        url: "https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en" },
  adx: { tks: ["FAB","EAND","IHC","ALDAR","ADCB","PUREHEALTH","ADNOCGAS","ADPORTS","MULTIPLY"] },
  dfm: { tks: ["EMAAR","DIB","EMIRATESNBD","SALIK","DEWA","TALABAT","AIRARABIA"] },
};

const HI_TPL: Array<(tk: string, c: string, r: number, d: number) => string> = [
  (tk, c, r) => `${tk} Q2 net profit ${r > 0.5 ? "rises" : "falls"} ${5 + Math.floor(r * 30)}% y/y, ${r > 0.4 ? "beating" : "missing"} consensus estimates`,
  (tk, c, r) => `${tk} board proposes cash dividend of ${c} ${(0.2 + r * 3).toFixed(2)}/share`,
  (tk, c, r) => `${tk} secures ${c} ${1 + Math.floor(r * 8)}bn financing facility to fund expansion plans`,
  (tk, c, r) => `${tk} announces buyback program of up to ${2 + Math.floor(r * 8)}% of shares outstanding`,
  (tk, c, r, d) => `${tk} wins ${["infrastructure","energy","logistics","digital services"][d % 4]} contract worth ${c} ${(0.5 + r * 4).toFixed(1)}bn`,
  (tk, c, r) => `${tk} completes acquisition of ${20 + Math.floor(r * 60)}% stake in sector peer`,
  (tk, c, r, d) => `${tk} receives regulatory approval for ${["capital increase","new product line","cross-listing","subsidiary spin-off"][d % 4]}`,
];

function genHigh(): NewsItem[] {
  const out: NewsItem[] = [];
  const offset = { EG: 0, SA: 20, AE: 40 };
  for (let d = 0; d < 30; d++) for (let k = 0; k < 2; k++) {
    const mins = d * 1440 + 180 + k * 330 + Math.floor(seeded(d * 3 + k) * 200);
    (["EG", "SA", "AE"] as const).forEach((mkt) => {
      const rr = seeded(d * 13 + k * 11 + { EG: 0, SA: 41, AE: 83 }[mkt]);
      let tk: string, source: string, source_key: string, exchange: NewsItem["exchange"], url: string;
      if (mkt === "AE") {
        const useAdx = (d + k) % 2 === 0;
        const pool = useAdx ? POOLS.adx.tks : POOLS.dfm.tks;
        tk = pool[(d * 3 + k * 5) % pool.length];
        source = useAdx ? "ADX" : "DFM"; source_key = source.toLowerCase(); exchange = source as "ADX" | "DFM";
        url = useAdx ? "https://www.adx.ae" : "https://marketwatch.dfm.ae";
      } else {
        const p = POOLS[mkt];
        tk = p.tks[(d * 3 + k * 5) % p.tks.length];
        source = p.src; source_key = p.key; exchange = p.exch; url = p.url;
      }
      out.push({
        id: `gh-${mkt}-${d}-${k}`, source_key, source, market: mkt, exchange,
        headline: HI_TPL[(d + k * 3 + { EG: 0, SA: 2, AE: 4 }[mkt]) % HI_TPL.length](tk, CUR[mkt], rr, d),
        snippet: "", url, published_at: ago(mins + offset[mkt]),
        tickers: [tk], impact: "high", score: 0.7 + rr * 0.25,
      });
    });
  }
  return out;
}

const GEN_TPL: Record<NewsItem["market"], Array<(r: number, d: number) => string>> = {
  EG: [
    (r) => `EGX pre-open: order books point ${r > 0.5 ? "firmer" : "softer"}; ${3 + Math.floor(r * 6)} names on watch after overnight disclosures`,
    () => `Midday most active: turnover concentrated in banking and real estate names`,
    (r, d) => `EGX session recap: EGX30 closes ${(r * 2.4 - 1.2).toFixed(1)}% ${r > 0.5 ? "higher" : "lower"} at ${(33500 + Math.floor(seeded(d + 51) * 900)).toLocaleString()}; turnover EGP ${(2 + r * 2.5).toFixed(1)}bn`,
    (r) => `Flows watch: ${r > 0.5 ? "foreign" : "local institutional"} investors net ${r > 0.4 ? "buyers" : "sellers"} for the session`,
  ],
  SA: [
    (r) => `Tadawul pre-open: ${r > 0.5 ? "petchems" : "banks"} in focus as ${r > 0.4 ? "oil holds gains" : "results season continues"}`,
    (r) => `Midday: value traded tracking SAR ${(4 + r * 4).toFixed(1)}bn; breadth ${r > 0.5 ? "positive" : "negative"}`,
    (r, d) => `Tadawul recap: TASI ends ${(r * 2.4 - 1.2).toFixed(1)}% ${r > 0.5 ? "higher" : "lower"} at ${(12100 + Math.floor(seeded(d + 71) * 700)).toLocaleString()}; value traded SAR ${(5 + r * 3).toFixed(1)}bn`,
    (r) => `QFI monthly flows: foreign investors net ${r > 0.5 ? "buy" : "sell"} SAR ${(0.4 + r * 2).toFixed(1)}bn`,
  ],
  AE: [
    (r) => `UAE pre-open: GCC peers ${r > 0.5 ? "firm" : "mixed"}; watch banks ahead of ${r > 0.4 ? "results" : "dividend dates"}`,
    (r) => `ADX midday: FADGI ${r > 0.5 ? "up" : "down"} ${(r * 0.9).toFixed(1)}%; value AED ${(0.8 + r * 1.2).toFixed(1)}bn`,
    (r, d) => `DFM close: DFMGI ${r > 0.5 ? "higher" : "lower"} ${(r * 1.1).toFixed(1)}%; ${(22000 + Math.floor(seeded(d + 91) * 9000)).toLocaleString()} trades, value AED ${400 + Math.floor(r * 350)}mn`,
    (r) => `Gulf funds note: UAE positioning ${r > 0.5 ? "extends overweight" : "trimmed"} per weekly survey`,
  ],
};

function genGeneral(): NewsItem[] {
  const out: NewsItem[] = [];
  const offset = { EG: 0, SA: 15, AE: 30 };
  for (let d = 0; d < 30; d++) for (let j = 0; j < 4; j++) {
    const mins = d * 1440 + [70, 240, 430, 560][j] + Math.floor(seeded(d * 5 + j) * 60);
    (["EG", "SA", "AE"] as const).forEach((mkt) => {
      const r = seeded(d * 29 + j * 13 + { EG: 1, SA: 47, AE: 89 }[mkt]);
      let source = "Zawya", source_key = mkt === "EG" ? "mubasher_eg" : mkt === "SA" ? "mubasher_sa" : "zawya_ae",
          exchange: NewsItem["exchange"] = null, url = "https://www.zawya.com";
      if (mkt === "EG") { source = "Mubasher EG"; url = "https://www.mubasher.info"; }
      if (mkt === "SA") { source = "Mubasher SA"; url = "https://www.mubasher.info"; }
      if (mkt === "AE" && j === 1) { source = "ADX"; source_key = "adx"; exchange = "ADX"; url = "https://www.adx.ae"; }
      if (mkt === "AE" && j === 2) { source = "DFM"; source_key = "dfm"; exchange = "DFM"; url = "https://marketwatch.dfm.ae"; }
      out.push({
        id: `gg-${mkt}-${d}-${j}`, source_key, source, market: mkt, exchange,
        headline: GEN_TPL[mkt][j](r, d), snippet: "", url,
        published_at: ago(mins + offset[mkt]), tickers: [], impact: "general", score: 0.22,
      });
    });
  }
  return out;
}

export const MOCK_NEWS: NewsItem[] = [
  ...ROWS.map(([source_key, source, market, exchange, headline, mins, tickers, impact, score, url], i): NewsItem => ({
    id: `mock-${i}`, source_key, source, market, exchange, headline,
    snippet: "", url, published_at: ago(mins), tickers, impact, score,
  })),
  ...genHigh(),
  ...genGeneral(),
];

// ── 60-second live loop: fabricate a breaking item per tick (mock mode) ────
const BRK: Array<[NewsItem["market"], string, string, NewsItem["exchange"], (r: number) => string, string[], NewsItem["impact"], string]> = [
  ["EG", "egx", "EGX", "EGX", (r) => `COMI trading update: management flags ${r > 0.5 ? "stronger" : "steady"} fee income into Q3`, ["COMI"], "high", "https://www.egx.com.eg/en/newssearch.aspx"],
  ["SA", "tadawul", "Tadawul", "TASI", (r) => `2222 Aramco confirms scheduled maintenance at ${r > 0.5 ? "two" : "one"} gas processing trains — no output impact`, ["2222"], "high", "https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/issuer-news?locale=en"],
  ["AE", "dfm", "DFM", "DFM", (r) => `EMAAR reports ${(2 + r * 3).toFixed(1)}k unit presales in new launch within 24 hours`, ["EMAAR"], "high", "https://marketwatch.dfm.ae"],
  ["EG", "mubasher_eg", "Mubasher EG", null, (r) => `EGX intraday: EGX30 ${r > 0.5 ? "extends gains" : "pares losses"}, now ${r > 0.5 ? "+" : "-"}${(r * 0.9).toFixed(1)}%`, [], "general", "https://www.mubasher.info"],
  ["AE", "adx", "ADX", "ADX", (r) => `FAB block trade crosses at market: AED ${Math.floor(120 + r * 300)}mn`, ["FAB"], "high", "https://www.adx.ae"],
  ["SA", "mubasher_sa", "Mubasher SA", null, (r) => `Tadawul intraday: TASI ${r > 0.5 ? "firms" : "slips"} as ${r > 0.4 ? "banks" : "petchems"} rotate`, [], "general", "https://www.mubasher.info"],
];

export function nextBreaking(i: number): NewsItem {
  const [market, source_key, source, exchange, fn, tickers, impact, url] = BRK[i % BRK.length];
  const r = seeded(i * 31 + 7);
  return {
    id: `brk-${i}`, source_key, source, market, exchange, headline: fn(r),
    snippet: "", url, published_at: new Date().toISOString(),
    tickers, impact, score: impact === "high" ? 0.8 : 0.25,
  };
}
