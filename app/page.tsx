import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { commandStats, focusCards, streakStats } from "@/lib/dashboard-data";

export default function Home() {
  return (
    <SiteShell
      eyebrow="Command Center"
      title="Your personal trading console."
      description="This UI is optimized for you, not for users. It should feel fast, rewarding, and brutally clear about what matters: capital, discipline, and execution."
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

      <section className="content-grid">
        {focusCards.map((card) => (
          <Link key={card.title} href={card.href} className="panel card-panel route-panel">
            <p className="panel-kicker">Open View</p>
            <h2>{card.title}</h2>
            <strong className="route-value">{card.value}</strong>
            <p>{card.meta}</p>
          </Link>
        ))}
      </section>

      <section className="content-grid two-up">
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

        <article className="panel vault-panel">
          <p className="panel-kicker">Design Direction</p>
          <h2>Gamified, but not childish.</h2>
          <p>
            The right approach is not &quot;social investing app.&quot; It is a compact console with momentum cues: streaks,
            scores, heat, badges, and progress. That gives you the Robinhood-style energy without wasting space on
            onboarding or marketing.
          </p>
        </article>
      </section>
    </SiteShell>
  );
}
