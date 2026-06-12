"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TradingMode = "standby" | "live-trading" | "paper-trading" | "backtesting";

type TradingContextType = {
  mode: TradingMode;
  setMode: (mode: TradingMode) => void;
  isTrading: boolean;
  setIsTrading: (trading: boolean) => void;
  activeStrategy: string | null;
  setActiveStrategy: (strategy: string | null) => void;
  paperTradingBalance: number;
  setPaperTradingBalance: (balance: number) => void;
  resetPaperTrading: (initialBalance: number) => void;
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TradingMode>("standby");
  const [isTrading, setIsTrading] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  const [paperTradingBalance, setPaperTradingBalance] = useState(100000);

  const resetPaperTrading = (initialBalance: number = 100000) => {
    setPaperTradingBalance(initialBalance);
    setIsTrading(false);
  };

  const value: TradingContextType = {
    mode,
    setMode,
    isTrading,
    setIsTrading,
    activeStrategy,
    setActiveStrategy,
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
