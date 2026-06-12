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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

function formatSignal(signal: TradingSystemState["watchlist"][number]["signal"]) {
  switch (signal) {
    case "no_signal":
      return "No Signal";
    case "near_long":
      return "Near Long";
    case "near_short":
      return "Near Short";
    case "long_triggered":
      return "Long Triggered";
    case "short_triggered":
      return "Short Triggered";
    case "exit_triggered":
      return "Exit Triggered";
    default:
      return signal;
  }
}

function formatReason(reason: NonNullable<TradingSystemState["watchlist"][number]["reason"]>) {
  switch (reason) {
    case "long_open":
      return "Long Open";
    case "short_open":
      return "Short Open";
    case "exit_signal_active":
      return "Exit Signal Active";
    case "insufficient_capital":
      return "Insufficient Capital";
    case "max_positions_reached":
      return "Max Positions Reached";
    case "risk_limit":
      return "Risk Limit";
    case "no_active_entry_signal":
      return "No Active Entry Signal";
    case "signal_not_confirmed":
      return "Signal Not Confirmed";
    case "cooldown":
      return "Cooldown";
    default:
      return reason;
  }
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
    { symbol: "NVDA", setup: "Momentum Breakout", side: "long", status: "in_position", signal: "long_triggered", score: 96, price: 142.3, capitalRequired: 2846, changePct: 2.8, signalAgeMinutes: 18, reason: "long_open" },
    { symbol: "AMD", setup: "Trend Continuation", side: "long", status: "in_position", signal: "long_triggered", score: 88, price: 160.9, capitalRequired: 6436, changePct: 1.4, signalAgeMinutes: 9, reason: "long_open" },
    {
      symbol: "MSFT",
      setup: "Opening Range Hold",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 84,
      price: 468.7,
      capitalRequired: 9374,
      changePct: 0.9,
      signalAgeMinutes: 6,
      reason: "insufficient_capital",
    },
    {
      symbol: "META",
      setup: "Relative Strength Pivot",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 81,
      price: 534.2,
      capitalRequired: 8013,
      changePct: 1.1,
      signalAgeMinutes: 27,
      reason: "max_positions_reached",
    },
    {
      symbol: "TSLA",
      setup: "Range Expansion",
      side: "short",
      status: "monitoring",
      signal: "near_short",
      score: 78,
      price: 181.6,
      capitalRequired: 3632,
      changePct: -0.6,
      signalAgeMinutes: 44,
      reason: "no_active_entry_signal",
    },
    {
      symbol: "AVGO",
      setup: "Late Day Squeeze",
      side: "long",
      status: "monitoring",
      signal: "near_long",
      score: 73,
      price: 1778.2,
      capitalRequired: 7113,
      changePct: 0.4,
      signalAgeMinutes: 58,
      reason: "signal_not_confirmed",
    },
    {
      symbol: "AAPL",
      setup: "VWAP Reclaim",
      side: "long",
      status: "in_position",
      signal: "long_triggered",
      score: 92,
      price: 214.3,
      capitalRequired: 4286,
      changePct: 1.1,
      signalAgeMinutes: 14,
      reason: "long_open",
    },
    {
      symbol: "AMZN",
      setup: "Opening Drive",
      side: "long",
      status: "in_position",
      signal: "long_triggered",
      score: 86,
      price: 198.5,
      capitalRequired: 3970,
      changePct: 0.8,
      signalAgeMinutes: 21,
      reason: "long_open",
    },
    {
      symbol: "GOOGL",
      setup: "Gap Continuation",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 89,
      price: 176.2,
      capitalRequired: 3524,
      changePct: 1.6,
      signalAgeMinutes: 11,
      reason: "insufficient_capital",
    },
    {
      symbol: "NFLX",
      setup: "Trend Pullback",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 83,
      price: 691.8,
      capitalRequired: 4151,
      changePct: 0.7,
      signalAgeMinutes: 19,
      reason: "risk_limit",
    },
    {
      symbol: "CRM",
      setup: "Relative Strength Pivot",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 79,
      price: 267.4,
      capitalRequired: 4011,
      changePct: 0.5,
      signalAgeMinutes: 24,
      reason: "max_positions_reached",
    },
    {
      symbol: "SHOP",
      setup: "Inside Day Break",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 77,
      price: 74.6,
      capitalRequired: 3730,
      changePct: 1.3,
      signalAgeMinutes: 29,
      reason: "insufficient_capital",
    },
    {
      symbol: "QCOM",
      setup: "Channel Break",
      side: "long",
      status: "monitoring",
      signal: "near_long",
      score: 82,
      price: 171.9,
      capitalRequired: 3438,
      changePct: 0.4,
      signalAgeMinutes: 16,
      reason: "signal_not_confirmed",
    },
    {
      symbol: "MU",
      setup: "Compression Coil",
      side: "long",
      status: "monitoring",
      signal: "near_long",
      score: 76,
      price: 129.7,
      capitalRequired: 3891,
      changePct: 0.2,
      signalAgeMinutes: 33,
      reason: "no_active_entry_signal",
    },
    {
      symbol: "PLTR",
      setup: "Momentum Stair-Step",
      side: "long",
      status: "monitoring",
      signal: "near_long",
      score: 74,
      price: 32.4,
      capitalRequired: 3240,
      changePct: 1.9,
      signalAgeMinutes: 26,
      reason: "signal_not_confirmed",
    },
    {
      symbol: "UBER",
      setup: "Support Bounce",
      side: "long",
      status: "monitoring",
      signal: "no_signal",
      score: 71,
      price: 84.1,
      capitalRequired: 3364,
      changePct: -0.1,
      signalAgeMinutes: 41,
      reason: "no_active_entry_signal",
    },
    {
      symbol: "LLY",
      setup: "Failed Break Reversal",
      side: "short",
      status: "queued",
      signal: "short_triggered",
      score: 87,
      price: 812.5,
      capitalRequired: 4063,
      changePct: -0.9,
      signalAgeMinutes: 13,
      reason: "insufficient_capital",
    },
    {
      symbol: "COST",
      setup: "Range Breakdown",
      side: "short",
      status: "monitoring",
      signal: "near_short",
      score: 75,
      price: 842.7,
      capitalRequired: 3371,
      changePct: -0.4,
      signalAgeMinutes: 22,
      reason: "signal_not_confirmed",
    },
    {
      symbol: "ADBE",
      setup: "Lower High Reject",
      side: "short",
      status: "monitoring",
      signal: "near_short",
      score: 72,
      price: 503.8,
      capitalRequired: 3527,
      changePct: -0.6,
      signalAgeMinutes: 37,
      reason: "no_active_entry_signal",
    },
    {
      symbol: "INTU",
      setup: "Weak Open Fade",
      side: "short",
      status: "queued",
      signal: "short_triggered",
      score: 80,
      price: 654.4,
      capitalRequired: 3926,
      changePct: -0.7,
      signalAgeMinutes: 17,
      reason: "risk_limit",
    },
    {
      symbol: "PANW",
      setup: "Breakout Retest",
      side: "long",
      status: "monitoring",
      signal: "near_long",
      score: 78,
      price: 318.6,
      capitalRequired: 3505,
      changePct: 0.6,
      signalAgeMinutes: 28,
      reason: "cooldown",
    },
    {
      symbol: "SNOW",
      setup: "Volume Expansion",
      side: "long",
      status: "queued",
      signal: "long_triggered",
      score: 81,
      price: 156.2,
      capitalRequired: 3124,
      changePct: 1.5,
      signalAgeMinutes: 9,
      reason: "max_positions_reached",
    },
    {
      symbol: "ROKU",
      setup: "Reversal Base",
      side: "long",
      status: "monitoring",
      signal: "no_signal",
      score: 68,
      price: 61.3,
      capitalRequired: 3065,
      changePct: -0.3,
      signalAgeMinutes: 49,
      reason: "no_active_entry_signal",
    },
    {
      symbol: "MDB",
      setup: "Trend Exhaustion",
      side: "short",
      status: "monitoring",
      signal: "near_short",
      score: 70,
      price: 247.8,
      capitalRequired: 3221,
      changePct: -0.8,
      signalAgeMinutes: 31,
      reason: "signal_not_confirmed",
    },
    {
      symbol: "ANET",
      setup: "Leader Continuation",
      side: "long",
      status: "in_position",
      signal: "long_triggered",
      score: 90,
      price: 312.1,
      capitalRequired: 3745,
      changePct: 1.2,
      signalAgeMinutes: 12,
      reason: "long_open",
    },
    {
      symbol: "MELI",
      setup: "Failed Pop Short",
      side: "short",
      status: "in_position",
      signal: "short_triggered",
      score: 85,
      price: 1784.9,
      capitalRequired: 3569,
      changePct: -1.1,
      signalAgeMinutes: 23,
      reason: "short_open",
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
const queuedSignals = tradingSystemState.watchlist.filter((candidate) => candidate.status === "queued");
const inPositionWatchlistCount = tradingSystemState.watchlist.filter((candidate) => candidate.status === "in_position").length;
const monitoringWatchlistCount = tradingSystemState.watchlist.filter((candidate) => candidate.status === "monitoring").length;
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
  { label: "In Position", value: String(inPositionWatchlistCount), tone: "positive" as const },
  { label: "Queued Signals", value: String(queuedSignals.length), tone: "warm" as const },
  { label: "Monitoring", value: String(monitoringWatchlistCount), tone: "neutral" as const },
];

export const positionsSummary = executionSummary.slice(0, 2);
export const watchlistSummary = executionSummary.slice(2);

export const currentPositions = [...openPositions]
  .sort((left, right) => right.riskAmount - left.riskAmount)
  .map((position) => ({
    symbol: position.symbol,
    side: position.side === "long" ? "Long" : "Short",
    entry: formatCurrency(position.entryPrice),
    mark: formatCurrency(position.markPrice),
    weight: `${position.weightPct.toFixed(1)}%`,
    risk: formatCurrency(position.riskAmount),
    stop: formatCurrency(position.stopPrice),
    target: formatCurrency(position.targetPrice),
    riskAmount: position.riskAmount,
    isNearStop: ((Math.abs(position.markPrice - position.stopPrice) / position.markPrice) * 100) <= 1.2,
    pnl: formatSignedCurrency(position.pnl),
    tone:
      position.pnl > 0
        ? ("positive" as const)
        : position.pnl < 0
          ? ("negative" as const)
          : ("neutral" as const),
  }));

const watchlistStatusRank = {
  in_position: 0,
  queued: 1,
  monitoring: 2,
} as const;

export const watchlistRows = [...tradingSystemState.watchlist]
  .sort((left, right) => {
    const statusDelta = watchlistStatusRank[left.status] - watchlistStatusRank[right.status];
    if (statusDelta !== 0) return statusDelta;
    if (right.score !== left.score) return right.score - left.score;
    return left.signalAgeMinutes - right.signalAgeMinutes;
  })
  .map((candidate) => ({
    symbol: candidate.symbol,
    setup: candidate.setup,
    side: candidate.side === "long" ? "Long" : "Short",
    signal: formatSignal(candidate.signal),
    signalTone:
      candidate.signal === "long_triggered" || candidate.signal === "short_triggered"
        ? ("positive" as const)
        : candidate.signal === "near_long" || candidate.signal === "near_short"
          ? ("warm" as const)
          : ("neutral" as const),
    status:
      candidate.status === "in_position"
        ? "In Position"
        : candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1),
    statusTone:
      candidate.status === "in_position"
        ? ("positive" as const)
        : candidate.status === "queued"
          ? ("warm" as const)
          : ("neutral" as const),
    score: `${candidate.score} / 100`,
    signalAge: formatMinutes(candidate.signalAgeMinutes),
    positionState: candidate.status === "in_position" ? "In Position" : "Watching",
    reason: candidate.reason ? formatReason(candidate.reason) : "--",
    tone:
      candidate.status === "in_position"
        ? ("positive" as const)
        : candidate.status === "queued"
          ? ("warm" as const)
          : ("neutral" as const),
  }));

