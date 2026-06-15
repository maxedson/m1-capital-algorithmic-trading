"use client";

import { startTransition, useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { CurrentPositionsPanel } from "@/components/current-positions-panel";
import { ExecutionToggle, SystemToggle } from "@/components/mode-toggle";
import { SchwabConnectionPanel } from "@/components/schwab-connection-panel";
import { StrategySelector } from "@/components/strategy-selector";
import { TradingControls } from "@/components/trading-controls";
import { WatchlistSelector } from "@/components/watchlist-selector";
import { useTrading } from "@/lib/trading-context";
import {
  currentPositions,
  executionStats,
  missionCards,
  tradeHistory,
  watchlistRows,
  watchlistSummary,
} from "@/lib/dashboard-data";

type SchwabSessionStatus = {
  connected: boolean;
  expiresAt: number | null;
  scope: string | null;
};

export default function TradingPage() {
  const { scannerState, executionState, selectedSystemState, selectedExecutionState } = useTrading();
  const [brokerStatus, setBrokerStatus] = useState<SchwabSessionStatus | null>(null);
  const [isBrokerStatusLoading, setIsBrokerStatusLoading] = useState(true);

  useEffect(() => {
    const loadBrokerStatus = async () => {
      try {
        setIsBrokerStatusLoading(true);
        const response = await fetch("/api/schwab/session", { cache: "no-store" });
        const payload = (await response.json()) as SchwabSessionStatus;
        setBrokerStatus(payload);
      } finally {
        setIsBrokerStatusLoading(false);
      }
    };

    startTransition(() => {
      void loadBrokerStatus();
    });
  }, []);

  const systemStatus = [
    {
      label: "Broker",
      value: isBrokerStatusLoading ? "Checking" : brokerStatus?.connected ? "Connected" : "Not Connected",
      tone: isBrokerStatusLoading
        ? ("neutral" as const)
        : brokerStatus?.connected
          ? ("positive" as const)
          : ("warm" as const),
    },
    {
      label: "Scanner",
      value: scannerState === "watchlist" ? "Running" : "Stopped",
      tone: scannerState === "watchlist" ? ("positive" as const) : ("neutral" as const),
    },
    {
      label: "Execution",
      value:
        executionState === "live"
          ? "Live"
          : executionState === "paper"
            ? "Paper"
            : "Off",
      tone:
        executionState === "live"
          ? ("warm" as const)
          : executionState === "paper"
            ? ("positive" as const)
            : ("neutral" as const),
    },
    {
      label: "Risk Guard",
      value: scannerState === "off" && executionState === "off" ? "Idle" : "Passing",
      tone: scannerState === "off" && executionState === "off" ? ("neutral" as const) : ("positive" as const),
    },
  ];

  return (
    <SiteShell eyebrow="Execution">
      <section className="dashboard-controls">
        <div className="controls-group">
          <SystemToggle />
        </div>
        {selectedSystemState === "watchlist" ? (
          <div className="controls-group">
            <div className="stacked-control">
              <label className="control-label" htmlFor="watchlist-select">Watchlist Criteria</label>
              <WatchlistSelector />
            </div>
          </div>
        ) : null}
        <div className="controls-group">
          <ExecutionToggle />
        </div>
        {selectedExecutionState !== "off" ? (
          <div className="controls-group">
            <div className="stacked-control">
              <label className="control-label" htmlFor="strategy-select">Execution Strategy</label>
              <StrategySelector />
            </div>
          </div>
        ) : null}
        <div className="system-health-inline">
          {systemStatus.map((item) => (
            <div key={item.label} className={`system-health-chip compact tone-${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        {!isBrokerStatusLoading && !brokerStatus?.connected ? (
          <div className="controls-group trading-controls-group">
            <a href="/api/schwab/auth/login" className="btn btn-primary">
              Connect Schwab
            </a>
          </div>
        ) : null}
        <TradingControls />
      </section>

      <section className="stats-grid">
        {executionStats.map((stat) => (
          <article key={stat.label} className="panel stat-panel">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <SchwabConnectionPanel />
      </section>

      <section className="session-metrics-strip">
        <div className="session-metrics-grid">
          {missionCards.map((item) => (
            <div key={item.label} className="session-metric-chip">
              <div className="progress-copy">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="progress-track compact-progress-track">
                <div className="progress-fill" style={{ width: item.progress }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-grid two-up">
        <CurrentPositionsPanel initialPositions={currentPositions} />

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Opportunity Set</p>
              <h2>Watchlist</h2>
            </div>
            <div className="section-summary-chips">
              {watchlistSummary.map((item) => (
                <div key={item.label} className={`section-summary-chip tone-${item.tone}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="trade-table watchlist-table-scroll">
            <div className="table-row table-head watchlist-head">
              <span>Symbol</span>
              <span>Side</span>
              <span>Setup</span>
              <span>Signal</span>
              <span>Status</span>
              <span>Score</span>
              <span>Age</span>
              <span>Reason</span>
            </div>

            {watchlistRows.map((candidate) => (
              <div
                key={candidate.symbol}
                className={`table-row watchlist-head watchlist-row tone-${candidate.tone}`}
                data-active={candidate.positionState === "In Position"}
              >
                <span>{candidate.symbol}</span>
                <span>{candidate.side}</span>
                <span>{candidate.setup}</span>
                <span>{candidate.signal}</span>
                <span>{candidate.status}</span>
                <span>{candidate.score}</span>
                <span>{candidate.signalAge}</span>
                <span className="state-pill">{candidate.reason}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="execution-history">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Completed</p>
              <h2>Trade history</h2>
            </div>
          </div>

          <div className="trade-table trade-history-table-scroll">
            <div className="table-row table-head trade-head">
              <span>Symbol</span>
              <span>Side</span>
              <span>Setup</span>
              <span>Broker Id</span>
              <span>Order Id</span>
              <span>Qty</span>
              <span>Entry</span>
              <span>Opened At</span>
              <span>Exit Price</span>
              <span>Exit</span>
              <span>Hold Time</span>
              <span>Closed At</span>
              <span>P&amp;L</span>
            </div>

            {tradeHistory.map((trade) => (
              <div key={trade.symbol} className={`table-row trade-head tone-${trade.tone}`}>
                <span>{trade.symbol}</span>
                <span>{trade.side}</span>
                <span>{trade.setup}</span>
                <span>{trade.brokerId}</span>
                <span>{trade.orderId}</span>
                <span>{trade.quantity}</span>
                <span>{trade.entry}</span>
                <span>{trade.openedAt}</span>
                <span>{trade.exitPrice}</span>
                <span>{trade.exitReason}</span>
                <span>{trade.holdTime}</span>
                <span>{trade.closedAt}</span>
                <span>{trade.result}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
