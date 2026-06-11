import { SiteShell } from "@/components/site-shell";
import { dailyTrades, executionStats, missionCards, systemStatus } from "@/lib/dashboard-data";

export default function TradingPage() {
  return (
    <SiteShell
      eyebrow="Execution"
      title="Live flow, system health, and session pressure."
      description="This should feel like the cockpit. You want immediate awareness of signal quality, queue state, open risk, and whether you are trading cleanly."
      aside={
        <div className="hero-score">
          <span>Discipline XP</span>
          <strong>2,140</strong>
          <small>+180 from yesterday</small>
        </div>
      }
    >
      <section className="stats-grid">
        {executionStats.map((stat) => (
          <article key={stat.label} className="panel stat-panel">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid two-up">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">System Health</p>
              <h2>Processing state</h2>
            </div>
          </div>

          <div className="status-stack">
            {systemStatus.map((item) => (
              <div key={item.label} className={`status-row tone-${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Session Rewards</p>
              <h2>Operator feedback</h2>
            </div>
          </div>

          <div className="progress-stack">
            {missionCards.map((item) => (
              <div key={item.label} className="progress-card">
                <div className="progress-copy">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: item.progress }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="panel-kicker">Active Tape</p>
            <h2>Trade feed</h2>
          </div>
        </div>

        <div className="trade-table">
          <div className="table-row table-head trade-head">
            <span>Symbol</span>
            <span>Side</span>
            <span>Status</span>
            <span>P&amp;L</span>
            <span>Grade</span>
          </div>

          {dailyTrades.map((trade) => (
            <div key={trade.symbol} className={`table-row trade-head tone-${trade.tone}`}>
              <span>{trade.symbol}</span>
              <span>{trade.side}</span>
              <span>{trade.status}</span>
              <span>{trade.pnl}</span>
              <span className="grade-pill">{trade.score}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
