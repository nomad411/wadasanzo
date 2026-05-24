# Sanzo Wada Palette Recommender — CLAUDE.md

## Project overview

A web tool that recommends Sanzo Wada color palettes for websites. The user describes their site (industry, mood, description, background preference) and receives curated palette recommendations with CSS variables following the 60-30-10 rule.

Wada (1883–1967) was a Japanese artist and color researcher whose 6-volume work from the 1930s, *Haishoku Soukan*, was reprinted as *A Dictionary of Color Combinations* by Seigensha. The interactive reference site is at https://sanzo-wada.dmbk.io.

---

## What we built so far

### Attempted: Claude-in-Claude artifact
Built an HTML artifact with a form UI that called `api.anthropic.com/v1/messages` directly from the iframe. This failed — the sandbox CSP blocks calls to the Anthropic API from within artifacts.

### Decided approach: `sendPrompt()` pattern
The artifact collects form inputs, formats a structured prompt, and sends it to the chat via the global `sendPrompt(text)` function. Claude responds in the chat with palette recommendations. This avoids the CSP issue entirely and keeps the conversation interactive — the user can ask follow-ups, request variations, etc.

---

## Data source

The colors JSON is publicly available at:
```
https://sanzo-wada.dmbk.io/assets/colors.json
```

Structure per color entry:
```json
{
  "index": 2,
  "name": "Corinthian Pink",
  "slug": "corinthian-pink",
  "hex": "#ffa6d9",
  "rgb_array": [255, 166, 217],
  "cmyk_array": [0, 35, 15, 0],
  "combinations": [27, 43, 87, 128],
  "use_count": 12
}
```

The `combinations` array references combination IDs (not a separate JSON we've located yet). The data gives us individual named colors, not pre-grouped palettes.

A separate combinations endpoint was not found at obvious URLs. Until it's located, palette groupings are either:
- Constructed from the `combinations` IDs on each color entry (colors sharing the same combination ID belong together)
- Or handled by asking Claude to recommend by color name knowledge directly

---

## Key design decisions

### 60-30-10 color rule (enforced)
All palette output must assign roles:
- **60% background** — dominant neutral
- **30% surface** — cards, panels, secondary areas  
- **10% accent** — primary actions only (buttons, links, highlights)

CSS output format:
```css
:root {
  --color-bg: #hex;
  --color-surface: #hex;
  --color-accent: #hex;
}
```

### Palette recommendation prompt structure
When generating the `sendPrompt()` call, include:
- Industry / category
- Mood / tone
- Background preference (light/dark/warm gray/cool gray)
- Free-text site description
- Number of palettes requested (2–4)
- Instruction to apply 60-30-10 role assignment
- Instruction to name specific Wada colors (use actual color names from the book)
- Instruction to output hex codes and ready-to-paste CSS variables

### UI inputs
- Industry dropdown (cultural heritage, tourism, food & beverage, fashion, tech/SaaS, health, education, creative/studio, e-commerce, non-profit, hospitality, publishing)
- Mood dropdown (haunting/mysterious, warm/inviting, minimal/modern, bold/energetic, earthy/natural, elegant/refined, playful/vibrant, traditional/heritage, melancholic/nostalgic, fresh/optimistic)
- Free-text description textarea
- Background preference dropdown
- Number of palettes selector (2–4)

---

## UI/UX rules (from user preferences)

- No pure black/white — use `#111111` on `#f5f5f5`
- 8px spacing grid — all padding/margin/gap multiples of 8
- Max two font families — Inter, Plus Jakarta Sans, or DM Sans preferred
- 60-30-10 color rule applied to the tool's own UI as well
- Typography scale: body 16px → h3 24px → h2 32px → h1 48px
- Body text max-width 65ch
- One dominant focal point per section
- WCAG 2.1 AA minimum — 4.5:1 contrast for body text
- All interactive elements keyboard navigable with visible focus states
- Mobile-first, touch targets minimum 44×44px
- Loading, empty, and error states required

---

## What to build next

A standalone Next.js page (or simple HTML file) that:

1. Renders the input form
2. On submit, either:
   - Calls `/api/palette` (a Next.js API route) which calls Anthropic server-side with the user's inputs
   - Or uses the `sendPrompt()` pattern if staying inside Claude artifacts
3. Displays results as palette cards with:
   - Color name (Wada's original name)
   - Role assignment (background / surface / accent)
   - Swatch row
   - 60-30-10 ratio bar preview
   - CSS variables block with copy button
   - One-line rationale for why this palette suits the site

### If building the Next.js API route

```
POST /api/palette
Body: { industry, mood, description, bgPreference, count }
Returns: { palettes: [ { name, rationale, roles: { background, surface, accent }, swatches: [...] } ] }
```

Use `claude-sonnet-4-20250514`. Keep `max_tokens` at 1000. Prompt the model to respond in JSON only (no markdown fences). Parse with try/catch.

---

## Stack context

- Framework: Next.js (App Router preferred)
- Styling: Tailwind CSS
- API: Anthropic SDK (server-side only — never expose the key client-side)
- Deployment: ServerAvatar / OpenLiteSpeed via GitHub Actions
- No localStorage/sessionStorage — keep state in React `useState`

---

## Out of scope (for now)

- Saving/persisting palette history
- User accounts
- Generating full design tokens beyond the three CSS variables
- Pulling live data from sanzo-wada.dmbk.io at request time (fetch once, cache or bundle the JSON locally instead)
