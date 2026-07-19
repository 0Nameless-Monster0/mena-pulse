import { create } from "zustand";
import type { Market, TimeWindow, UaeSub } from "./types";

interface NavState {
  market: Market;
  window: TimeWindow;
  uaeSub: UaeSub;
  setMarket: (m: Market) => void;
  setWindow: (w: TimeWindow) => void;
  setUaeSub: (s: UaeSub) => void;
}

/** All filtering is client-side against loaded data — tab switches are instant. */
export const useNav = create<NavState>((set) => ({
  market: "EG",
  window: "daily",
  uaeSub: "ALL",
  setMarket: (market) => set({ market, uaeSub: "ALL" }), // reset sub-tab on macro switch
  setWindow: (window) => set({ window }),
  setUaeSub: (uaeSub) => set({ uaeSub }),
}));
