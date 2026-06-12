"use client";

import { useTrading } from "@/lib/trading-context";

const STRATEGIES = [
  { id: "momentum-basket", name: "Momentum Basket" },
  { id: "mean-reversion", name: "Mean Reversion" },
  { id: "volatility-breakout", name: "Volatility Breakout" },
  { id: "trend-follower", name: "Trend Follower" },
];

export function StrategySelector() {
  const { activeStrategy, setActiveStrategy } = useTrading();

  return (
    <div className="strategy-selector">
      <label htmlFor="strategy-select" className="control-label">Strategy</label>
      <select
        id="strategy-select"
        value={activeStrategy || ""}
        onChange={(e) => setActiveStrategy(e.target.value)}
        className="select-input"
      >
        <option value="">Select a strategy...</option>
        {STRATEGIES.map((strat) => (
          <option key={strat.id} value={strat.id}>
            {strat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
