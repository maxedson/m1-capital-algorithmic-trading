import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPaperOrder, listPaperOrders } from "@/lib/paper-broker";

const paperOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  fillPrice: z.number().positive(),
});

export async function GET() {
  return NextResponse.json({ orders: listPaperOrders() });
}

export async function POST(request: NextRequest) {
  try {
    const payload = paperOrderSchema.parse(await request.json());
    const order = createPaperOrder(payload);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid paper order payload." },
      { status: 400 },
    );
  }
}
