"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useTrading } from "@/lib/trading-context";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/trading", label: "Execution" },
  { href: "/backtesting", label: "Backtesting" },
];

type SiteShellProps = {
  eyebrow: string;
  aside?: ReactNode;
  children: ReactNode;
};

function getModeLabel(mode: string, isTrading: boolean): string {
  if (!isTrading || mode === "standby") return "Standby";
  if (mode === "live-trading") return "Live Trading";
  if (mode === "paper-trading") return "Paper Trading";
  if (mode === "backtesting") return "Backtesting";
  return "Standby";
}

export function SiteShell({ eyebrow, aside, children }: SiteShellProps) {
  const pathname = usePathname();
  const { mode, isTrading } = useTrading();
  const modeLabel = getModeLabel(mode, isTrading);
  const isStandby = !isTrading || mode === "standby";

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
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="main-column">
          <header className="topbar">
            <div className="topbar-copy">
              <span className="topbar-label">{eyebrow}</span>
              <strong>Personal trading workspace</strong>
            </div>

            <div className={`topbar-status${isStandby ? " standby" : ""}`}>
              <span className="status-wave" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>{modeLabel}</span>
            </div>
          </header>

          {children}
        </section>
      </section>
    </main>
  );
}
