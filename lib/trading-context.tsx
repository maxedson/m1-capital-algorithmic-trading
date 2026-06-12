"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ScannerState = "off" | "watchlist";
export type ExecutionState = "off" | "paper" | "live";

type TradingContextType = {
  scannerState: ScannerState;
  executionState: ExecutionState;
  isTrading: boolean;
  startWatchlist: () => void;
  stopWatchlist: () => void;
  startPaperTrading: () => void;
  startLiveTrading: () => void;
  stopExecution: () => void;
  activeStrategies: string[];
  setActiveStrategies: (strategies: string[]) => void;
  paperTradingBalance: number;
  setPaperTradingBalance: (balance: number) => void;
  resetPaperTrading: (initialBalance: number) => void;
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [scannerState, setScannerState] = useState<ScannerState>("off");
  const [executionState, setExecutionState] = useState<ExecutionState>("off");
  const [activeStrategies, setActiveStrategies] = useState<string[]>([]);
  const [paperTradingBalance, setPaperTradingBalance] = useState(100000);
  const isTrading = executionState !== "off";

  const startWatchlist = () => {
    setScannerState("watchlist");
    setExecutionState("off");
  };

  const stopWatchlist = () => {
    setExecutionState("off");
    setScannerState("off");
  };

  const startPaperTrading = () => {
    setScannerState("watchlist");
    setExecutionState("paper");
  };

  const startLiveTrading = () => {
    setScannerState("watchlist");
    setExecutionState("live");
  };

  const stopExecution = () => {
    setExecutionState("off");
  };

  const resetPaperTrading = (initialBalance: number = 100000) => {
    setPaperTradingBalance(initialBalance);
    setExecutionState("off");
    setScannerState("watchlist");
  };

  const value: TradingContextType = {
    scannerState,
    executionState,
    isTrading,
    startWatchlist,
    stopWatchlist,
    startPaperTrading,
    startLiveTrading,
    stopExecution,
    activeStrategies,
    setActiveStrategies,
    paperTradingBalance,
    setPaperTradingBalance,
    resetPaperTrading,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
}
