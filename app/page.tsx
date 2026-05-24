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
  const textOnBg = hexToLuma(background.hex) < 128 ? "#f5f3ef" : "#111111";

  return (
    <article
      className="rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      {/* Swatch preview bar — 60/30/10 proportions */}
      <div className="flex h-16" role="img" aria-label="Palette preview">
        <div className="flex-[6]" style={{ background: background.hex }} title={background.name} />
        <div className="flex-[3]" style={{ background: surface.hex }} title={surface.name} />
        <div className="flex-[1]" style={{ background: accent.hex }} title={accent.name} />
      </div>

      {/* Palette name */}
      <div className="px-6 pt-5 pb-2">
        <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          {palette.name}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          {palette.rationale}
        </p>
      </div>

      {/* Swatches */}
      <div className="px-6 py-4 flex gap-4 flex-wrap">
        {[
          { role: "60% BG", color: background },
          { role: "30% Surface", color: surface },
          { role: "10% Accent", color: accent },
        ].map(({ role, color }) => {
          const textColor = hexToLuma(color.hex) < 128 ? "#f5f3ef" : "#111111";
          return (
            <div key={role} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-mono"
                style={{ background: color.hex, color: textColor }}
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-medium leading-none" style={{ color: "var(--color-text)" }}>
                  {color.name}
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {color.hex}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {role}
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
  label,
  id,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-xl border px-4 py-3 text-sm min-h-[44px] appearance-none bg-no-repeat"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
          color: value ? "var(--color-text)" : "var(--color-text-muted)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 12px center",
          backgroundRepeat: "no-repeat",
          paddingRight: "40px",
        }}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
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

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: "var(--color-bg)" }}>
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex justify-center gap-2 mb-4" aria-hidden="true">
            {["#ffb3f0", "#a0c4a0", "#c4a87a", "#7ab8c4", "#c47a7a"].map((hex) => (
              <div key={hex} className="w-6 h-6 rounded-full" style={{ background: hex }} />
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--color-text)" }}>
            Sanzo Wada Palettes
          </h1>
          <p className="text-base max-w-prose mx-auto" style={{ color: "var(--color-text-muted)", maxWidth: "55ch" }}>
            Describe your site and receive curated color recommendations from Sanzo Wada's{" "}
            <em>A Dictionary of Color Combinations</em> — with CSS variables, ready to paste.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-8 flex flex-col gap-6 mb-12"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField
              label="Industry"
              id="industry"
              value={industry}
              onChange={setIndustry}
              options={INDUSTRIES}
              required
            />
            <SelectField
              label="Mood / tone"
              id="mood"
              value={mood}
              onChange={setMood}
              options={MOODS}
              required
            />
            <SelectField
              label="Background preference"
              id="bgpref"
              value={bgPref}
              onChange={setBgPref}
              options={BG_PREFS}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="count" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                Number of palettes
              </label>
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(e.target.value)}
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
                {["2", "3", "4"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Site description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what your site is about, who it's for, and the feeling you want to create…"
              className="rounded-xl border px-4 py-3 text-sm resize-none"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !industry || !mood}
            className="rounded-full px-8 py-3.5 font-semibold text-sm tracking-wide transition-all duration-200 min-h-[48px] self-center w-full sm:w-auto"
            style={{
              background: loading || !industry || !mood
                ? "var(--color-border)"
                : "var(--color-accent)",
              color: loading || !industry || !mood ? "var(--color-text-muted)" : "#f5f3ef",
              cursor: loading || !industry || !mood ? "not-allowed" : "pointer",
              boxShadow: loading || !industry || !mood
                ? "none"
                : "0 2px 12px rgba(124, 92, 62, 0.35), 0 1px 3px rgba(124, 92, 62, 0.2)",
              letterSpacing: "0.03em",
            }}
          >
            {loading ? "Generating…" : "Find my palettes"}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div
              className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-4"
              style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
              aria-hidden="true"
            />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Consulting Wada's palette…
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            className="rounded-xl border px-6 py-5 text-sm mb-8"
            style={{ borderColor: "#c47a7a", background: "#fdf0f0", color: "#7a2020" }}
            role="alert"
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {palettes.length > 0 && !loading && (
          <section aria-label="Palette recommendations">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--color-text)" }}>
              Recommended palettes
            </h2>
            <div className="flex flex-col gap-8">
              {palettes.map((p, i) => (
                <PaletteCard key={i} palette={p} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state (after load, no palettes) */}
        {!loading && !error && palettes.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-sm">Fill in the form above to get your palette recommendations.</p>
          </div>
        )}
      </div>

      <footer className="mt-24 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
        Colors from{" "}
        <em>A Dictionary of Color Combinations</em> by Sanzo Wada (1883–1967),
        republished by Seigensha.
      </footer>
    </main>
  );
}
