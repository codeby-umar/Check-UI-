// src/components/UI.jsx
import React from "react";

// ── Avatar ─────────────────────────────────────────────────────────────
export function Avatar({ initials, color = "#6D5EF3", size = 38 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold shrink-0 ring-2 ring-white/80 shadow-sm"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        boxShadow: `0 0 0 3px ${color}33`,
      }}
    >
      {initials}
    </div>
  );
}

// ── Chip / Badge ───────────────────────────────────────────────────────
export function Chip({ children, color = "#6D5EF3" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide border"
      style={{
        color,
        backgroundColor: `${color}1a`,
        borderColor: `${color}33`,
      }}
    >
      {children}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────────────
export function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-6 shadow-sm transition",
        hover ? "hover:-translate-y-0.5 hover:border-violet-400/50" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-400 text-slate-900 hover:bg-emerald-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[base, variants[variant] || variants.primary, className].join(" ")}
    >
      {children}
    </button>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────
export function StatCard({ label, value, unit = "", color = "#6D5EF3", sub }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ background: color }} />
      <div className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 mb-2">
        {label}
      </div>

      <div className="leading-none">
        <span className="text-3xl font-extrabold" style={{ color }}>
          {value}
        </span>
        {unit ? <span className="ml-1 text-xs text-slate-500/80">{unit}</span> : null}
      </div>

      {sub ? <div className="mt-2 text-xs text-slate-500">{sub}</div> : null}
    </Card>
  );
}

// ── ProgressRow ────────────────────────────────────────────────────────
export function ProgressRow({ label, value, max = 100, color = "#6D5EF3" }) {
  const numeric = typeof value === "number" ? value : parseFloat(String(value));
  const pct = Number.isFinite(numeric) ? Math.max(0, Math.min(100, (numeric / max) * 100)) : 0;

  return (
    <div className="mb-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {value}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      {label ? (
        <label className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-slate-500">
          {label}
        </label>
      ) : null}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900
          outline-none transition focus:border-violet-500
        "
      />
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────
export function Tabs({ items, active, onChange }) {
  return (
    <div className="mb-5 flex gap-1.5">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold transition border",
              isActive
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}