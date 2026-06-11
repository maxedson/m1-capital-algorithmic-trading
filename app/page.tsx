const platformSections = [
  {
    title: "Execution Layer",
    body: "Build order routing, position sizing, and risk checks against the Charles Schwab API in isolated services.",
  },
  {
    title: "Strategy Engine",
    body: "Model signal generation, backtesting assumptions, and scheduling separately from account connectivity.",
  },
  {
    title: "Operations",
    body: "Track account health, API token status, logs, and deployment posture before live trading is enabled.",
  },
];

export default function Home() {
  return (
    <main style={{ padding: "48px 20px 80px" }}>
      <section
        style={{
          margin: "0 auto",
          maxWidth: 1120,
          border: "1px solid var(--surface-border)",
          background: "var(--surface)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(23, 33, 43, 0.12)",
        }}
      >
        <div style={{ padding: "56px 24px 40px", borderBottom: "1px solid var(--surface-border)" }}>
          <p
            style={{
              margin: 0,
              color: "var(--accent-strong)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Standalone Project Scaffold
          </p>
          <h1 style={{ margin: "16px 0 12px", fontSize: "clamp(2.5rem, 8vw, 5.5rem)", lineHeight: 0.95 }}>
            M1 Capital
            <br />
            Algorithmic Trading
          </h1>
          <p style={{ maxWidth: 720, margin: 0, color: "var(--muted)", fontSize: 18, lineHeight: 1.6 }}>
            A clean base for building a Schwab-connected algorithmic trading platform without any dependency on the
            PRYCD-MVP codebase or git history.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            padding: 24,
          }}
        >
          {platformSections.map((section) => (
            <article
              key={section.title}
              style={{
                minHeight: 220,
                padding: 24,
                border: "1px solid var(--surface-border)",
                background: "rgba(255, 255, 255, 0.66)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontSize: 12,
                }}
              >
                Module
              </p>
              <h2 style={{ margin: "18px 0 12px", fontSize: 28 }}>{section.title}</h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
