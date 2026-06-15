import { randomUUID } from "node:crypto";

export type PaperOrderSide = "buy" | "sell";

export type PaperOrder = {
  id: string;
  symbol: string;
  side: PaperOrderSide;
  quantity: number;
  requestedAt: string;
  fillPrice: number;
  status: "filled";
};

type PaperOrderStore = {
  orders: PaperOrder[];
};

declare global {
  var __paperBrokerStore__: PaperOrderStore | undefined;
}

function getPaperOrderStore() {
  if (!globalThis.__paperBrokerStore__) {
    globalThis.__paperBrokerStore__ = { orders: [] };
  }

  return globalThis.__paperBrokerStore__;
}

export function listPaperOrders() {
  return [...getPaperOrderStore().orders].sort((left, right) =>
    right.requestedAt.localeCompare(left.requestedAt),
  );
}

export function createPaperOrder(input: {
  symbol: string;
  side: PaperOrderSide;
  quantity: number;
  fillPrice: number;
}) {
  const order: PaperOrder = {
    id: `paper_${randomUUID()}`,
    symbol: input.symbol.toUpperCase(),
    side: input.side,
    quantity: input.quantity,
    requestedAt: new Date().toISOString(),
    fillPrice: input.fillPrice,
    status: "filled",
  };

  getPaperOrderStore().orders.unshift(order);
  return order;
}
