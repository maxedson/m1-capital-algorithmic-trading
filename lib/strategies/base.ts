export type StrategyContext = {
  now: string;
};

export type StrategySignal = {
  symbol: string;
  side: "long" | "short";
  confidence: number;
  note: string;
};

export type StrategyResult = {
  signals: StrategySignal[];
};

export type StrategyDefinition = {
  id: string;
  name: string;
  description: string;
  run: (context: StrategyContext) => StrategyResult;
};
