"use client";

import { useMemo, useState } from "react";

type PositionRow = {
  symbol: string;
  side: string;
  entry: string;
  mark: string;
  weight: string;
  risk: string;
  stop: string;
  target: string;
  pnl: string;
  riskAmount: number;
  isNearStop: boolean;
  tone: "positive" | "negative" | "neutral" | "warm";
};

type Props = {
  initialPositions: PositionRow[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CurrentPositionsPanel({ initialPositions }: Props) {
  const [hiddenSymbols, setHiddenSymbols] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const positions = useMemo(
    () => initialPositions.filter((position) => !hiddenSymbols.includes(position.symbol)),
    [hiddenSymbols, initialPositions],
  );

  const summary = useMemo(() => {
    const openRisk = positions.reduce((sum, position) => sum + position.riskAmount, 0);

    return [
      { label: "Open Positions", value: String(positions.length), tone: "neutral" as const },
      { label: "Open Risk", value: formatCurrency(openRisk), tone: "warm" as const },
    ];
  }, [positions]);

  const handleSell = (symbol: string) => {
    const confirmed = confirm(`Manually sell ${symbol} and exit the position?`);
    if (!confirmed) return;

    setHiddenSymbols((current) => [...current, symbol]);
    setLastAction(`${symbol} manually exited.`);
  };

  const handleSellAll = () => {
    if (positions.length === 0) return;

    const confirmed = confirm("Manually sell all open positions and flatten the book?");
    if (!confirmed) return;

    setHiddenSymbols(initialPositions.map((position) => position.symbol));
    setLastAction("All positions manually exited.");
  };

  return (
    <article className="panel">
      <div className="section-heading">
        <div>
          <p className="panel-kicker">Live Risk</p>
          <h2>Current positions</h2>
        </div>
        <div className="positions-heading-actions">
          <div className="section-summary-chips">
            {summary.map((item) => (
              <div key={item.label} className={`section-summary-chip tone-${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSellAll}
            className="btn btn-tertiary"
            disabled={positions.length === 0}
          >
            Sell All
          </button>
        </div>
      </div>

      {lastAction ? <p className="positions-override-note">{lastAction}</p> : null}

      <div className="trade-table positions-table-scroll">
        <div className="table-row table-head positions-head">
          <span>Symbol</span>
          <span>Side</span>
          <span>Entry</span>
          <span>Mark</span>
          <span>Weight</span>
          <span>Risk</span>
          <span>Stop</span>
          <span>Target</span>
          <span>P&amp;L</span>
          <span>Override</span>
        </div>

        {positions.map((position) => (
          <div key={position.symbol} className={`table-row positions-head tone-${position.tone}`}>
            <span>{position.symbol}</span>
            <span>{position.side}</span>
            <span>{position.entry}</span>
            <span>{position.mark}</span>
            <span>{position.weight}</span>
            <span>{position.risk}</span>
            <span>{position.stop}</span>
            <span>{position.target}</span>
            <span>{position.pnl}</span>
            <button
              type="button"
              onClick={() => handleSell(position.symbol)}
              className="btn btn-tertiary positions-override-btn"
            >
              Sell
            </button>
          </div>
        ))}

        {positions.length === 0 ? (
          <div className="table-row positions-head positions-empty-state">
            <span>No open positions.</span>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>
    </article>
  );
}
