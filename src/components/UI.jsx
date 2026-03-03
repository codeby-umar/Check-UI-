// src/components/UI.jsx
import { useState } from "react";
import { T } from "../constants/theme";

export function Avatar({ initials, color = T.accent, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Clash Display', sans-serif", fontWeight: 700,
      fontSize: size * 0.34, color: "#fff", flexShrink: 0,
      boxShadow: `0 0 0 2px ${T.bg}, 0 0 0 3px ${color}44`,
    }}>{initials}</div>
  );
}

// ── Chip / Badge ─────────────────────────────────────────────────────────────
export function Chip({ children, color = T.accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      color, background: color + "1a", border: `1px solid ${color}33`,
    }}>{children}</span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, hover = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface, border: `1px solid ${hov ? T.accent + "55" : T.border}`,
        borderRadius: 16, padding: 24, transition: "border-color .2s, transform .2s",
        transform: hov && hover ? "translateY(-2px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const [hov, setHov] = useState(false);
  const variants = {
    primary: { background: hov ? T.accentHov : T.accent, color: "#fff", border: "none" },
    ghost:   { background: hov ? T.surface2 : "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger:  { background: hov ? "#ff7070" : T.red, color: "#fff", border: "none" },
    success: { background: hov ? "#2ee8b8" : T.green, color: "#000", border: "none" },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        fontFamily: "'Instrument Sans', sans-serif", transition: "all .18s",
        ...variants[variant], ...style,
      }}
    >{children}</button>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, unit = "", color = T.accent, sub }) {
  return (
    <Card style={{ padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color }} />
      <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.8, marginBottom: 10 }}>{label}</div>
      <div style={{
        fontFamily: "'Clash Display', sans-serif", fontSize: 30, fontWeight: 700,
        color, lineHeight: 1,
      }}>
        {value}<span style={{ fontSize: 13, opacity: 0.6 }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

// ── ProgressRow ──────────────────────────────────────────────────────────────
export function ProgressRow({ label, value, max = 100, color = T.accent }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{value}</span>
      </div>
      <div style={{ height: 5, background: T.surface3, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, background: color,
          width: `${(parseFloat(value) / max) * 100}%`, transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = "text", placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: T.muted, display: "block", marginBottom: 7 }}>
          {label}
        </label>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "13px 16px",
          background: T.surface2, border: `1px solid ${focus ? T.accent : T.border}`,
          borderRadius: 12, color: T.text, fontSize: 14,
          fontFamily: "'Instrument Sans', sans-serif", outline: "none", transition: "border-color .2s",
        }}
      />
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
      {items.map(item => (
        <div key={item.key} onClick={() => onChange(item.key)} style={{
          padding: "7px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600,
          transition: "all .15s",
          background: active === item.key ? T.accent : T.surface2,
          color:      active === item.key ? "#fff" : T.muted,
          border:    `1px solid ${active === item.key ? T.accent : T.border}`,
        }}>{item.label}</div>
      ))}
    </div>
  );
}
