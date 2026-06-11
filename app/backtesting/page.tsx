import { SiteShell } from "@/components/site-shell";
import { backtestRuns, modelBadges, simulationMetrics } from "@/lib/dashboard-data";

export default function BacktestingPage() {
  return (
    <SiteShell
      eyebrow="Research"
      title="Simulation lab and promotion queue."
      description="This is where strategies earn the right to go live. The UI should feel competitive: compare models, score them, and keep bad assumptions exposed."
      aside={
        <div className="hero-score">
          <span>Promote Queue</span>
          <strong>1</strong>
          <small>Momentum Basket v1</small>
        </div>
      }
    >
      <section className="stats-grid">
        {simulationMetrics.map((stat) => (
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
              <p className="panel-kicker">Models</p>
              <h2>Research badges</h2>
            </div>
          </div>

          <div className="badge-grid">
            {modelBadges.map((item) => (
              <div key={item.label} className="badge-card">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel vault-panel">
          <p className="panel-kicker">Promotion Rule</p>
          <h2>Backtesting should be adversarial.</h2>
          <p>
            The page should not flatter the strategy. It should pressure-test it. Good UX here means assumptions,
            drawdown, and sample weakness are visible without digging.
          </p>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="panel-kicker">Runs</p>
            <h2>Strategy leaderboard</h2>
          </div>
        </div>

        <div className="trade-table">
          <div className="table-row table-head backtest-head">
            <span>Model</span>
            <span>Range</span>
            <span>CAGR</span>
            <span>Drawdown</span>
            <span>Status</span>
          </div>

          {backtestRuns.map((run) => (
            <div key={run.name} className={`table-row backtest-head tone-${run.tone}`}>
              <span>{run.name}</span>
              <span>{run.range}</span>
              <span>{run.cagr}</span>
              <span>{run.drawdown}</span>
              <span>{run.status}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
