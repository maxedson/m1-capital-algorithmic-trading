"use client";

import { useTrading } from "@/lib/trading-context";

export function ModeToggle() {
  const { scannerState, executionState, startWatchlist, stopWatchlist, startPaperTrading, startLiveTrading } = useTrading();

  const isWatchlistOnly = scannerState === "watchlist" && executionState === "off";
  const isPaperTrading = executionState === "paper";
  const isLiveTrading = executionState === "live";
  const isStandby = scannerState === "off" && executionState === "off";

  return (
    <div className="mode-toggle">
      <button
        onClick={stopWatchlist}
        className={`mode-button ${isStandby ? "active" : ""}`}
        aria-pressed={isStandby}
      >
        Standby
      </button>
      <button
        onClick={startWatchlist}
        className={`mode-button ${isWatchlistOnly ? "active" : ""}`}
        aria-pressed={isWatchlistOnly}
      >
        Watchlist
      </button>
      <button
        onClick={startPaperTrading}
        className={`mode-button ${isPaperTrading ? "active" : ""}`}
        aria-pressed={isPaperTrading}
      >
        Paper Trading
      </button>
      <button
        onClick={startLiveTrading}
        className={`mode-button ${isLiveTrading ? "active" : ""}`}
        aria-pressed={isLiveTrading}
      >
        Live Trading
      </button>
    </div>
  );
}
