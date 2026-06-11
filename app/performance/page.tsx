import { SiteShell } from "@/components/site-shell";
import { heatTiles, performanceBreakdown, performanceStats, tradingSystemState } from "@/lib/dashboard-data";

export default function PerformancePage() {
  return (
    <SiteShell
      eyebrow="Performance"
      title="Capital curve and scorekeeping."
      description="This view should feel like the season summary for your system: progress, stability, heat, and whether the edge is actually compounding."
      aside={
        <div className="hero-score">
          <span>Momentum Score</span>
          <strong>91</strong>
          <small>Above monthly target</small>
        </div>
      }
    >
      <section className="stats-grid">
        {performanceStats.map((stat) => (
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
              <p className="panel-kicker">Equity Arc</p>
              <h2>Weekly climb</h2>
            </div>
          </div>

          <div className="chart-bars" aria-label="Equity curve chart">
            {tradingSystemState.equityCurve.map((point) => (
              <div key={point.label} className="bar-group">
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${point.pctOfPeak}%` }} />
                </div>
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Return Heat</p>
              <h2>Recent sessions</h2>
            </div>
          </div>

          <div className="heat-grid">
            {heatTiles.map((tile) => (
              <div key={tile.label} className={`heat-tile tone-${tile.tone}`}>
                <span>{tile.label}</span>
                <strong>{tile.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="panel-kicker">Breakdown</p>
            <h2>Return windows</h2>
          </div>
        </div>

        <div className="mini-grid">
          {performanceBreakdown.map((item) => (
            <div key={item.label} className="metric-chip">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
