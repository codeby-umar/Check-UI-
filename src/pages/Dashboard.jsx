import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiTrendingUp, FiActivity, FiPieChart, FiZap, FiArrowUpRight } from "react-icons/fi";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState({
    avgScore: 0,
    totalTests: 0,
    growth: 0,
    subjectData: [],
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "results"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
      
      if (data.length > 0) {
        const currentAvg = data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
        const prevAvg = data.length > 1 ? data.slice(1).reduce((acc, curr) => acc + curr.score, 0) / (data.length - 1) : currentAvg;
        const growthRate = prevAvg !== 0 ? ((currentAvg - prevAvg) / prevAvg) * 100 : 0;

        const subjects = {};
        data.forEach(r => {
          if (!subjects[r.subject]) subjects[r.subject] = { subject: r.subject, fullMark: 100, score: 0, count: 0 };
          subjects[r.subject].score += r.score;
          subjects[r.subject].count += 1;
        });
        const subjectData = Object.values(subjects).map(s => ({
          subject: s.subject,
          score: Math.round(s.score / s.count),
          fullMark: 100
        }));

        setAnalytics({
          avgScore: Math.round(currentAvg),
          totalTests: data.length,
          growth: growthRate.toFixed(1),
          subjectData
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    /* ASOSIY KONTEYNER: 100vh balandlik va ichki scroll */
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] text-white p-4 md:p-10 font-sans custom-scrollbar">
      
      {/* 1. Header & Quick Insights */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic">
            Analitika <span className="text-[#B23DEB] not-italic">Markazi</span>
          </h1>
          <p className="text-gray-500 mt-2">Sizning o'quv jarayoningiz haqida to'liq hisobot.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#B23DEB]/10 border border-[#B23DEB]/20 px-4 py-2 rounded-2xl flex items-center gap-3">
            <FiZap className="text-[#B23DEB] animate-pulse" />
            <span className="text-sm font-bold">O'sish: {analytics.growth}%</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard title="O'rtacha ball" value={`${analytics.avgScore}%`} sub="Umumiy samaradorlik" icon={<FiTrendingUp/>} color="#B23DEB" />
        <MetricCard title="Topshirilgan" value={analytics.totalTests} sub="Jami testlar soni" icon={<FiActivity/>} color="#3B82F6" />
        <MetricCard title="O'sish sur'ati" value={`+${analytics.growth}%`} sub="Oxirgi natijaga nisbatan" icon={<FiArrowUpRight/>} color="#10B981" />
        <MetricCard title="Maqsad" value="90%" sub="Keyingi marra" icon={<FiZap/>} color="#F59E0B" />
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#111] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><FiPieChart size={200}/></div>
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">Natijalar Dinamikasi</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...results].reverse()}>
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B23DEB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B23DEB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px'}} />
                <Area type="monotone" dataKey="score" stroke="#B23DEB" strokeWidth={4} fill="url(#purpleGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center">
          <h3 className="text-xl font-bold mb-8 self-start">Ko'nikmalar balansi</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.subjectData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10}} />
                <Radar name="Ball" dataKey="score" stroke="#B23DEB" fill="#B23DEB" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
           <h3 className="text-xl font-bold mb-6">O'quv Kalendari</h3>
           <style>{`
             .react-calendar { background: transparent !important; border: none !important; color: white; width: 100% !important; font-family: inherit; }
             .react-calendar__tile--active { background: #B23DEB !important; border-radius: 12px; box-shadow: 0 0 15px #B23DEB55; }
             .react-calendar__tile--now { background: #ffffff11 !important; border-radius: 12px; color: #B23DEB !important; }
             .react-calendar__tile:hover { background: #ffffff05 !important; border-radius: 12px; }
             .react-calendar__navigation button { color: white !important; font-size: 1.2rem; }
             .react-calendar__month-view__weekdays { color: #444; text-transform: uppercase; font-[10px]; }
           `}</style>
           <Calendar className="rounded-2xl" />
        </div>

        <div className="lg:col-span-2 bg-[#111] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden">
          <h3 className="text-xl font-bold mb-8">Batafsil jurnallar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4 font-black">Test nomi</th>
                  <th className="pb-4 font-black">Natija</th>
                  <th className="pb-4 font-black">Status</th>
                  <th className="pb-4 font-black text-right">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.slice(0, 6).map((res) => (
                  <tr key={res.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-sm">{res.testTitle}</td>
                    <td className="py-4 font-mono text-[#B23DEB] font-black">{res.score}%</td>
                    <td className="py-4">
                      <div className={`w-2 h-2 rounded-full ${res.score >= 70 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                    </td>
                    <td className="py-4 text-right text-gray-600 text-xs font-medium">
                      {res.date?.toDate().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB55; }
      `}</style>
    </div>
  );
};

const MetricCard = ({ title, value, sub, icon, color }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] hover:border-[#B23DEB]/20 transition-all duration-500 group">
    <div className="flex justify-between items-start mb-4">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>
      <div className="text-[#10B981] text-[10px] font-black bg-[#10B981]/10 px-2 py-1 rounded-lg flex items-center gap-1">
        <FiArrowUpRight/> UP
      </div>
    </div>
    <h3 className="text-3xl font-black mb-1 tracking-tight">{value}</h3>
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">{title}</p>
    <p className="text-[9px] text-gray-600 mt-2 italic">{sub}</p>
  </div>
);

export default Dashboard;