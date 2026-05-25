"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Cultural heritage",
  "Tourism",
  "Food & beverage",
  "Fashion",
  "Tech / SaaS",
  "Health & wellness",
  "Education",
  "Creative / studio",
  "E-commerce",
  "Non-profit",
  "Hospitality",
  "Publishing",
];

const MOODS = [
  "Haunting / mysterious",
  "Warm / inviting",
  "Minimal / modern",
  "Bold / energetic",
  "Earthy / natural",
  "Elegant / refined",
  "Playful / vibrant",
  "Traditional / heritage",
  "Melancholic / nostalgic",
  "Fresh / optimistic",
];

const BG_PREFS = ["Light", "Dark", "Warm gray", "Cool gray"];

// A curated spectrum of actual Wada colors for the decorative strip
const WADA_STRIP = [
  "#ffb3f0", "#ffa6d9", "#ff8fb0", "#ffb3b3", "#ff9999",
  "#ffab00", "#ff8c42", "#ff7340", "#e8956d", "#c4a87a",
  "#ebd999", "#fff59e", "#d4e8a0", "#a8d5a2", "#7ab89e",
  "#7ab8c4", "#6a9fbf", "#6b7fa5", "#8b7ab8", "#b87ab8",
];

interface ColorRole {
  name: string;
  hex: string;
  role: string;
}

interface Palette {
  name: string;
  rationale: string;
  roles: {
    background: ColorRole;
    surface: ColorRole;
    accent: ColorRole;
  };
  css: string;
}

