"use client";

import { useTrading } from "@/lib/trading-context";

export function TradingControls() {
  const {
    scannerState,
    executionState,
    stopWatchlist,
    startWatchlist,
    startPaperTrading,
    startLiveTrading,
    stopExecution,
    resetPaperTrading,
    activeStrategies,
  } = useTrading();

  const isPaperTrading = executionState === "paper";
  const isScannerOff = scannerState === "off";

  const ensureStrategiesSelected = () => {
    if (activeStrategies.length === 0) {
      alert("Please select at least one strategy first");
      return false;
    }
    return true;
  };

  const handleResetPaper = () => {
    const confirmed = confirm(
      "Reset paper trading? This will clear all positions and reset balance to $100,000."
    );
    if (confirmed) {
      resetPaperTrading(100000);
    }
  };

  return (
    <div className="trading-controls">
      {isScannerOff ? (
        <button
          onClick={() => {
            if (!ensureStrategiesSelected()) return;
            startWatchlist();
          }}
          className="btn btn-primary"
        >
          Start Watchlist
        </button>
      ) : (
        <>
          {executionState === "off" ? (
            <>
              <button onClick={stopWatchlist} className="btn btn-secondary">
                Stop Watchlist
              </button>
              <button
                onClick={() => {
                  if (!ensureStrategiesSelected()) return;
                  startPaperTrading();
                }}
                className="btn btn-primary"
              >
                Start Paper
              </button>
              <button
                onClick={() => {
                  if (!ensureStrategiesSelected()) return;
                  startLiveTrading();
                }}
                className="btn btn-secondary"
              >
                Start Live
              </button>
            </>
          ) : executionState === "paper" ? (
            <>
              <button onClick={stopExecution} className="btn btn-secondary">
                Stop Paper
              </button>
              <button
                onClick={() => {
                  if (!ensureStrategiesSelected()) return;
                  startLiveTrading();
                }}
                className="btn btn-primary"
              >
                Go Live
              </button>
            </>
          ) : (
            <>
              <button onClick={stopExecution} className="btn btn-secondary">
                Stop Live
              </button>
              <button onClick={startWatchlist} className="btn btn-tertiary">
                Watchlist Only
              </button>
            </>
          )}
        </>
      )}

      {isPaperTrading && (
        <button onClick={handleResetPaper} className="btn btn-tertiary">
          Reset Paper Trading
        </button>
      )}
    </div>
  );
}
