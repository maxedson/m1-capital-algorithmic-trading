export type Tone = "positive" | "negative" | "neutral" | "warm";

export type OrderStatus = "queued" | "submitted" | "filled" | "monitoring" | "exited";
export type StrategyStatus = "stable" | "review" | "experimental";
export type Side = "long" | "short";

export type AccountSnapshot = {
  asOf: string;
  accountValue: number;
  cash: number;
  buyingPower: number;
  dailyPnl: number;
  netExposurePct: number;
  ytdReturnPct: number;
  systemScore: number;
};

export type SessionMetric = {
  label: string;
  value: number;
  unit?: "currency" | "percent" | "integer" | "score";
  detail?: string;
};

export type EquityPoint = {
  label: string;
  pctOfPeak: number;
  returnPct: number;
};

export type Position = {
  symbol: string;
  side: Side;
  quantity: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  status: "open" | "closed";
};

export type Order = {
  id: string;
  symbol: string;
  side: Side;
  status: OrderStatus;
  realizedPnl?: number | null;
  grade: string;
};

export type SystemCheck = {
  label: string;
  value: string;
  tone: Tone;
};

export type BacktestModel = {
  name: string;
  dateRange: string;
  cagrPct: number;
  maxDrawdownPct: number;
  sampleTrades: number;
  status: StrategyStatus;
  note: string;
};

export type BacktestConfig = {
  slippagePct: number;
  commissionPerTrade: number;
  symbolUniverseCount: number;
};

export type TradingSession = {
  asOf: string;
  signalsToday: number;
  ordersSent: number;
  ruleCompliancePct: number;
  executionAccuracyPct: number;
  greenDayStreak: number;
  disciplineXp: number;
  realizedPnl: number;
  bestTradePct: number;
  worstTradePct: number;
  averageHoldMinutes: number;
};

export type TradingSystemState = {
  snapshot: AccountSnapshot;
  equityCurve: EquityPoint[];
  session: TradingSession;
  positions: Position[];
  orders: Order[];
  checks: SystemCheck[];
  backtestConfig: BacktestConfig;
  backtests: BacktestModel[];
};
