import { NextResponse } from "next/server";
import { z } from "zod";
import { saveQuote } from "@/lib/database";

const quoteSchema = z.object({ product: z.string().min(2), color: z.string().min(2), size: z.string().min(1), technique: z.string().min(2) });

/** Validation boundary ready for CRM or production workflow integration. */
export async function POST(request: Request) {
  const body = await request.json();
  const result = quoteSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Demande de devis invalide." }, { status: 400 });
  try {
    const id = saveQuote(result.data);
    return NextResponse.json({ accepted: true, id, quote: result.data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "La demande n'a pas pu être enregistrée." }, { status: 503 });
  }
}
