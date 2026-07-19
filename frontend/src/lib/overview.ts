/** Analyst-style overview for any item, keyed off the same categories the
 *  backend ranker uses. In live mode the backend can override this with an
 *  LLM-written summary via item.snippet; this is the instant client fallback. */
import type { NewsItem } from "../types";

export function overviewFor(n: NewsItem): string {
  if (n.snippet && n.snippet.length > 60) return n.snippet; // backend-provided
  const h = n.headline;
  const tk = n.tickers[0] ?? "the company";
  const t = (re: RegExp) => re.test(h);
  let b: string;
  if (t(/dividend/i))
    b = `${tk} has announced a cash distribution to shareholders. Key checks: implied yield at the current price, payout sustainability versus earnings and free cash flow, and any signal of a policy change. Watch the follow-up disclosure for ex-date and record date.`;
  else if (t(/profit|net income|revenue|results|GMV|loss|consensus/i))
    b = `Earnings event for ${tk}. Focus on the quality of the print — margins, one-offs, FX effects — and whether guidance or consensus estimates need to move. Expect sell-side estimate revisions within 24–48 hours and follow-through in the next trading session.`;
  else if (t(/acqui|stake|merger|takeover|spin-off/i))
    b = `Corporate action: ${tk} is changing its asset or ownership perimeter. Assess deal multiple versus trading multiple, funding mix (cash/debt/equity), and integration or approval risk. Regulatory sign-off and financing terms are the near-term catalysts.`;
  else if (t(/rate|CBE|SAMA|CBUAE|Fed|repo|monetary/i))
    b = `Macro/monetary event with direct read-through to bank margins, real-estate demand, and equity risk premia across the market. Rate-sensitive names (banks, developers, leveraged corporates) will reprice first. Watch forward guidance language for the pace of the cycle.`;
  else if (t(/capital increase|rights issue|bonus|buyback|sukuk|bond|IPO|issuance|financing|facility/i))
    b = `Capital-structure event for ${tk}. Evaluate dilution or accretion mechanics, use of proceeds, and pricing versus comparable issues. For income investors, check the impact on per-share metrics and future distribution capacity.`;
  else if (t(/contract|award|PPA|concession|order|agreement|supply/i))
    b = `Backlog event: ${tk} has added contracted revenue visibility. Key questions are margin profile versus the existing book, execution timeline, and counterparty quality. Translate the award into revenue phasing before adjusting estimates.`;
  else if (t(/CEO|board|chairman|appoint|transition|executive/i))
    b = `Governance event at ${tk}. Leadership changes can signal strategy shifts — check for continuity of capital-allocation policy and any linked disclosures. Historically these are volatility events until the incoming mandate is clarified.`;
  else if (t(/FRA|CMA|SCA|regulat|rules|framework|approval|listing/i))
    b = `Regulatory development. Map which listed names fall inside the new scope, the compliance timeline, and whether it changes the cost of capital or the listed-universe pipeline. Implementation notes usually follow within weeks.`;
  else if (t(/Moody|rating|outlook/i))
    b = `Ratings action with implications for funding costs and foreign-investor eligibility thresholds. Cross-check which issuers benefit most and whether spreads have already moved. Sovereign-linked upgrades typically lift bank valuations first.`;
  else
    b = `Routine market-flow item — session color rather than a materiality event. Useful for gauging liquidity, breadth, and positioning, but unlikely to move single-name estimates. No model impact expected.`;
  return b;
}