export const tradeHistory = closedPositions
  .map((position) => {
    const matchingOrder = tradingSystemState.orders.find((order) => order.symbol === position.symbol);
    const holdMinutes = position.closedAt
      ? Math.max(
          1,
          Math.round((new Date(position.closedAt).getTime() - new Date(position.openedAt).getTime()) / 60000),
        )
      : null;

    return {
      symbol: position.symbol,
      side: position.side === "long" ? "Long" : "Short",
      setup: position.setup,
      brokerId: `SCHW-${position.symbol}`,
      orderId: matchingOrder?.id ?? `ord_${position.symbol.toLowerCase()}`,
      quantity: position.quantity.toLocaleString("en-US"),
      entry: formatCurrency(position.entryPrice),
      openedAt: formatDateTime(position.openedAt),
      exitPrice: formatCurrency(position.markPrice),
      closedAt: position.closedAt ? formatDateTime(position.closedAt) : "--",
      holdTime: holdMinutes == null ? "--" : formatMinutes(holdMinutes),
      result: formatSignedCurrency(position.pnl),
      exitReason: position.exitReason ? position.exitReason.charAt(0).toUpperCase() + position.exitReason.slice(1) : "--",
      tone:
        position.pnl > 0
          ? ("positive" as const)
          : position.pnl < 0
            ? ("negative" as const)
            : ("neutral" as const),
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

const completedPositionsCount = closedPositions.length;
const winningClosedPositionsCount = closedPositions.filter((position) => position.pnl > 0).length;
const sessionWinRatePct = completedPositionsCount === 0
  ? 0
  : (winningClosedPositionsCount / completedPositionsCount) * 100;
const averageClosedTradePnl = completedPositionsCount === 0
  ? 0
  : closedPositions.reduce((sum, position) => sum + position.pnl, 0) / completedPositionsCount;

export const missionCards = [
  {
    label: "Completed Positions",
    value: String(completedPositionsCount),
    progress: `${Math.min(100, completedPositionsCount * 20)}%`,
  },
  {
    label: "Win Rate",
    value: `${Math.round(sessionWinRatePct)}%`,
    progress: `${Math.round(sessionWinRatePct)}%`,
  },
  {
    label: "Avg Trade P&L",
    value: formatSignedCurrency(averageClosedTradePnl),
    progress: `${Math.min(100, Math.round(Math.abs(averageClosedTradePnl) / 10))}%`,
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
