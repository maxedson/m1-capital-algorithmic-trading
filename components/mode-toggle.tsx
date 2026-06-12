"use client";

import { useTrading } from "@/lib/trading-context";

export function ModeToggle() {
  const { mode, setMode, isTrading } = useTrading();

  const isLiveTrading = mode === "live-trading";
  const isPaperTrading = mode === "paper-trading";

  return (
    <div className="mode-toggle">
      <button
        onClick={() => !isTrading && setMode("live-trading")}
        disabled={isTrading && !isLiveTrading}
        className={`mode-button ${isLiveTrading ? "active" : ""}`}
        aria-pressed={isLiveTrading}
      >
        Live Trading
      </button>
      <button
        onClick={() => !isTrading && setMode("paper-trading")}
        disabled={isTrading && !isPaperTrading}
        className={`mode-button ${isPaperTrading ? "active" : ""}`}
        aria-pressed={isPaperTrading}
      >
        Paper Trading
      </button>
    </div>
  );
}
