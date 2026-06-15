"use client";

import { startTransition, useEffect, useState } from "react";

type SchwabSessionStatus = {
  connected: boolean;
  expiresAt: number | null;
  scope: string | null;
};

type QuoteRow = {
  symbol: string;
  mark?: number;
  bid?: number;
  ask?: number;
  netChange?: number;
};

const defaultSymbols = ["AAPL", "MSFT", "NVDA", "SPY"];

function formatTimestamp(value: number | null) {
  if (!value) {
    return "No session";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function normalizeQuotes(payload: unknown): QuoteRow[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  return Object.entries(payload as Record<string, Record<string, unknown>>).map(([symbol, quote]) => ({
    symbol,
    mark: typeof quote.mark === "number" ? quote.mark : undefined,
    bid: typeof quote.bidPrice === "number" ? quote.bidPrice : undefined,
    ask: typeof quote.askPrice === "number" ? quote.askPrice : undefined,
    netChange: typeof quote.netChange === "number" ? quote.netChange : undefined,
  }));
}

export function SchwabConnectionPanel() {
  const [status, setStatus] = useState<SchwabSessionStatus | null>(null);
  const [quoteRows, setQuoteRows] = useState<QuoteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/schwab/session", { cache: "no-store" });
        const payload = (await response.json()) as SchwabSessionStatus;
        setStatus(payload);

        if (payload.connected) {
          const quotesResponse = await fetch(`/api/schwab/quotes?symbols=${defaultSymbols.join(",")}`, {
            cache: "no-store",
          });
          const quotePayload = (await quotesResponse.json()) as { quotes?: unknown; error?: string };

          if (!quotesResponse.ok) {
            setError(quotePayload.error ?? "Unable to load sample quotes.");
            return;
          }

          setQuoteRows(normalizeQuotes(quotePayload.quotes));
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to reach broker endpoints.");
      } finally {
        setIsLoading(false);
      }
    };

    startTransition(() => {
      void load();
    });
  }, []);

  const disconnect = async () => {
    await fetch("/api/schwab/session", { method: "DELETE" });
    setStatus({ connected: false, expiresAt: null, scope: null });
    setQuoteRows([]);
  };

  return (
    <article className="panel">
      <div className="section-heading">
        <div>
          <p className="panel-kicker">Broker Wiring</p>
          <h2>Schwab connection</h2>
        </div>
      </div>

      <div className="mini-grid">
        <div className="metric-chip">
          <span>Status</span>
          <strong>{isLoading ? "Checking" : status?.connected ? "Connected" : "Not Connected"}</strong>
        </div>
        <div className="metric-chip">
          <span>Access Token</span>
          <strong>{status?.expiresAt ? `Valid until ${formatTimestamp(status.expiresAt)}` : "No session"}</strong>
        </div>
        <div className="metric-chip">
          <span>Scope</span>
          <strong>{status?.scope ?? "Pending auth"}</strong>
        </div>
        <div className="metric-chip">
          <span>Quote Feed</span>
          <strong>{quoteRows.length > 0 ? `${quoteRows.length} sample quotes` : "Idle"}</strong>
        </div>
      </div>

      <p>
        Use your registered Schwab HTTPS callback URL to establish OAuth, then this panel will verify the server
        session and load sample quotes through `/api/schwab/quotes`.
      </p>

      <div className="trading-controls">
        <a href="/api/schwab/auth/login" className="btn btn-primary">
          Connect Schwab
        </a>
        {status?.connected ? (
          <button type="button" onClick={disconnect} className="btn btn-secondary">
            Disconnect
          </button>
        ) : null}
      </div>

      {error ? <p className="broker-error-copy">{error}</p> : null}

      {quoteRows.length > 0 ? (
        <div className="trade-table broker-quote-table">
          <div className="table-row table-head broker-quote-head">
            <span>Symbol</span>
            <span>Mark</span>
            <span>Bid</span>
            <span>Ask</span>
            <span>Change</span>
          </div>
          {quoteRows.map((quote) => (
            <div key={quote.symbol} className="table-row broker-quote-head">
              <span>{quote.symbol}</span>
              <span>{quote.mark ?? "--"}</span>
              <span>{quote.bid ?? "--"}</span>
              <span>{quote.ask ?? "--"}</span>
              <span>{quote.netChange ?? "--"}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
