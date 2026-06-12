import { StrategyDefinition } from "@/lib/strategies/base";

export const testStrategy: StrategyDefinition = {
  id: "test-strategy",
  name: "Test Strategy",
  description: "Minimal placeholder strategy for wiring the selector and execution flow.",
  run(context) {
    return {
      signals: [
        {
          symbol: "SPY",
          side: "long",
          confidence: 0.5,
          note: `Generated test signal at ${context.now}`,
        },
      ],
    };
  },
};
