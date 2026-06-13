"use client";

import { useTrading } from "@/lib/trading-context";

export function TradingControls() {
  const {
    scannerState,
    executionState,
    selectedSystemState,
    selectedExecutionState,
    startWatchlist,
    stopWatchlist,
    startPaperTrading,
    startLiveTrading,
    stopExecution,
    activeStrategies,
    resetPaperTrading,
  } = useTrading();

  const isWatchlistActive = scannerState === "watchlist";
  const isPaperTrading = executionState === "paper";
  const isLiveTrading = executionState === "live";
  const hasExecutionStrategy = activeStrategies.length > 0;

  const handleStart = () => {
    if (!isWatchlistActive && selectedSystemState === "watchlist") {
      startWatchlist();
      return;
    }

    if (selectedExecutionState === "paper") {
      if (!hasExecutionStrategy) return;
      startPaperTrading();
      return;
    }

    if (selectedExecutionState === "live") {
      if (!hasExecutionStrategy) return;
      const confirmed = confirm(
        "Start live trading? Orders will be sent to your broker account."
      );

      if (confirmed) {
        startLiveTrading();
      }
    }
  };

  const handleResetPaper = () => {
    const confirmed = confirm(
      "Reset paper trading? This will clear all positions and reset balance to $100,000."
    );

    if (confirmed) {
      resetPaperTrading(100000);
    }
  };

  if (isPaperTrading) {
    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={stopExecution} className="btn btn-tertiary">
            Stop Paper Trading
          </button>
        </div>
      </div>
    );
  }

  if (isLiveTrading) {
    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={stopExecution} className="btn btn-tertiary">
            Stop Live Trading
          </button>
        </div>
      </div>
    );
  }

  if (isWatchlistActive && selectedExecutionState === "paper") {
    if (!hasExecutionStrategy) {
      return (
        <div className="trading-controls-shell">
          <div className="trading-controls">
            <button onClick={handleResetPaper} className="btn btn-tertiary">
              Reset Paper Trading
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={handleStart} className="btn btn-primary">
            Start Paper Trading
          </button>
          <button onClick={handleResetPaper} className="btn btn-tertiary">
            Reset Paper Trading
          </button>
        </div>
      </div>
    );
  }

  if (isWatchlistActive && selectedExecutionState === "live") {
    if (!hasExecutionStrategy) {
      return null;
    }

    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={handleStart} className="btn btn-primary">
            Start Live Trading
          </button>
        </div>
      </div>
    );
  }

  if (isWatchlistActive) {
    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={stopWatchlist} className="btn btn-tertiary">
            Stop Watchlist
          </button>
        </div>
      </div>
    );
  }

  if (selectedSystemState === "watchlist") {
    return (
      <div className="trading-controls-shell">
        <div className="trading-controls">
          <button onClick={handleStart} className="btn btn-primary">
            Start Watchlist
          </button>
        </div>
      </div>
    );
  }

  return null;
}
