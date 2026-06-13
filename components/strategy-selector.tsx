"use client";

import { useEffect, useRef, useState } from "react";
import { strategies } from "@/lib/strategies/registry";
import { useTrading } from "@/lib/trading-context";

export function StrategySelector() {
  const { activeStrategies, setActiveStrategies } = useTrading();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const activeStrategyLabel =
    activeStrategies.length === 0
      ? "Select strategies..."
      : activeStrategies.length === 1
        ? strategies.find((strategy) => strategy.id === activeStrategies[0])?.name ?? "1 strategy selected"
        : `${activeStrategies.length} strategies selected`;

  const toggleStrategy = (strategyId: string) => {
    setActiveStrategies(
      activeStrategies.includes(strategyId)
        ? activeStrategies.filter((id) => id !== strategyId)
        : [...activeStrategies, strategyId],
    );
  };

  return (
    <div className="strategy-selector" ref={containerRef}>
      <button
        id="strategy-select"
        type="button"
        className={`select-input strategy-trigger${open ? " open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{activeStrategyLabel}</span>
      </button>

      {open ? (
        <div className="strategy-menu" role="listbox" aria-labelledby="strategy-select">
          <button
            type="button"
            className={`strategy-option${activeStrategies.length === 0 ? " selected" : ""}`}
            onClick={() => {
              setActiveStrategies([]);
              setOpen(false);
            }}
          >
            Clear strategy selection
          </button>
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              type="button"
              className={`strategy-option${activeStrategies.includes(strategy.id) ? " selected" : ""}`}
              onClick={() => {
                toggleStrategy(strategy.id);
              }}
            >
              <span>{strategy.name}</span>
              <small>{strategy.description}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
