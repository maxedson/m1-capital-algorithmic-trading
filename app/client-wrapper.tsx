"use client";

import { TradingProvider } from "@/lib/trading-context";
import { ReactNode } from "react";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return <TradingProvider>{children}</TradingProvider>;
}
