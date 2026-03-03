import { useState } from "react";
import { T } from "../constants/theme";
import { STUDENTS } from "../data/mockData";
import { Card } from "../components/UI";
import { Avatar } from "../components/UI";
import { Chip } from "../components/UI";
import { Btn } from "../components/UI";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeUp 0.4s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'Clash Display', sans-serif" }}>
            O'quvchilar
          </div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>
            9-A sinf · {STUDENTS.length} ta o'quvchi
          </div>
        </div>
        <Btn>+ O'quvchi qo'shish</Btn>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Ism bo'yicha qidirish..."
        style={{
          width: "100%", maxWidth: 360, padding: "11px 16px",
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, color: T.text, fontSize: 14, outline: "none",
          fontFamily: "'Instrument Sans', sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.border}
      />

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map((s, i) => (
          <Card key={s.id} style={{ padding: 22, cursor: "pointer" }}
            onClick={() => setSelected(selected?.id === s.id ? null : s)}>

            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <Avatar initials={s.avatar} color={s.color} size={46} />
              <div style={{
                fontSize: 22, fontWeight: 700, color: s.color,
                fontFamily: "'Clash Display', sans-serif",
              }}>
                {s.rating}
              </div>
            </div>

            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
              {i < 3 ? ["🥇 1-o'rin", "🥈 2-o'rin", "🥉 3-o'rin"][i] : `#${i + 1} o'rin`}
            </div>

            {/* Stats bars */}
            {[
              { label: "Davomat",   val: s.attendance, max: 100, color: T.green  },
              { label: "Vazifalar", val: (s.tasks / 21) * 100, max: 100, color: T.accent },
              { label: "Reyting",   val: s.rating * 10,        max: 100, color: s.color  },
            ].map((r, j) => (
              <div key={j} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: T.muted }}>{r.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: r.color }}>
                    {r.label === "Vazifalar" ? `${s.tasks}/21` : r.label === "Reyting" ? `${s.rating}/10` : `${s.attendance}%`}
                  </span>
                </div>
                <div style={{ height: 4, background: T.surface3, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${r.val}%`, background: r.color, borderRadius: 2, transition: "width 0.8s" }} />
                </div>
              </div>
            ))}

            {/* Expanded detail */}
            {selected?.id === s.id && (
              <div style={{
                marginTop: 16, paddingTop: 16,
                borderTop: `1px solid ${T.border}`,
                animation: "fadeIn 0.2s",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: T.muted }}>Telefon</span>
                  <span style={{ color: T.text }}>{s.phone}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: T.muted }}>Sinf</span>
                  <span style={{ color: T.text }}>9-A</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <Btn style={{ flex: 1, padding: "7px", fontSize: 12 }}>SMS yuborish</Btn>
                  <Btn variant="ghost" style={{ flex: 1, padding: "7px", fontSize: 12 }}>Batafsil</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
