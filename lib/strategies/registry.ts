import { StrategyDefinition } from "@/lib/strategies/base";
import { testStrategy } from "@/lib/strategies/test-strategy";

export const strategies: StrategyDefinition[] = [
  testStrategy,
];

export const strategyMap = Object.fromEntries(
  strategies.map((strategy) => [strategy.id, strategy]),
) as Record<string, StrategyDefinition>;
