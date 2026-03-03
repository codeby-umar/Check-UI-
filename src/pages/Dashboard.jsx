import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    bestSubject: "-",
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "results"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
      if (data.length > 0) {
        const avg =
          data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
        setStats({
          average: Math.round(avg),
          total: data.length,
          bestSubject: [...data].sort((a, b) => b.score - a.score)[0].subject,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasTest = results.some(
        (res) => res.date?.toDate().toDateString() === date.toDateString(),
      );
      return hasTest ? (
        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mx-auto mt-1 animate-pulse"></div>
      ) : null;
    }
  };

  return (
    <div className="p-6 md:p-10 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          <StatCard title="O'rtacha" value={`${stats.average}%`} icon="🔥" />
          <StatCard title="Testlar" value={stats.total} icon="📚" />
          <StatCard title="Eng yaxshi" value={stats.bestSubject} icon="🏆" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>{" "}
            Natijalar o'sishi
          </h2>
          <div className="h-90 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...results].reverse()}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="date" hide />
                <YAxis
                  domain={[0, 100]}
                  stroke="#cbd5e1"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#6366f1" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 self-start tracking-tight">
            Faollik
          </h2>
          <style>{`
            .react-calendar { border: none !important; width: 100% !important; font-family: inherit; }
            .react-calendar__tile--active { background: #6366f1 !important; border-radius: 12px; color: white !important; }
            .react-calendar__tile { height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; }
            .react-calendar__navigation button { font-weight: bold; font-size: 1.1rem; color: #6366f1; }
            .react-calendar__month-view__weekdays__weekday { text-decoration: none; color: #cbd5e1; font-size: 0.7rem; text-transform: uppercase; }
          `}</style>
          <Calendar tileContent={tileContent} className="custom-cal" />
        </div>
      </div>

      <h2 className="text-2xl font-black mt-16 mb-8 text-slate-800 tracking-tight">
        So'nggi urinishlar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {results.map((res) => (
          <div
            key={res.id}
            className="group bg-white p-6 rounded-sm  hover:shadow-indigo-100 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                {res.subject}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {res.date
                    ?.toDate()
                    .toLocaleDateString("uz-UZ", {
                      day: "numeric",
                      month: "short",
                    })}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">
              {res.testTitle}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-slate-900">
                  {res.score}
                  <span className="text-sm text-slate-400">%</span>
                </span>
                <span
                  className={`text-[10px] font-bold ${res.score >= 70 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {res.score >= 70 ? "MUVAFFAQIYATLI" : "YAXSHIROQ O'QI"}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                    res.score >= 70
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                      : "bg-gradient-to-r from-orange-400 to-amber-400"
                  }`}
                  style={{ width: `${res.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white/60 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-sm flex items-center gap-3">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-sm md:text-lg font-black text-slate-900 leading-tight">
        {value}
      </h3>
    </div>
  </div>
);

export default Dashboard;
