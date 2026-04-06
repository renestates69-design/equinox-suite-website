/**
 * FontSense Scoring Engine
 * Shared logic for Claude API calls using FontCLIP attribute framework.
 */

export interface FontRecommendation {
  name: string;
  dominant_attributes: string[];
  rationale: string;
  attribute_scores: Record<string, number>;
}

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
  "dominant_attributes": ["<attr1>", "<attr2>", "<attr3>", "<attr4>", "<attr5>"],
  "rationale": "<One sentence tying these specific attributes back to the meaning of the input word.>",
  "attribute_scores": {
    "<attr1>": <score 0-100>,
    "<attr2>": <score 0-100>,
    "<attr3>": <score 0-100>
  }
}

Include only the top 3–5 attribute scores that drove the selection in attribute_scores, not all 37.

Return ONLY the JSON array. Nothing else.`;

export async function queryFontSense(
  apiKey: string,
  word: string
): Promise<FontRecommendation[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: word }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ||
        `API error ${response.status}`
    );
  }

  const data = await response.json();
  const text = (data as { content?: { text?: string }[] }).content?.[0]?.text;
  if (!text) throw new Error("Empty response from API.");

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse font recommendations.");
  }
}
