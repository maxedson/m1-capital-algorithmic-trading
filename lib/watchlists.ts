export type WatchlistDefinition = {
  id: string;
  name: string;
  description: string;
};

export const watchlists: WatchlistDefinition[] = [
  {
    id: "opening-range-momentum",
    name: "Opening Range Momentum",
    description: "High-relative-volume names with early session expansion and clean intraday trend structure.",
  },
  {
    id: "earnings-follow-through",
    name: "Earnings Follow-Through",
    description: "Post-earnings movers holding gap levels with sustained liquidity and directional continuation.",
  },
  {
    id: "mean-reversion-extremes",
    name: "Mean Reversion Extremes",
    description: "Overextended symbols screening for exhaustion, reclaim attempts, and fade setups.",
  },
];

export const defaultWatchlistId = watchlists[0]?.id ?? "";
