"use client";

import { useEffect, useRef, useState } from "react";
import { useTrading } from "@/lib/trading-context";
import { watchlists } from "@/lib/watchlists";

export function WatchlistSelector() {
  const { activeWatchlistId, setActiveWatchlistId, scannerState } = useTrading();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isLocked = scannerState === "watchlist";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const activeWatchlistLabel =
    watchlists.find((watchlist) => watchlist.id === activeWatchlistId)?.name ?? "Select watchlist...";

  return (
    <div className="strategy-selector" ref={containerRef}>
      <button
        id="watchlist-select"
        type="button"
        className={`select-input strategy-trigger${open ? " open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (isLocked) return;
          setOpen((current) => !current);
        }}
        disabled={isLocked}
      >
        <span>{activeWatchlistLabel}</span>
      </button>

      {open ? (
        <div className="strategy-menu" role="listbox" aria-labelledby="watchlist-select">
          {watchlists.map((watchlist) => (
            <button
              key={watchlist.id}
              type="button"
              className={`strategy-option${activeWatchlistId === watchlist.id ? " selected" : ""}`}
              onClick={() => {
                setActiveWatchlistId(watchlist.id);
                setOpen(false);
              }}
            >
              <span>{watchlist.name}</span>
              <small>{watchlist.description}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
