import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { DashboardViewToggle } from "@/components/dashboard-view-toggle";
import {
  commandStats,
  dashboardSummary,
  equityBars,
  focusCards,
  heatTiles,
  performanceBreakdown,
  performanceStats,
  streakStats,
} from "@/lib/dashboard-data";

export default function Home() {
  return (
    <SiteShell eyebrow="Dashboard">
      <section className="dashboard-controls">
        <div className="controls-group">
          <label htmlFor="mode-select" className="control-label">Results</label>
          <DashboardViewToggle />
        </div>
      </section>

      <section className="stats-grid">
        {commandStats.map((stat) => (
          <article key={stat.label} className={`panel stat-panel tone-${stat.tone}`}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

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
              <p className="panel-kicker">Balance Sheet</p>
              <h2>Portfolio structure</h2>
            </div>
          </div>

          <div className="mini-grid">
            {dashboardSummary.map((item) => (
              <div key={item.label} className={`metric-chip tone-${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Edge Quality</p>
              <h2>Edge quality</h2>
            </div>
          </div>

          <div className="bullet-stack">
            {streakStats.map((item) => (
              <div key={item.label} className="mini-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="content-grid two-up">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Equity Arc</p>
              <h2>Cumulative equity</h2>
            </div>
          </div>

          <div className="chart-bars" aria-label="Equity curve chart">
            {equityBars.map((point) => (
              <div key={point.label} className="bar-group">
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${point.heightPct}%` }} />
                </div>
                <strong>{point.value}</strong>
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

      <section className="content-grid two-up">
        <article className="panel">
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
        </article>
      </section>

      <section className="content-grid two-up">
        {focusCards.map((card) => (
          <Link key={card.title} href={card.href} className="panel card-panel route-panel">
            <p className="panel-kicker">Open View</p>
            <h2>{card.title}</h2>
            <strong className="route-value">{card.value}</strong>
            <p>{card.meta}</p>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
