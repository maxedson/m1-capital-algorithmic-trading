"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Command", short: "01" },
  { href: "/performance", label: "Performance", short: "02" },
  { href: "/trading", label: "Execution", short: "03" },
  { href: "/backtesting", label: "Research", short: "04" },
];

type SiteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function SiteShell({ eyebrow, title, description, aside, children }: SiteShellProps) {
  const pathname = usePathname();

  return (
    <main className="page-shell">
      <section className="dashboard-frame dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-sticky">
            <Link href="/" className="brand-lockup sidebar-brand">
              <span className="brand-mark">M1</span>
              <span className="brand-text">
                <strong>Capital Console</strong>
                <small>Personal Trading System</small>
              </span>
            </Link>

            <nav className="sidenav" aria-label="Primary">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidenav-link${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="sidenav-index">{item.short}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-card">
              <span className="sidebar-label">Mode</span>
              <strong>Live Operator View</strong>
              <small>Focus on system quality, execution discipline, and capital velocity.</small>
            </div>
          </div>
        </aside>

        <section className="main-column">
          <header className="topbar">
            <div className="topbar-copy">
              <span className="topbar-label">{eyebrow}</span>
              <strong>Personal trading workspace</strong>
            </div>

            <div className="topbar-status">
              <span className="status-dot" />
              <span>System online</span>
            </div>
          </header>

          <section className="hero-block hero-grid">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p className="hero-copy">{description}</p>
            </div>
            {aside ? <div className="hero-aside">{aside}</div> : null}
          </section>

          {children}
        </section>
      </section>
    </main>
  );
}
