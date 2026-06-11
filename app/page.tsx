import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import {
  commandStats,
  focusCards,
  heatTiles,
  performanceBreakdown,
  performanceStats,
  streakStats,
  tradingSystemState,
} from "@/lib/dashboard-data";

export default function Home() {
  return (
    <SiteShell
      eyebrow="Dashboard"
      title="Your personal trading console."
      description="One page for the current state of the system and the capital curve behind it. Execution and research stay separate, but performance belongs on the main dashboard."
      aside={
        <div className="hero-score">
          <span>Session Rank</span>
          <strong>S+</strong>
          <small>7 green days in a row</small>
        </div>
      }
    >
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

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">Streaks</p>
              <h2>Behavior loop</h2>
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
