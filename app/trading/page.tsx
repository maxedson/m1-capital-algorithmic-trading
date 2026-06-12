import { SiteShell } from "@/components/site-shell";
import { CurrentPositionsPanel } from "@/components/current-positions-panel";
import { ModeToggle } from "@/components/mode-toggle";
import { StrategySelector } from "@/components/strategy-selector";
import { TradingControls } from "@/components/trading-controls";
import {
  currentPositions,
  executionStats,
  missionCards,
  systemStatus,
  tradeHistory,
  watchlistRows,
  watchlistSummary,
} from "@/lib/dashboard-data";

export default function TradingPage() {
  return (
    <SiteShell eyebrow="Execution">
      <section className="execution-header">
        <div className="execution-controls">
          <div className="controls-group">
            <label htmlFor="mode-select" className="control-label">Mode</label>
            <ModeToggle />
          </div>
          <div className="controls-group">
            <StrategySelector />
          </div>
          <div className="controls-group trading-controls-group">
            <TradingControls />
          </div>
        </div>

        <div className="system-health-strip">
          <div className="system-health-label">
            <p className="panel-kicker">System Readiness</p>
            <strong>Operational checks</strong>
          </div>

          <div className="system-health-grid">
            {systemStatus.map((item) => (
              <div key={item.label} className={`system-health-chip tone-${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="execution-stats-heading">
          <p className="panel-kicker">Session Metrics</p>
        </div>

        {executionStats.map((stat) => (
          <article key={stat.label} className="panel stat-panel">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
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
              <span>Status</span>
              <span>Exit</span>
              <span>R</span>
              <span>P&amp;L</span>
              <span>Grade</span>
            </div>

            {tradeHistory.map((trade) => (
              <div key={trade.symbol} className={`table-row trade-head tone-${trade.tone}`}>
                <span>{trade.symbol}</span>
                <span>{trade.side}</span>
                <span>{trade.status}</span>
                <span>{trade.exitReason}</span>
                <span>{trade.rMultiple}</span>
                <span>{trade.result}</span>
                <span className="grade-pill">{trade.grade}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
