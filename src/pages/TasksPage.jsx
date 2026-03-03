import { useMemo, useState } from "react";
import { TASKS } from "../data/mockData";
import { Card, Chip, Btn } from "../components/UI";

const STATUS = {
  done: {
    label: "Bajarildi",
    dot: "bg-emerald-500",
    chipColor: "#22C55E",
    barColor: "bg-emerald-500",
    glow: "shadow-[0_0_10px_rgba(34,197,94,0.55)]",
  },
  pending: {
    label: "Faol",
    dot: "bg-amber-500",
    chipColor: "#F59E0B",
    barColor: "bg-amber-500",
    glow: "",
  },
  locked: {
    label: "Qulflangan",
    dot: "bg-slate-400",
    chipColor: "#94A3B8",
    barColor: "bg-slate-400",
    glow: "",
  },
};

const FILTER_LABEL = {
  all: "Barchasi",
  pending: "Faol",
  done: "Yakunlangan",
  locked: "Qulflangan",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    title: "",
    teacher: "",
    due: "",
    unlockAt: "",
  });

  const filtered = useMemo(() => {
    return filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      done: tasks.filter((t) => t.status === "done").length,
      locked: tasks.filter((t) => t.status === "locked").length,
    };
  }, [tasks]);

  const handleAdd = () => {
    if (!form.subject.trim() || !form.title.trim()) return;

    const newTask = {
      id: (tasks?.[0]?.id || tasks.length) + 1,
      ...form,
      status: "locked",
      submitted: 0,
      total: 28,
    };

    setTasks((prev) => [newTask, ...prev]);
    setForm({ subject: "", title: "", teacher: "", due: "", unlockAt: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const fmtDue = (due) => {
    if (!due) return null;
    const d = new Date(due);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fmtUnlockTime = (unlockAt) => {
    if (!unlockAt) return null;
    const d = new Date(unlockAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-6 animate-[fadeUp_.35s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            Vazifalar
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Barcha vazifalar boshqaruvi
          </div>
        </div>

        <Btn onClick={() => setShowForm((v) => !v)}>
          {showForm ? "✕ Yopish" : "+ Yangi vazifa"}
        </Btn>
      </div>

      {/* Add form */}
      {showForm && (
        <Card
          hover={false}
          className="border-violet-500/30 animate-[fadeIn_.25s_ease] p-6"
        >
          <div className="text-[15px] font-extrabold text-slate-900 mb-4">
            Yangi vazifa qo'shish
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
            {[
              ["subject", "Fan nomi", "Matematika"],
              ["title", "Vazifa sarlavhasi", "Kvadrat tenglamalar"],
              ["teacher", "O'qituvchi", "Nodira xonim"],
              ["unlockAt", "Ochilish vaqti", "2025-03-05T09:00"],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.14em] text-slate-500">
                  {String(label).toUpperCase()}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none transition focus:border-violet-500"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.14em] text-slate-500">
              MUDDAT
            </label>
            <input
              value={form.due}
              onChange={(e) => setForm((p) => ({ ...p, due: e.target.value }))}
              placeholder="2025-03-05T18:00"
              className="w-full max-w-[300px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none transition focus:border-violet-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn onClick={handleAdd}>Saqlash</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>
              Bekor qilish
            </Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "done", "locked"].map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "rounded-lg px-4 py-2 text-xs font-semibold border transition",
                active
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
              ].join(" ")}
            >
              {FILTER_LABEL[f]}
              <span className="ml-1.5 opacity-70">
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3">
        {filtered.map((task) => {
          const s = STATUS[task.status] || STATUS.locked;
          const progress =
            task.total > 0 ? Math.max(0, Math.min(100, (task.submitted / task.total) * 100)) : 0;

          return (
            <Card key={task.id} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: status + info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={[
                      "mt-1 h-2.5 w-2.5 rounded-full shrink-0",
                      s.dot,
                      task.status === "done" ? s.glow : "",
                    ].join(" ")}
                  />

                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-slate-900 truncate">
                      {task.subject} — {task.title}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>👨‍🏫 {task.teacher}</span>
                      {fmtDue(task.due) ? <span>⏰ {fmtDue(task.due)}</span> : null}
                      {fmtUnlockTime(task.unlockAt) ? (
                        <span>🔓 {fmtUnlockTime(task.unlockAt)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="lg:w-[220px]">
                  <div className="text-[11px] text-slate-500 mb-1">TOPSHIRDI</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={["h-full rounded-full", s.barColor].join(" ")}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: s.chipColor }}>
                      {task.submitted}/{task.total}
                    </span>
                  </div>
                </div>

                {/* Status chip */}
                <div className="lg:ml-auto">
                  <Chip color={s.chipColor}>{s.label}</Chip>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Btn variant="ghost" className="px-3 py-1.5 text-xs">
                    Tahrirlash
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1.5 text-xs"
                  >
                    O'chirish
                  </Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 text-sm text-slate-500">
          Bu kategoriyada vazifa yo'q
        </div>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(-8px) } to { opacity:1; transform: translateY(0) } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}