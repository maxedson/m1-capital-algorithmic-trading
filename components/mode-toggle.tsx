"use client";

import { useTrading } from "@/lib/trading-context";

export function SystemToggle() {
  const {
    scannerState,
    selectedSystemState,
    selectSystemState,
  } = useTrading();
  const isWatchlistInitialized = scannerState === "watchlist";
  const isSystemLocked = isWatchlistInitialized;

  return (
    <div className="mode-control">
      <span className="control-label">System</span>
      <div className="mode-toggle">
        <button
          onClick={() => selectSystemState("off")}
          className={`mode-button ${selectedSystemState === "off" ? "active" : ""}`}
          aria-pressed={selectedSystemState === "off"}
          disabled={isSystemLocked}
        >
          Off
        </button>
        <button
          onClick={() => selectSystemState("watchlist")}
          className={`mode-button ${selectedSystemState === "watchlist" ? "active" : ""}`}
          aria-pressed={selectedSystemState === "watchlist"}
          disabled={isSystemLocked}
        >
          Watchlist Ready
        </button>
      </div>
    </div>
  );
}

export function ExecutionToggle() {
  const {
    scannerState,
    executionState,
    selectedExecutionState,
    selectExecutionState,
  } = useTrading();
  const isWatchlistInitialized = scannerState === "watchlist";
  const isExecutionActive = executionState !== "off";
  const isExecutionLocked = isExecutionActive;

  return (
    <div className="mode-control">
      <span className="control-label">Execution</span>
      <div className="mode-toggle">
        <button
          onClick={() => selectExecutionState("off")}
          className={`mode-button ${selectedExecutionState === "off" ? "active" : ""}`}
          aria-pressed={selectedExecutionState === "off"}
          disabled={!isWatchlistInitialized || isExecutionLocked}
        >
          Off
        </button>
        <button
          onClick={() => selectExecutionState("paper")}
          className={`mode-button ${selectedExecutionState === "paper" ? "active" : ""}`}
          aria-pressed={selectedExecutionState === "paper"}
          disabled={!isWatchlistInitialized || isExecutionLocked}
        >
          Paper Trading
        </button>
        <button
          type="button"
          className="mode-button disabled-live-mode"
          aria-disabled="true"
          disabled
          title="Live trading is disabled until Schwab Accounts and Trading is explicitly enabled."
        >
          Live Trading Disabled
        </button>
      </div>
    </div>
  );
}

export function ModeToggle() {
  return (
    <div className="execution-mode-grid">
      <SystemToggle />
      <ExecutionToggle />
    </div>
  );
}
