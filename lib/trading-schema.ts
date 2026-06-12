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
  stopPrice: number;
  targetPrice: number;
  weightPct: number;
  riskAmount: number;
  openedAt: string;
  setup: string;
  pnl: number;
  status: "open" | "closed";
  exitReason?: "target" | "stop" | "trail" | "manual";
  closedAt?: string;
  rMultiple?: number;
};

export type WatchlistCandidate = {
  symbol: string;
  setup: string;
  signal: "ready" | "armed" | "waiting";
  score: number;
  price: number;
  changePct: number;
  signalAgeMinutes: number;
  inPosition: boolean;
  blockedReason?: "awaiting confirmation" | "risk full" | "cooldown" | "spread too wide";
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
  winRatePct: number;
  averageWinner: number;
  averageLoser: number;
  expectancyPerTrade: number;
  topSetupToday: string;
  topSetupHitRatePct: number;
};

export type TradingSystemState = {
  snapshot: AccountSnapshot;
  equityCurve: EquityPoint[];
  session: TradingSession;
  positions: Position[];
  watchlist: WatchlistCandidate[];
  orders: Order[];
  checks: SystemCheck[];
  backtestConfig: BacktestConfig;
  backtests: BacktestModel[];
};
