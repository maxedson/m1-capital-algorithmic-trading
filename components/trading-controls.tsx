"use client";

import { useTrading } from "@/lib/trading-context";

export function TradingControls() {
  const { mode, isTrading, setIsTrading, resetPaperTrading, activeStrategy } = useTrading();

  const isPaperTrading = mode === "paper-trading";

  const handleStartTrading = () => {
    if (!activeStrategy) {
      alert("Please select a strategy first");
      return;
    }
    setIsTrading(true);
  };

  const handleStopTrading = () => {
    setIsTrading(false);
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
      {!isTrading ? (
        <button onClick={handleStartTrading} className="btn btn-primary">
          Start Trading
        </button>
      ) : (
        <button onClick={handleStopTrading} className="btn btn-secondary">
          Stop Trading
        </button>
      )}

      {isPaperTrading && (
        <button onClick={handleResetPaper} className="btn btn-tertiary">
          Reset Paper Trading
        </button>
      )}
    </div>
  );
}
