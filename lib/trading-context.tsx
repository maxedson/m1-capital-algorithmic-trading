"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { defaultWatchlistId } from "@/lib/watchlists";

export type ScannerState = "off" | "watchlist";
export type ExecutionState = "off" | "paper" | "live";
export type SystemSelection = "off" | "watchlist";

type TradingContextType = {
  scannerState: ScannerState;
  executionState: ExecutionState;
  isTrading: boolean;
  selectedSystemState: SystemSelection;
  selectedExecutionState: ExecutionState;
  selectSystemState: (state: SystemSelection) => void;
  selectExecutionState: (state: ExecutionState) => void;
  startWatchlist: () => void;
  stopWatchlist: () => void;
  startPaperTrading: () => void;
  startLiveTrading: () => void;
  stopExecution: () => void;
  activeStrategies: string[];
  setActiveStrategies: (strategies: string[]) => void;
  activeWatchlistId: string;
  setActiveWatchlistId: (watchlistId: string) => void;
  paperTradingBalance: number;
  setPaperTradingBalance: (balance: number) => void;
  resetPaperTrading: (initialBalance: number) => void;
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [scannerState, setScannerState] = useState<ScannerState>("off");
  const [executionState, setExecutionState] = useState<ExecutionState>("off");
  const [selectedSystemState, setSelectedSystemState] = useState<SystemSelection>("off");
  const [selectedExecutionState, setSelectedExecutionState] = useState<ExecutionState>("off");
  const [activeStrategies, setActiveStrategies] = useState<string[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState(defaultWatchlistId);
  const [paperTradingBalance, setPaperTradingBalance] = useState(100000);
  const isTrading = executionState !== "off";

  const selectSystemState = (state: SystemSelection) => {
    setSelectedSystemState(state);
    if (state === "off") {
      setSelectedExecutionState("off");
    }
  };

  const selectExecutionState = (state: ExecutionState) => {
    setSelectedExecutionState(state);
  };

  const startWatchlist = () => {
    setScannerState("watchlist");
    setExecutionState("off");
    setSelectedSystemState("watchlist");
    setSelectedExecutionState("off");
  };

  const stopWatchlist = () => {
    setExecutionState("off");
    setScannerState("off");
    setSelectedSystemState("off");
    setSelectedExecutionState("off");
  };

  const startPaperTrading = () => {
    setScannerState("watchlist");
    setExecutionState("paper");
    setSelectedSystemState("watchlist");
    setSelectedExecutionState("paper");
  };

  const startLiveTrading = () => {
    setScannerState("watchlist");
    setExecutionState("live");
    setSelectedSystemState("watchlist");
    setSelectedExecutionState("live");
  };

  const stopExecution = () => {
    setExecutionState("off");
    setSelectedSystemState("watchlist");
    setSelectedExecutionState("off");
  };

  const resetPaperTrading = (initialBalance: number = 100000) => {
    setPaperTradingBalance(initialBalance);
    setExecutionState("off");
    setScannerState("watchlist");
    setSelectedSystemState("watchlist");
    setSelectedExecutionState("off");
  };

  const value: TradingContextType = {
    scannerState,
    executionState,
    isTrading,
    selectedSystemState,
    selectedExecutionState,
    selectSystemState,
    selectExecutionState,
    startWatchlist,
    stopWatchlist,
    startPaperTrading,
    startLiveTrading,
    stopExecution,
    activeStrategies,
    setActiveStrategies,
    activeWatchlistId,
    setActiveWatchlistId,
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