function hexToLuma(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 min-h-[32px]"
      style={{
        background: copied ? "var(--color-accent)" : "#2a2a2a",
        color: copied ? "#f5f3ef" : "#a0a0a0",
        border: "1px solid",
        borderColor: copied ? "var(--color-accent)" : "#3a3a3a",
        letterSpacing: "0.02em",
      }}
      aria-label="Copy CSS variables"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function PaletteCard({ palette }: { palette: Palette }) {
  const { background, surface, accent } = palette.roles;

  return (
    <article
      className="rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      {/* Swatch preview bar — 60/30/10 proportions */}
      <div className="flex h-20" role="img" aria-label="Palette preview">
        <div className="flex-[6]" style={{ background: background.hex }} title={background.name} />
        <div className="flex-[3]" style={{ background: surface.hex }} title={surface.name} />
        <div className="flex-[1]" style={{ background: accent.hex }} title={accent.name} />
      </div>

      <div className="px-6 pt-5 pb-2">
        <h3 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          {palette.name}
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          {palette.rationale}
        </p>
      </div>

      {/* Swatches */}
      <div className="px-6 py-4 flex gap-6 flex-wrap">
        {[
          { label: "60% Background", color: background },
          { label: "30% Surface", color: surface },
          { label: "10% Accent", color: accent },
        ].map(({ label, color }) => {
          const textColor = hexToLuma(color.hex) < 128 ? "#f5f3ef" : "#111111";
          return (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0"
                style={{ background: color.hex }}
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-semibold leading-none" style={{ color: "var(--color-text)" }}>
                  {color.name}
                </div>
                <div className="text-xs font-mono mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {color.hex}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS block */}
      <div className="mx-6 mb-6 rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}
        >
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
            CSS variables
          </span>
          <CopyButton text={palette.css} />
        </div>
        <pre
          className="px-4 py-4 text-xs font-mono overflow-x-auto"
          style={{ background: "#111111", color: "#e8e0d4", lineHeight: "1.7" }}
        >
          {palette.css}
        </pre>
      </div>
    </article>
  );
}

function SelectField({
  label, id, value, onChange, options, required,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="rounded-xl border px-4 py-3 text-sm min-h-[44px] appearance-none"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-bg)",
          color: value ? "var(--color-text)" : "var(--color-text-muted)",
          backgroundImage: chevron,
          backgroundPosition: "right 12px center",
          backgroundRepeat: "no-repeat",
          paddingRight: "40px",
        }}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function Home() {
  const [industry, setIndustry] = useState("");
  const [mood, setMood] = useState("");
  const [description, setDescription] = useState("");
  const [bgPref, setBgPref] = useState("");
  const [count, setCount] = useState("3");
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!industry || !mood) return;
    setLoading(true);
    setError("");
    setPalettes([]);
    try {
      const res = await fetch("/api/palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, mood, description, bgPreference: bgPref, count: parseInt(count) }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPalettes(data.palettes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && !!industry && !!mood;

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ── Color strip ── */}
      <div className="flex h-3 w-full" aria-hidden="true">
        {WADA_STRIP.map((hex) => (
          <div key={hex} className="flex-1" style={{ background: hex }} />
        ))}
      </div>

      {/* ── Hero ── */}
      <header className="px-6 pt-16 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "var(--color-accent)", letterSpacing: "0.18em" }}>
            Palette Recommender
          </p>
          <h1 className="font-bold tracking-tight mb-6 leading-none" style={{ color: "var(--color-text)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            Sanzo Wada<br />
            <span style={{ color: "var(--color-accent)" }}>Color Palettes</span>
          </h1>
          <p className="text-lg mx-auto" style={{ color: "var(--color-text-muted)", maxWidth: "52ch", lineHeight: "1.7" }}>
            Describe your website and receive curated palette recommendations drawn from Wada's
            legendary color research — with 60-30-10 role assignments and CSS variables, ready to paste.
          </p>
        </div>
      </header>

      {/* ── History section ── */}
      <section
        className="px-6 py-16"
        style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
        aria-label="About Sanzo Wada"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            {/* Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}>
                The Artist
              </p>
              <h2 className="text-3xl font-bold mb-6 leading-tight" style={{ color: "var(--color-text)" }}>
                和田 三造<br />
                <span className="text-2xl font-normal" style={{ color: "var(--color-text-muted)" }}>Sanzo Wada, 1883–1967</span>
              </h2>
              <div className="flex flex-col gap-4 text-sm" style={{ color: "var(--color-text-muted)", lineHeight: "1.8", maxWidth: "48ch" }}>
                <p>
                  Born in Hyogo Prefecture, Wada studied at the Tokyo School of Fine Arts and later trained
                  in Paris, winning the prestigious Imperial Art Exhibition prize for his Western-style oil paintings.
                </p>
                <p>
                  Later in his career he turned to color science, spending years systematically cataloguing
                  how colors feel together — extracted from Japanese art, nature, textiles, and daily life.
                  The result was <em>Haishoku Soukan</em> (配色総観), a six-volume masterwork published
                  in the 1930s documenting <strong style={{ color: "var(--color-text)" }}>348 named color combinations</strong>.
                </p>
                <p>
                  The work remained largely unknown outside Japan until 2010, when Seigensha Art Publishing
                  republished it as <em>A Dictionary of Color Combinations</em>. It has since become an
                  essential reference for designers worldwide.
                </p>
                <p>
                  Browse all 348 combinations at the community reference:{" "}
                  <a
                    href="https://sanzo-wada.dmbk.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    sanzo-wada.dmbk.io →
                  </a>
                </p>
              </div>
            </div>

            {/* Decorative color grid */}
            <div aria-hidden="true">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}>
                From the catalog
              </p>
              <div className="grid grid-cols-5 gap-2">
                {WADA_STRIP.map((hex, i) => (
                  <div key={hex} className="aspect-square rounded-xl" style={{ background: hex }} />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { number: "157", label: "Named colors" },
                  { number: "348", label: "Combinations" },
                  { number: "6", label: "Original volumes" },
                ].map(({ number, label }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                    <div className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{number}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pull quote */}
          <blockquote
            className="mt-16 px-8 py-6 rounded-2xl border-l-4 text-base italic"
            style={{
              background: "var(--color-bg)",
              borderLeftColor: "var(--color-accent)",
              color: "var(--color-text-muted)",
              lineHeight: "1.8",
            }}
          >
            "Color combinations are not merely decorative — they carry mood, memory, and meaning.
            Wada treated each pairing as a living relationship between hues."
            <footer className="mt-3 text-xs not-italic font-semibold" style={{ color: "var(--color-accent)" }}>
              — Seigensha, on the republication of <em>A Dictionary of Color Combinations</em>, 2010
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Form ── */}
      <main className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}>
              Get your palette
            </p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
              Describe your site
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)", maxWidth: "44ch", margin: "0 auto" }}>
              Tell us your industry, mood, and what the site is about. We'll match Wada's colors to your context.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border p-8 flex flex-col gap-6"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField label="Industry" id="industry" value={industry} onChange={setIndustry} options={INDUSTRIES} required />
              <SelectField label="Mood / tone" id="mood" value={mood} onChange={setMood} options={MOODS} required />
              <SelectField label="Background preference" id="bgpref" value={bgPref} onChange={setBgPref} options={BG_PREFS} />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="count" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  Number of palettes
                </label>
                <select
                  id="count" value={count} onChange={(e) => setCount(e.target.value)}
                  className="rounded-xl border px-4 py-3 text-sm min-h-[44px] appearance-none"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-bg)",
                    color: "var(--color-text)",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 12px center",
                    backgroundRepeat: "no-repeat",
                    paddingRight: "40px",
                  }}
                >
                  {["2", "3", "4"].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                Site description
              </label>
              <textarea
                id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Describe what your site is about, who it's for, and the feeling you want to create…"
                className="rounded-xl border px-4 py-3 text-sm resize-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full px-8 py-3.5 font-semibold text-sm tracking-wide transition-all duration-200 min-h-[48px] self-center w-full sm:w-auto"
              style={{
                background: canSubmit ? "var(--color-accent)" : "var(--color-border)",
                color: canSubmit ? "#f5f3ef" : "var(--color-text-muted)",
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit ? "0 2px 12px rgba(124, 92, 62, 0.35), 0 1px 3px rgba(124, 92, 62, 0.2)" : "none",
                letterSpacing: "0.03em",
              }}
            >
              {loading ? "Generating…" : "Find my palettes"}
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16" role="status" aria-live="polite">
              <div
                className="inline-block w-8 h-8 rounded-full border-2 animate-spin mb-4"
                style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
                aria-hidden="true"
              />
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Consulting Wada's palette…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="rounded-xl border px-6 py-5 text-sm mt-6"
              style={{ borderColor: "#c47a7a", background: "#fdf0f0", color: "#7a2020" }}
              role="alert"
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results */}
          {palettes.length > 0 && !loading && (
            <section className="mt-12" aria-label="Palette recommendations">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
                Recommended palettes
              </h2>
              <div className="flex flex-col gap-8">
                {palettes.map((p, i) => <PaletteCard key={i} palette={p} />)}
              </div>
            </section>
          )}

          {!loading && !error && palettes.length === 0 && (
            <p className="text-center text-sm mt-8" style={{ color: "var(--color-text-muted)" }}>
              Fill in the form above to get your palette recommendations.
            </p>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-10 text-center text-xs"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
      >
        Colors from <em>A Dictionary of Color Combinations</em> by Sanzo Wada (1883–1967),
        republished by Seigensha Art Publishing, 2010.
        <span className="mx-2" aria-hidden="true">·</span>
        Reference: <a href="https://sanzo-wada.dmbk.io" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>sanzo-wada.dmbk.io</a>
      </footer>

    </div>
  );
}
