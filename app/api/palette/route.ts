import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import colorsData from "@/colors.json";

interface WadaColor {
  index: number;
  name: string;
  slug: string;
  hex: string;
  rgb_array: number[];
  combinations: number[];
  use_count: number;
}

const colors: WadaColor[] = (colorsData as { colors: WadaColor[] }).colors;

const colorCatalog = colors
  .map((c) => `${c.name} (${c.hex})`)
  .join(", ");

export async function POST(req: NextRequest) {
  try {
    const { industry, mood, description, bgPreference, count } = await req.json();

    if (!industry || !mood) {
      return NextResponse.json({ error: "industry and mood are required" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are a color consultant specializing in Sanzo Wada's "A Dictionary of Color Combinations."
You recommend website color palettes using only real colors from Wada's work.

Available Wada colors: ${colorCatalog}

You MUST respond with valid JSON only — no markdown fences, no explanation outside the JSON.

Response schema:
{
  "palettes": [
    {
      "name": "palette name",
      "rationale": "one sentence why this suits the site",
      "roles": {
        "background": { "name": "Wada color name", "hex": "#xxxxxx", "role": "60% dominant background" },
        "surface": { "name": "Wada color name", "hex": "#xxxxxx", "role": "30% cards and panels" },
        "accent": { "name": "Wada color name", "hex": "#xxxxxx", "role": "10% primary actions" }
      },
      "css": ":root {\\n  --color-bg: #xxxxxx;\\n  --color-surface: #xxxxxx;\\n  --color-accent: #xxxxxx;\\n}"
    }
  ]
}

Rules:
- Only use hex values that exactly match colors in the provided catalog
- Apply the 60-30-10 rule: background is dominant, surface is secondary, accent is used sparingly
- Background must match the user's preference (light/dark/warm gray/cool gray)
- Each palette should feel distinct`;

    const userPrompt = `Recommend ${count || 3} website color palettes for:
Industry: ${industry}
Mood/tone: ${mood}
Background preference: ${bgPreference || "light"}
Site description: ${description || "No description provided"}

Apply the 60-30-10 rule. Use only Sanzo Wada colors from the catalog.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = (message.content[0] as { text: string }).text.trim();
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("/api/palette error:", err);
    return NextResponse.json({ error: "Failed to generate palettes" }, { status: 500 });
  }
}
