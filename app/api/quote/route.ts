import { NextResponse } from "next/server";
import { z } from "zod";

const quoteSchema = z.object({ product: z.string().min(2), color: z.string().min(2), size: z.string().min(1), technique: z.string().min(2) });

/** Validation boundary ready for CRM or production workflow integration. */
export async function POST(request: Request) {
  const body = await request.json();
  const result = quoteSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Demande de devis invalide." }, { status: 400 });
  return NextResponse.json({ accepted: true, quote: result.data }, { status: 201 });
}
