import { NextRequest } from "next/server";
import { getCritter } from "@/lib/critters";
import { generateCritterReply, hasApiKey, type ChatMessage } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_MESSAGES = 40;
const MAX_CHARS = 2000;

interface ChatRequestBody {
  critterSlug?: unknown;
  messages?: unknown;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

function badRequest(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return Response.json(
      { error: "Slow down a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (typeof body.critterSlug !== "string") {
    return badRequest("A critterSlug is required.");
  }

  const critter = getCritter(body.critterSlug);
  if (!critter) {
    return badRequest("That critter doesn't exist.", 404);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return badRequest("At least one message is required.");
  }

  if (body.messages.length > MAX_MESSAGES) {
    return badRequest("This conversation is too long. Start a new one.");
  }

  if (!body.messages.every(isChatMessage)) {
    return badRequest("Each message needs a valid role and string content.");
  }

  const messages = body.messages as ChatMessage[];

  if (messages.some((message) => message.content.length > MAX_CHARS)) {
    return badRequest("That message is too long.");
  }

  if (messages[messages.length - 1].role !== "user") {
    return badRequest("The last message must come from the user.");
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of generateCritterReply(critter, messages)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        console.error("CalCritters stream error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "x-calcritters-mode": hasApiKey() ? "live" : "offline",
    },
  });
}
