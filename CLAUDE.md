# Sanzo Wada Palette Recommender — CLAUDE.md

## Project overview

A web tool that recommends Sanzo Wada color palettes for websites. The user describes their site (industry, mood, description, background preference) and receives curated palette recommendations with CSS variables following the 60-30-10 rule.

Wada (1883–1967) was a Japanese artist and color researcher whose 6-volume work from the 1930s, *Haishoku Soukan*, was reprinted as *A Dictionary of Color Combinations* by Seigensha. The interactive reference site is at https://sanzo-wada.dmbk.io.

---

## Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS v4
- API: Anthropic SDK (`claude-sonnet-4-6`) — server-side only, never exposed client-side
- Deployment: Vercel — domain sanzo-wada.getgo.online
- No localStorage/sessionStorage — all state in React `useState`

---

## Data source

`colors.json` is bundled locally (157 Wada colors). Structure per entry:

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

---

## Key design decisions

### 60-30-10 color rule (enforced)
All palette output assigns roles:
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

### API route
```
POST /api/palette
Body: { industry, mood, description, bgPreference, count }
Returns: { palettes: [ { name, rationale, roles: { background, surface, accent }, css } ] }
```

Prompt caching is enabled on the system prompt (color catalog + instructions) via `cache_control: { type: "ephemeral" }`.

---

## UI/UX rules

- No pure black/white — use `#111111` on `#f5f3ef`
- 8px spacing grid — all padding/margin/gap multiples of 8
- Inter font
- 60-30-10 rule applied to the tool's own UI
- WCAG 2.1 AA minimum — 4.5:1 contrast for body text
- Mobile-first, touch targets minimum 44×44px
- Loading, empty, and error states required

---

## Out of scope (for now)

- Saving/persisting palette history
- User accounts
- Generating full design tokens beyond the three CSS variables
