import { NextResponse } from "next/server";
import { z } from "zod";
import { saveQuote } from "@/lib/database";
import { consumeRateLimit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 4 * 1024;
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const quoteSchema = z.object({
  product: z.string().trim().min(2).max(100),
  color: z.string().trim().min(2).max(50),
  size: z.string().trim().min(1).max(20),
  technique: z.string().trim().min(2).max(100),
}).strict();

class PayloadTooLargeError extends Error {}
class InvalidJsonError extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const length = Number(contentLength);
    if (!Number.isSafeInteger(length) || length < 0) throw new InvalidJsonError();
    if (length > MAX_BODY_BYTES) throw new PayloadTooLargeError();
  }

  if (!request.body) throw new InvalidJsonError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new PayloadTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new InvalidJsonError();
  }
}

function getClientKey(request: Request) {
  const forwardedIp = request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return forwardedIp && forwardedIp.length <= 128 ? forwardedIp : "unknown";
}

/** Public quote endpoint with bounded input and per-process abuse protection. */
export async function POST(request: Request) {
  const rateLimit = consumeRateLimit(
    getClientKey(request),
    RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "Le format attendu est JSON." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });
    }
    if (error instanceof InvalidJsonError) {
      return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
    }
    throw error;
  }

  const result = quoteSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Demande de devis invalide." }, { status: 400 });
  try {
    const id = await saveQuote(result.data);
    return NextResponse.json({ accepted: true, id, quote: result.data }, { status: 201 });
  } catch (error) {
    console.error("Quote persistence failed", error);
    return NextResponse.json({ error: "La demande n'a pas pu être enregistrée." }, { status: 503 });
  }
}
