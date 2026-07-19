export type Market = "EG" | "SA" | "AE";
export type TimeWindow = "daily" | "weekly" | "monthly";
export type UaeSub = "ALL" | "ADX" | "DFM";
export type Impact = "high" | "general";

export interface NewsItem {
  id: string;
  source: string;          // display tag: EGX, Enterprise, Tadawul…
  source_key: string;
  market: Market;
  exchange?: "EGX" | "TASI" | "ADX" | "DFM" | null;
  headline: string;
  snippet?: string;
  url: string;             // absolute link, opens in new tab
  published_at: string;    // ISO 8601
  tickers: string[];
  impact: Impact;
  score: number;
}
