import { useState } from "react";
import { T } from "../constants/theme";
import { TASKS } from "../data/mockData";
import { Card } from "../components/UI";
import { Chip } from "../components/UI";
import { Btn } from "../components/UI";

const STATUS_COLOR  = { done: T.green, pending: T.amber, locked: T.muted };
const STATUS_LABEL  = { done: "Bajarildi", pending: "Faol", locked: "Qulflangan" };

export default function TasksPage() {
  const [tasks, setTasks]   = useState(TASKS);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", title: "", teacher: "", due: "", unlockAt: "" });

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  const handleAdd = () => {
    if (!form.subject || !form.title) return;
    const newTask = {
      id: tasks.length + 1,
      ...form,
      status: "locked",
      submitted: 0,
      total: 28,
    };
    setTasks(prev => [newTask, ...prev]);
    setForm({ subject: "", title: "", teacher: "", due: "", unlockAt: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: T.surface3, border: `1px solid ${T.border}`,
    borderRadius: 10, color: T.text, fontSize: 13, outline: "none",
    fontFamily: "'Instrument Sans', sans-serif",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeUp 0.4s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'Clash Display', sans-serif" }}>
            Vazifalar
          </div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>Barcha vazifalar boshqaruvi</div>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Yopish" : "+ Yangi vazifa"}
        </Btn>
      </div>

      {/* Add form */}
      {showForm && (
        <Card hover={false} style={{ padding: 24, border: `1px solid ${T.accent}44`, animation: "fadeIn 0.25s" }}>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", marginBottom: 18 }}>
            Yangi vazifa qo'shish
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              ["subject",   "Fan nomi",        "Matematika"],
              ["title",     "Vazifa sarlavhasi","Kvadrat tenglamalar"],
              ["teacher",   "O'qituvchi",       "Nodira xonim"],
              ["unlockAt",  "Ochilish vaqti",   "2025-03-05T09:00"],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                  {label.toUpperCase()}
                </label>
                <input
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
              MUDDAT
            </label>
            <input
              value={form.due}
              onChange={e => setForm(prev => ({ ...prev, due: e.target.value }))}
              placeholder="2025-03-05T18:00"
              style={{ ...inputStyle, maxWidth: 300 }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleAdd}>Saqlash</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Bekor qilish</Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 6 }}>
        {["all", "pending", "done", "locked"].map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 9, cursor: "pointer",
            fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            background: filter === f ? T.accent : T.surface2,
            color: filter === f ? "#fff" : T.muted,
            border: `1px solid ${filter === f ? T.accent : T.border}`,
          }}>
            {{ all: "Barchasi", pending: "Faol", done: "Yakunlangan", locked: "Qulflangan" }[f]}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>
              {f === "all" ? tasks.length : tasks.filter(t => t.status === f).length}
            </span>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(task => (
          <Card key={task.id} style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Status dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: STATUS_COLOR[task.status],
                boxShadow: task.status === "done" ? `0 0 8px ${T.green}` : "none",
              }} />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {task.subject} — {task.title}
                </div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 4, display: "flex", gap: 16 }}>
                  <span>👨‍🏫 {task.teacher}</span>
                  {task.due && (
                    <span>⏰ {new Date(task.due).toLocaleDateString("uz-UZ", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}</span>
                  )}
                  <span>🔓 {new Date(task.unlockAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>

              {/* Progress */}
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>TOPSHIRDI</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 60, height: 4, background: T.surface3, borderRadius: 2 }}>
                    <div style={{
                      height: "100%",
                      width: `${(task.submitted / task.total) * 100}%`,
                      background: STATUS_COLOR[task.status], borderRadius: 2,
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[task.status] }}>
                    {task.submitted}/{task.total}
                  </span>
                </div>
              </div>

              {/* Status chip */}
              <Chip color={STATUS_COLOR[task.status]}>
                {STATUS_LABEL[task.status]}
              </Chip>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" style={{ padding: "6px 14px", fontSize: 12 }}>Tahrirlash</Btn>
                <Btn variant="danger" onClick={() => handleDelete(task.id)} style={{ padding: "6px 14px", fontSize: 12 }}>
                  O'chirish
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.muted, fontSize: 14 }}>
          Bu kategoriyada vazifa yo'q
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
