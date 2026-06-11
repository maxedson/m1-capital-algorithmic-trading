import { Tone, TradingSystemState } from "@/lib/trading-schema";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${formatCurrency(Math.abs(value))}`;
}

function formatPercent(value: number, digits = 1) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${Math.abs(value).toFixed(digits)}%`;
}

function orderTone(status: string): Tone {
  if (status === "filled" || status === "monitoring") return "positive";
  if (status === "queued" || status === "submitted") return "warm";
  if (status === "exited") return "neutral";
  return "neutral";
}

function strategyTone(status: string): Tone {
  if (status === "stable") return "positive";
  if (status === "review") return "warm";
  return "neutral";
}

export const tradingSystemState: TradingSystemState = {
  snapshot: {
    asOf: "2026-06-11T13:30:00-04:00",
    accountValue: 148240,
    cash: 42860,
    buyingPower: 85600,
    dailyPnl: 1284,
    netExposurePct: 38,
    ytdReturnPct: 18.4,
    systemScore: 91,
  },
  equityCurve: [
    { label: "Mon", pctOfPeak: 42, returnPct: 0.8 },
    { label: "Tue", pctOfPeak: 48, returnPct: 1.2 },
    { label: "Wed", pctOfPeak: 45, returnPct: -0.3 },
    { label: "Thu", pctOfPeak: 57, returnPct: 1.5 },
    { label: "Fri", pctOfPeak: 64, returnPct: 0.9 },
    { label: "Sat", pctOfPeak: 61, returnPct: 0.1 },
    { label: "Sun", pctOfPeak: 72, returnPct: 1.8 },
  ],
  session: {
    asOf: "2026-06-11T13:30:00-04:00",
    signalsToday: 14,
    ordersSent: 6,
    ruleCompliancePct: 98,
    executionAccuracyPct: 96,
    greenDayStreak: 7,
    disciplineXp: 2140,
    realizedPnl: 1200,
    bestTradePct: 1.9,
    worstTradePct: -0.4,
    averageHoldMinutes: 46,
  },
  positions: [
    { symbol: "NVDA", side: "long", quantity: 20, entryPrice: 136.1, markPrice: 142.3, pnl: 1240, status: "open" },
    { symbol: "AMD", side: "long", quantity: 40, entryPrice: 156.4, markPrice: 160.9, pnl: 180, status: "open" },
    { symbol: "SPY", side: "short", quantity: 10, entryPrice: 528.4, markPrice: 530.6, pnl: -220, status: "closed" },
  ],
  orders: [
    { id: "ord_01", symbol: "NVDA", side: "long", status: "filled", realizedPnl: 1240, grade: "A" },
    { id: "ord_02", symbol: "AMD", side: "long", status: "monitoring", realizedPnl: 180, grade: "B+" },
    { id: "ord_03", symbol: "SPY", side: "short", status: "exited", realizedPnl: -220, grade: "C" },
    { id: "ord_04", symbol: "TSLA", side: "long", status: "queued", realizedPnl: null, grade: "A-" },
  ],
  checks: [
    { label: "Signal Engine", value: "Running", tone: "positive" },
    { label: "Broker Link", value: "Sandbox", tone: "warm" },
    { label: "Risk Checks", value: "Passing", tone: "positive" },
    { label: "Order Queue", value: "2 Waiting", tone: "neutral" },
  ],
  backtestConfig: {
    slippagePct: 0.18,
    commissionPerTrade: 0,
    symbolUniverseCount: 12,
  },
  backtests: [
    {
      name: "Momentum Basket v1",
      dateRange: "2021-2024",
      cagrPct: 14.2,
      maxDrawdownPct: -6.1,
      sampleTrades: 842,
      status: "stable",
      note: "Promote candidate",
    },
    {
      name: "Index Reversion v2",
      dateRange: "2020-2024",
      cagrPct: 11.6,
      maxDrawdownPct: -3.8,
      sampleTrades: 611,
      status: "review",
      note: "Needs more out-of-sample",
    },
    {
      name: "Breakout Engine v3",
      dateRange: "2022-2024",
      cagrPct: 19.1,
      maxDrawdownPct: -8.4,
      sampleTrades: 509,
      status: "experimental",
      note: "High return, higher stress",
    },
  ],
};

