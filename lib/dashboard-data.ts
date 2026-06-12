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

function formatMinutes(value: number) {
  if (value < 60) return `${value}m`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
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
    winRatePct: 64,
    averageWinner: 847,
    averageLoser: -362,
    expectancyPerTrade: 412,
    topSetupToday: "Momentum Breakout",
    topSetupHitRatePct: 71,
  },
  positions: [
    {
      symbol: "NVDA",
      side: "long",
      quantity: 20,
      entryPrice: 136.1,
      markPrice: 142.3,
      stopPrice: 138.4,
      targetPrice: 145.8,
      weightPct: 19.2,
      riskAmount: 78,
      openedAt: "2026-06-11T10:05:00-04:00",
      setup: "Momentum Breakout",
      pnl: 1240,
      status: "open",
    },
    {
      symbol: "AMD",
      side: "long",
      quantity: 40,
      entryPrice: 156.4,
      markPrice: 160.9,
      stopPrice: 158.1,
      targetPrice: 163.5,
      weightPct: 17.4,
      riskAmount: 112,
      openedAt: "2026-06-11T12:18:00-04:00",
      setup: "Trend Continuation",
      pnl: 180,
      status: "open",
    },
    {
      symbol: "SPY",
      side: "short",
      quantity: 10,
      entryPrice: 528.4,
      markPrice: 530.6,
      stopPrice: 531.2,
      targetPrice: 524.8,
      weightPct: 0,
      riskAmount: 0,
      openedAt: "2026-06-11T09:42:00-04:00",
      setup: "Index Fade",
      pnl: -220,
      status: "closed",
      exitReason: "stop",
      closedAt: "2026-06-11T10:27:00-04:00",
      rMultiple: -1,
    },
  ],
  watchlist: [
    { symbol: "NVDA", setup: "Momentum Breakout", signal: "ready", score: 96, price: 142.3, changePct: 2.8, signalAgeMinutes: 18, inPosition: true },
    { symbol: "AMD", setup: "Trend Continuation", signal: "armed", score: 88, price: 160.9, changePct: 1.4, signalAgeMinutes: 9, inPosition: true },
    {
      symbol: "MSFT",
      setup: "Opening Range Hold",
      signal: "ready",
      score: 84,
      price: 468.7,
      changePct: 0.9,
      signalAgeMinutes: 6,
      inPosition: false,
      blockedReason: "awaiting confirmation",
    },
    {
      symbol: "META",
      setup: "Relative Strength Pivot",
      signal: "armed",
      score: 81,
      price: 534.2,
      changePct: 1.1,
      signalAgeMinutes: 27,
      inPosition: false,
      blockedReason: "risk full",
    },
    {
      symbol: "TSLA",
      setup: "Range Expansion",
      signal: "waiting",
      score: 78,
      price: 181.6,
      changePct: -0.6,
      signalAgeMinutes: 44,
      inPosition: false,
      blockedReason: "spread too wide",
    },
    {
      symbol: "AVGO",
      setup: "Late Day Squeeze",
      signal: "waiting",
      score: 73,
      price: 1778.2,
      changePct: 0.4,
      signalAgeMinutes: 58,
      inPosition: false,
      blockedReason: "cooldown",
    },
  ],
  orders: [
    { id: "ord_01", symbol: "NVDA", side: "long", status: "filled", realizedPnl: 1240, grade: "A" },
    { id: "ord_02", symbol: "AMD", side: "long", status: "monitoring", realizedPnl: 180, grade: "B+" },
    { id: "ord_03", symbol: "SPY", side: "short", status: "exited", realizedPnl: -220, grade: "C" },
    { id: "ord_04", symbol: "TSLA", side: "long", status: "queued", realizedPnl: null, grade: "A-" },
  ],
  checks: [
    { label: "Broker", value: "Connected to Schwab", tone: "positive" },
    { label: "Scanner", value: "Running", tone: "positive" },
    { label: "Risk Guard", value: "Passing", tone: "positive" },
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

const openPositions = tradingSystemState.positions.filter((position) => position.status === "open");
const closedPositions = tradingSystemState.positions.filter((position) => position.status === "closed");
const unrealizedPnl = openPositions.reduce((sum, position) => sum + position.pnl, 0);
const openRisk = openPositions.reduce((sum, position) => sum + position.riskAmount, 0);
const capitalDeployedPct = openPositions.reduce((sum, position) => sum + position.weightPct, 0);
const deployedCapital =
  (capitalDeployedPct / 100) * tradingSystemState.snapshot.accountValue;
const recentPeakValue = 154980;
const drawdownFromPeakPct =
  ((tradingSystemState.snapshot.accountValue - recentPeakValue) / recentPeakValue) * 100;
const readySignals = tradingSystemState.watchlist.filter((candidate) => candidate.signal === "ready" && !candidate.inPosition);
const positionsNearStop = openPositions.filter((position) => {
  const denominator = Math.abs(position.markPrice - position.stopPrice);
  if (denominator === 0) return true;
  const distancePct = (denominator / position.markPrice) * 100;
  return distancePct <= 1.2;
});

export const commandStats = [
  { label: "Account Value", value: formatCurrency(tradingSystemState.snapshot.accountValue), tone: "positive" as const },
  { label: "Cash", value: formatCurrency(tradingSystemState.snapshot.cash), tone: "neutral" as const },
  { label: "Buying Power", value: formatCurrency(tradingSystemState.snapshot.buyingPower), tone: "neutral" as const },
  { label: "Capital Deployed", value: `${capitalDeployedPct.toFixed(1)}%`, tone: "neutral" as const },
];

export const dashboardSummary = [
  { label: "Deployed Capital", value: formatCurrency(deployedCapital), tone: "neutral" as const },
  { label: "Net Exposure", value: `${tradingSystemState.snapshot.netExposurePct}% net`, tone: "neutral" as const },
  { label: "Unrealized P&L", value: formatSignedCurrency(unrealizedPnl), tone: "positive" as const },
  { label: "Open Positions", value: String(openPositions.length), tone: "neutral" as const },
];

export const streakStats = [
  {
    label: "Top Setup",
    value: tradingSystemState.session.topSetupToday,
    detail: `${tradingSystemState.session.topSetupHitRatePct}% win rate`,
  },
  {
    label: "Avg Winner / Loser",
    value: `${formatSignedCurrency(tradingSystemState.session.averageWinner)} / ${formatSignedCurrency(tradingSystemState.session.averageLoser)}`,
    detail: "Across closed trades",
  },
  {
    label: "Expectancy",
    value: formatSignedCurrency(tradingSystemState.session.expectancyPerTrade),
    detail: "Per trade",
  },
];

export const focusCards = [
  { title: "Trading", value: `${tradingSystemState.session.ordersSent} live orders`, meta: "2 queued", href: "/trading" },
  { title: "Backtests", value: `${tradingSystemState.backtests.length} active models`, meta: "1 promoted candidate", href: "/backtesting" },
];

export const performanceStats = [
  { label: "YTD Return", value: formatPercent(tradingSystemState.snapshot.ytdReturnPct) },
  { label: "Sharpe", value: "1.72" },
  { label: "System Score", value: `${tradingSystemState.snapshot.systemScore} / 100` },
  { label: "Drawdown From Peak", value: formatPercent(drawdownFromPeakPct) },
];

export const performanceBreakdown = [
  { label: "Week", value: formatPercent(3.2) },
  { label: "Month", value: formatPercent(6.7) },
  { label: "Quarter", value: formatPercent(9.4) },
  { label: "Year", value: formatPercent(tradingSystemState.snapshot.ytdReturnPct) },
];

export const equityCurveDollars = tradingSystemState.equityCurve.map((point, index) => {
  const startValue = 142000;
  const compounded = tradingSystemState.equityCurve
    .slice(0, index + 1)
    .reduce((value, current) => value * (1 + current.returnPct / 100), startValue);

  return {
    label: point.label,
    equityValue: Math.round(compounded),
    returnPct: point.returnPct,
  };
});

const highestEquityValue = Math.max(...equityCurveDollars.map((point) => point.equityValue));

export const heatTiles = equityCurveDollars.slice(0, 6).map((point) => ({
  label: point.label,
  value: formatSignedCurrency(point.equityValue - 142000),
  tone: point.returnPct > 0 ? ("positive" as const) : point.returnPct < 0 ? ("negative" as const) : ("neutral" as const),
}));

export const executionStats = [
  { label: "Today Realized", value: formatSignedCurrency(tradingSystemState.session.realizedPnl) },
  { label: "Unrealized P&L", value: formatSignedCurrency(unrealizedPnl) },
  { label: "Capital Deployed", value: `${capitalDeployedPct.toFixed(1)}% · ${formatCurrency(deployedCapital)}` },
  { label: "Buying Power", value: formatCurrency(tradingSystemState.snapshot.buyingPower) },
];

export const executionSummary = [
  { label: "Open Risk", value: formatCurrency(openRisk), tone: "warm" as const },
  { label: "Near Stop", value: String(positionsNearStop.length), tone: positionsNearStop.length > 0 ? ("warm" as const) : ("neutral" as const) },
  { label: "Ready Signals", value: String(readySignals.length), tone: "positive" as const },
];

export const positionsSummary = executionSummary.slice(0, 2);
export const watchlistSummary = executionSummary.slice(2);

export const currentPositions = [...openPositions]
  .sort((left, right) => right.riskAmount - left.riskAmount)
  .map((position) => ({
    symbol: position.symbol,
    side: position.side === "long" ? "Long" : "Short",
    quantity: position.quantity.toLocaleString("en-US"),
    entry: formatCurrency(position.entryPrice),
    mark: formatCurrency(position.markPrice),
    weight: `${position.weightPct.toFixed(1)}%`,
    risk: formatCurrency(position.riskAmount),
    timeInTrade: formatMinutes(
      Math.max(
        1,
        Math.round(
          (new Date(tradingSystemState.session.asOf).getTime() - new Date(position.openedAt).getTime()) / 60000,
        ),
      ),
    ),
    stopDistance:
      `${(((Math.abs(position.markPrice - position.stopPrice) / position.markPrice) * 100)).toFixed(1)}%`,
    targetDistance:
      `${(((Math.abs(position.targetPrice - position.markPrice) / position.markPrice) * 100)).toFixed(1)}%`,
    pnl: formatSignedCurrency(position.pnl),
    tone:
      position.riskAmount >= 100
        ? ("warm" as const)
        : position.pnl >= 0
          ? ("positive" as const)
          : ("negative" as const),
  }));

export const watchlistSections = [
  { title: "In Position", key: "in-position" as const, rows: tradingSystemState.watchlist.filter((candidate) => candidate.inPosition) },
  { title: "Ready", key: "ready" as const, rows: tradingSystemState.watchlist.filter((candidate) => !candidate.inPosition && candidate.signal === "ready") },
  { title: "Armed", key: "armed" as const, rows: tradingSystemState.watchlist.filter((candidate) => !candidate.inPosition && candidate.signal === "armed") },
  { title: "Waiting", key: "waiting" as const, rows: tradingSystemState.watchlist.filter((candidate) => !candidate.inPosition && candidate.signal === "waiting") },
].map((section) => ({
  ...section,
  rows: [...section.rows]
    .sort((left, right) => right.score - left.score)
    .map((candidate) => ({
    symbol: candidate.symbol,
    setup: candidate.setup,
    signal: candidate.signal.charAt(0).toUpperCase() + candidate.signal.slice(1),
    score: `${candidate.score} / 100`,
    price: formatCurrency(candidate.price),
    move: formatPercent(candidate.changePct),
    signalAge: formatMinutes(candidate.signalAgeMinutes),
    positionState: candidate.inPosition ? "In Position" : "Watching",
    whyNotInTrade: candidate.inPosition ? "Active" : candidate.blockedReason ?? "--",
    tone:
      !candidate.inPosition && candidate.signalAgeMinutes >= 40
        ? ("negative" as const)
        : candidate.signal === "ready"
        ? ("positive" as const)
        : candidate.signal === "armed"
          ? ("warm" as const)
          : ("neutral" as const),
  })),
}));

export const tradeHistory = closedPositions
  .map((position) => {
    const matchingOrder = tradingSystemState.orders.find(
      (order) => order.symbol === position.symbol && order.status === "exited",
    );

    return {
      symbol: position.symbol,
      side: position.side === "long" ? "Long" : "Short",
      result: formatSignedCurrency(position.pnl),
      status: matchingOrder ? "Closed" : "Archived",
      exitReason: position.exitReason ? position.exitReason.charAt(0).toUpperCase() + position.exitReason.slice(1) : "--",
      rMultiple: position.rMultiple == null ? "--" : `${position.rMultiple > 0 ? "+" : ""}${position.rMultiple.toFixed(1)}R`,
      grade: matchingOrder?.grade ?? "--",
      tone: position.pnl >= 0 ? ("positive" as const) : ("negative" as const),
    };
  });

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
    label: "Signals Today",
    value: String(tradingSystemState.session.signalsToday),
    progress: `${Math.min(100, Math.round((tradingSystemState.session.signalsToday / 20) * 100))}%`,
  },
  {
    label: "Execution Accuracy",
    value: `${tradingSystemState.session.executionAccuracyPct}%`,
    progress: `${tradingSystemState.session.executionAccuracyPct}%`,
  },
  {
    label: "Best Trade",
    value: formatPercent(tradingSystemState.session.bestTradePct),
    progress: `${Math.min(100, Math.round(tradingSystemState.session.bestTradePct * 10))}%`,
  },
  {
    label: "Avg Hold Time",
    value: `${tradingSystemState.session.averageHoldMinutes}m`,
    progress: `${Math.min(100, Math.round((tradingSystemState.session.averageHoldMinutes / 480) * 100))}%`,
  },
];

export const equityBars = equityCurveDollars.map((point) => ({
  label: point.label,
  value: formatCurrency(point.equityValue),
  heightPct: Math.round((point.equityValue / highestEquityValue) * 100),
}));

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
