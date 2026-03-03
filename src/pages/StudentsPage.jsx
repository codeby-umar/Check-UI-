import { useMemo, useState } from "react";
import { STUDENTS } from "../data/mockData";
import { Card, Avatar, Btn } from "../components/UI";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STUDENTS;
    return STUDENTS.filter((s) => s.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="flex flex-col gap-6 animate-[fadeUp_.35s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            O&apos;quvchilar
          </div>
          <div className="mt-1 text-sm text-slate-500">
            9-A sinf · {STUDENTS.length} ta o&apos;quvchi
          </div>
        </div>
        <Btn>+ O&apos;quvchi qo&apos;shish</Btn>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Ism bo'yicha qidirish..."
        className="w-full max-w-[360px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s, i) => {
          const isOpen = selected?.id === s.id;

          const rankLabel =
            i < 3 ? ["🥇 1-o'rin", "🥈 2-o'rin", "🥉 3-o'rin"][i] : `#${i + 1} o'rin`;

          const stats = [
            { label: "Davomat", pct: s.attendance, right: `${s.attendance}%`, color: "bg-emerald-500" },
            { label: "Vazifalar", pct: (s.tasks / 21) * 100, right: `${s.tasks}/21`, color: "bg-violet-600" },
            { label: "Reyting", pct: s.rating * 10, right: `${s.rating}/10`, color: "bg-sky-500" },
          ];

          return (
            <div
              key={s.id}
              className="cursor-pointer"
              onClick={() => setSelected(isOpen ? null : s)}
            >
              <Card className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar gradient rangini s.color bilan beramiz */}
                  <Avatar initials={s.avatar} color={s.color} size={46} />
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: s.color }}
                  >
                    {s.rating}
                  </div>
                </div>

                <div className="text-[15px] font-bold text-slate-900 mb-1">
                  {s.name}
                </div>
                <div className="text-xs text-slate-500 mb-4">{rankLabel}</div>

                {/* Stats bars */}
                <div className="space-y-2.5">
                  {stats.map((r, j) => (
                    <div key={j}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">{r.label}</span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {r.right}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ease-out ${r.color}`}
                          style={{ width: `${Math.max(0, Math.min(100, r.pct))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-200 animate-[fadeIn_.2s_ease] flex flex-col gap-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Telefon</span>
                      <span className="text-slate-900">{s.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Sinf</span>
                      <span className="text-slate-900">9-A</span>
                    </div>

                    <div className="mt-1 flex gap-2">
                      <Btn className="flex-1 px-3 py-2 text-xs">SMS yuborish</Btn>
                      <Btn variant="ghost" className="flex-1 px-3 py-2 text-xs">
                        Batafsil
                      </Btn>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}