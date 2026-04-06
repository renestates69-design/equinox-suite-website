/**
 * The Fontologist — Scoring Engine
 * Internal logic only. No methodology is exposed to the end user.
 *
 * Two modes:
 * - BETA: User provides their own API key, calls Anthropic directly
 * - PRODUCTION: Calls our Cloudflare Worker backend (no key needed)
 */

export interface FontRecommendation {
  name: string;
  qualities: string[];
  rationale: string;
  match_strength: Record<string, number>;
}

// Production backend URL — update after deploying the Cloudflare Worker
const BACKEND_URL = "https://fontologist-api.equinox-suite.com";

const SYSTEM_PROMPT = `You are a semantic typography engine trained on the FontCLIP attribute framework (Tatsukawa et al., 2024) and the O'Donovan crowdsourced font attribute dataset (2014).

You operate across 37 typographic attributes divided into two categories:

STRUCTURAL / FORMAL ATTRIBUTES:
serif, sans-serif, italic, cursive, monospace, capitals, display, thin, bold, condensed, extended, geometric, humanist, rounded, angular, high-contrast, low-contrast, decorative, script

PERCEPTUAL / EMOTIONAL ATTRIBUTES (scored 0–100):
friendly, warm, happy, elegant, dramatic, legible, calm, corporate, playful, feminine, masculine, modern, retro/vintage, luxurious, technical, organic, rigid, delicate, strong, authoritative, trustworthy, creative, formal, casual, energetic

For each input word or phrase:

1. Internally score the word across all 37 attributes, identifying the 5–8 most dominant dimensions.
2. When the input is abstract, emotional, or conceptual, weight perceptual/emotional attributes more heavily than structural ones.
3. Use the dominant attributes to reason toward 5 specific Google Fonts whose typographic character best matches that attribute profile.
4. Choose only real, currently available Google Fonts. Prefer well-known, widely used fonts.

Return ONLY a JSON array of exactly 5 objects. No preamble, no markdown fences, no explanation outside the JSON.

Each object schema:
{
  "name": "<Google Font name exactly as listed on fonts.google.com>",
  "qualities": ["<quality1>", "<quality2>", "<quality3>", "<quality4>", "<quality5>"],
  "rationale": "<One sentence explaining why this typeface suits the input — reference the feeling and character of the font, NOT the scoring method or attributes by name.>",
  "match_strength": {
    "<quality1>": <score 0-100>,
    "<quality2>": <score 0-100>,
    "<quality3>": <score 0-100>
  }
}

IMPORTANT: In "qualities" and "rationale", use natural descriptive language — words like "refined", "grounded", "fluid", "structured", etc. Do NOT use technical attribute names from the scoring system. The user should feel like they are getting expert typographic intuition, not a technical readout.

Include only the top 3–5 match strengths that drove the selection.

Return ONLY the JSON array. Nothing else.`;

/**
 * Query via Cloudflare Worker backend (production).
 * No API key needed — the backend holds it.
 */
async function queryViaBackend(word: string): Promise<FontRecommendation[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch(BACKEND_URL + "/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: word }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    throw new Error(err.message || err.error || "API error " + response.status);
  }

  const data = await response.json() as any;
  return data.fonts;
}

/**
 * Query Anthropic directly (beta — user provides their own key).
 */
async function queryDirect(apiKey: string, word: string): Promise<FontRecommendation[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: word }],
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ||
        `API error ${response.status}`
    );
  }

  const data = await response.json();
  const text = (data as { content?: { text?: string }[] }).content?.[0]?.text;
  if (!text) throw new Error("Empty response.");

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse recommendations.");
  }
}

/**
 * Main entry point. Uses backend if available, falls back to direct API call.
 */
export async function queryFontologist(
  apiKey: string,
  word: string
): Promise<FontRecommendation[]> {
  // If user provided their own key (beta mode), use direct API
  if (apiKey && apiKey.startsWith("sk-ant-")) {
    return queryDirect(apiKey, word);
  }

  // Otherwise try the backend
  return queryViaBackend(word);
}
