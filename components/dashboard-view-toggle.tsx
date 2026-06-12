"use client";

import { useState } from "react";

type ViewMode = "live" | "paper";

export function DashboardViewToggle() {
  const [viewMode, setViewMode] = useState<ViewMode>("paper");

  return (
    <div className="mode-toggle">
      <button
        onClick={() => setViewMode("live")}
        className={`mode-button ${viewMode === "live" ? "active" : ""}`}
        aria-pressed={viewMode === "live"}
      >
        Live Trading
      </button>
      <button
        onClick={() => setViewMode("paper")}
        className={`mode-button ${viewMode === "paper" ? "active" : ""}`}
        aria-pressed={viewMode === "paper"}
      >
        Paper Trading
      </button>
    </div>
  );
}
