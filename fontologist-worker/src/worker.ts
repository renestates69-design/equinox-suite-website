/**
 * The Fontologist — Backend API (Cloudflare Worker)
 * by Equinox Design
 *
 * Proxies requests to Anthropic Claude API.
 * Handles free tier (3/day) and paid tier (unlimited via Stripe).
 * Serves both the Canva app and the standalone web app.
 */

interface Env {
  ANTHROPIC_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  FREE_DAILY_LIMIT: string;
  CORS_ORIGINS: string;
  USAGE: KVNamespace;
}

const SYSTEM_PROMPT = `You are a semantic typography engine trained on the FontCLIP attribute framework (Tatsukawa et al., 2024) and the O'Donovan crowdsourced font attribute dataset (2014).

You operate across 37 typographic attributes divided into two categories:

STRUCTURAL / FORMAL ATTRIBUTES:
serif, sans-serif, italic, cursive, monospace, capitals, display, thin, bold, condensed, extended, geometric, humanist, rounded, angular, high-contrast, low-contrast, decorative, script

PERCEPTUAL / EMOTIONAL ATTRIBUTES (scored 0-100):
friendly, warm, happy, elegant, dramatic, legible, calm, corporate, playful, feminine, masculine, modern, retro/vintage, luxurious, technical, organic, rigid, delicate, strong, authoritative, trustworthy, creative, formal, casual, energetic

For each input word or phrase:

1. Internally score the word across all 37 attributes, identifying the 5-8 most dominant dimensions.
2. When the input is abstract, emotional, or conceptual, weight perceptual/emotional attributes more heavily than structural ones.
3. Use the dominant attributes to reason toward 5 specific Google Fonts whose typographic character best matches that attribute profile.
4. Choose only real, currently available Google Fonts. Prefer well-known, widely used fonts.

Return ONLY a JSON array of exactly 5 objects. No preamble, no markdown fences, no explanation outside the JSON.

Each object schema:
{
  "name": "<Google Font name exactly as listed on fonts.google.com>",
  "qualities": ["<quality1>", "<quality2>", "<quality3>", "<quality4>", "<quality5>"],
  "rationale": "<One sentence explaining why this typeface suits the input - reference the feeling and character of the font, NOT the scoring method or attributes by name.>",
  "match_strength": {
    "<quality1>": <score 0-100>,
    "<quality2>": <score 0-100>,
    "<quality3>": <score 0-100>
  }
}

IMPORTANT: In "qualities" and "rationale", use natural descriptive language. Do NOT use technical attribute names from the scoring system.

Return ONLY the JSON array. Nothing else.`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = env.CORS_ORIGINS.split(",");
    const corsOrigin = allowedOrigins.includes(origin) ? origin : "";

    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // POST /api/query — main font recommendation endpoint
    if (url.pathname === "/api/query" && request.method === "POST") {
      return handleQuery(request, env, corsHeaders);
    }

    // POST /api/stripe-webhook — Stripe subscription events
    if (url.pathname === "/api/stripe-webhook" && request.method === "POST") {
      return handleStripeWebhook(request, env);
    }

    // GET /api/status — check subscription status
    if (url.pathname === "/api/status" && request.method === "GET") {
      return handleStatus(request, env, corsHeaders);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};

async function handleQuery(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const json = (await request.json()) as { query?: string; user_id?: string };
  const query = json.query?.trim();
  if (!query) {
    return jsonResponse({ error: "Missing query" }, 400, corsHeaders);
  }

  // Rate limiting: identify user by user_id or IP
  const userId = json.user_id || request.headers.get("CF-Connecting-IP") || "anonymous";
  const today = new Date().toISOString().slice(0, 10);
  const usageKey = `usage:${userId}:${today}`;
  const subKey = `sub:${userId}`;

  // Check subscription
  const subscription = await env.USAGE.get(subKey);
  const isPaid = subscription === "active";

  if (!isPaid) {
    // Check free tier usage
    const usageStr = await env.USAGE.get(usageKey);
    const usage = usageStr ? parseInt(usageStr, 10) : 0;
    const limit = parseInt(env.FREE_DAILY_LIMIT, 10) || 3;

    if (usage >= limit) {
      return jsonResponse(
        {
          error: "free_limit_reached",
          message: `You've used your ${limit} free searches today. Upgrade to Pro for unlimited access.`,
          upgrade_url: "https://fontologist.equinox-suite.com/pro",
        },
        429,
        corsHeaders
      );
    }

    // Increment usage (expires at end of day)
    await env.USAGE.put(usageKey, String(usage + 1), {
      expirationTtl: 86400,
    });
  }

  // Call Anthropic API
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as any;
      throw new Error(err.error?.message || `Anthropic API error ${response.status}`);
    }

    const data = (await response.json()) as any;
    const text = data.content?.[0]?.text;
    if (!text) throw new Error("Empty response from AI");

    let fonts;
    try {
      fonts = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) fonts = JSON.parse(match[0]);
      else throw new Error("Could not parse recommendations");
    }

    return jsonResponse({ fonts, query }, 200, corsHeaders);
  } catch (err: any) {
    return jsonResponse({ error: err.message || "Internal error" }, 500, corsHeaders);
  }
}

async function handleStripeWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  // In production, verify the Stripe signature here
  // For now, parse the event directly
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const type = event.type;
  const customerEmail = event.data?.object?.customer_email || event.data?.object?.email || "";

  if (type === "checkout.session.completed" || type === "customer.subscription.created") {
    if (customerEmail) {
      await env.USAGE.put(`sub:${customerEmail}`, "active");
    }
  }

  if (type === "customer.subscription.deleted" || type === "customer.subscription.paused") {
    if (customerEmail) {
      await env.USAGE.delete(`sub:${customerEmail}`);
    }
  }

  return new Response("OK", { status: 200 });
}

async function handleStatus(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id") || request.headers.get("CF-Connecting-IP") || "anonymous";
  const today = new Date().toISOString().slice(0, 10);

  const subscription = await env.USAGE.get(`sub:${userId}`);
  const usageStr = await env.USAGE.get(`usage:${userId}:${today}`);
  const usage = usageStr ? parseInt(usageStr, 10) : 0;
  const limit = parseInt(env.FREE_DAILY_LIMIT, 10) || 3;

  return jsonResponse(
    {
      plan: subscription === "active" ? "pro" : "free",
      searches_used: usage,
      searches_remaining: subscription === "active" ? "unlimited" : Math.max(0, limit - usage),
      daily_limit: limit,
    },
    200,
    corsHeaders
  );
}

function jsonResponse(
  data: unknown,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