export const commandStats = [
  { label: "Account Value", value: formatCurrency(tradingSystemState.snapshot.accountValue), tone: "positive" as const },
  { label: "Daily P&L", value: formatSignedCurrency(tradingSystemState.snapshot.dailyPnl), tone: "positive" as const },
  { label: "Live Exposure", value: `${tradingSystemState.snapshot.netExposurePct}%`, tone: "neutral" as const },
  { label: "System Score", value: `${tradingSystemState.snapshot.systemScore} / 100`, tone: "positive" as const },
];

export const streakStats = [
  {
    label: "Green Days",
    value: String(tradingSystemState.session.greenDayStreak),
    detail: "Current streak",
  },
  {
    label: "Rule Compliance",
    value: `${tradingSystemState.session.ruleCompliancePct}%`,
    detail: "Last 30 sessions",
  },
  {
    label: "Best Session",
    value: formatPercent(2.4),
    detail: "This month",
  },
];

export const focusCards = [
  { title: "Trading", value: `${tradingSystemState.session.ordersSent} live orders`, meta: "2 queued", href: "/trading" },
  { title: "Backtests", value: `${tradingSystemState.backtests.length} active models`, meta: "1 promoted candidate", href: "/backtesting" },
];

export const performanceStats = [
  { label: "Net Return", value: formatPercent(tradingSystemState.snapshot.ytdReturnPct) },
  { label: "Sharpe", value: "1.72" },
  { label: "Max Drawdown", value: formatPercent(-4.9) },
  { label: "Profit Factor", value: "1.86" },
];

export const performanceBreakdown = [
  { label: "Week", value: formatPercent(3.2) },
  { label: "Month", value: formatPercent(6.7) },
  { label: "Quarter", value: formatPercent(9.4) },
  { label: "Year", value: formatPercent(tradingSystemState.snapshot.ytdReturnPct) },
];

export const heatTiles = tradingSystemState.equityCurve.slice(0, 6).map((point) => ({
  label: point.label,
  value: formatPercent(point.returnPct),
  tone: point.returnPct > 0 ? ("positive" as const) : point.returnPct < 0 ? ("negative" as const) : ("neutral" as const),
}));

export const executionStats = [
  { label: "Signals Today", value: String(tradingSystemState.session.signalsToday) },
  { label: "Orders Sent", value: String(tradingSystemState.session.ordersSent) },
  { label: "Open Positions", value: String(tradingSystemState.positions.filter((p) => p.status === "open").length) },
  { label: "Realized P&L", value: formatSignedCurrency(tradingSystemState.session.realizedPnl) },
];

export const dailyTrades = tradingSystemState.orders.map((order) => ({
  symbol: order.symbol,
  side: order.side === "long" ? "Long" : "Short",
  status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
  pnl: order.realizedPnl == null ? "--" : formatSignedCurrency(order.realizedPnl),
  score: order.grade,
  tone: orderTone(order.status),
}));

export const systemStatus = tradingSystemState.checks;

export const missionCards = [
  {
    label: "Discipline XP",
    value: tradingSystemState.session.disciplineXp.toLocaleString("en-US"),
    progress: `${Math.min(100, Math.round(tradingSystemState.session.ruleCompliancePct))}%`,
  },
  {
    label: "Session Win Rate",
    value: "64%",
    progress: "64%",
  },
  {
    label: "Execution Accuracy",
    value: `${tradingSystemState.session.executionAccuracyPct}%`,
    progress: `${tradingSystemState.session.executionAccuracyPct}%`,
  },
];

export const backtestRuns = tradingSystemState.backtests.map((run) => ({
  name: run.name,
  range: run.dateRange,
  cagr: formatPercent(run.cagrPct),
  drawdown: formatPercent(run.maxDrawdownPct),
  status: run.status.charAt(0).toUpperCase() + run.status.slice(1),
  tone: strategyTone(run.status),
}));

export const simulationMetrics = [
  { label: "Slippage Model", value: formatPercent(tradingSystemState.backtestConfig.slippagePct, 2) },
  { label: "Commission", value: formatCurrency(tradingSystemState.backtestConfig.commissionPerTrade) },
  { label: "Universe", value: `${tradingSystemState.backtestConfig.symbolUniverseCount} symbols` },
  {
    label: "Sample Size",
    value: `${tradingSystemState.backtests.reduce((sum, run) => sum + run.sampleTrades, 0).toLocaleString("en-US")} trades`,
  },
];

export const modelBadges = tradingSystemState.backtests.map((run) => ({
  label: run.name.replace(/ v\d+$/, ""),
  detail: run.note,
  tone: strategyTone(run.status),
}));
