import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import emailjs from '@emailjs/browser'; 
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
import { 
  FiTrendingUp, FiActivity, FiPieChart, FiZap, 
  FiArrowUpRight, FiCheckCircle, FiTerminal, FiMail 
} from "react-icons/fi";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    bestSubject: "-",
    growth: 0
  });

  // --- EMAILJS MANTIQI ---
  const sendSMSResult = (res) => {
    const templateParams = {
      to_phone: "+998507121208", // Sening kodingdagi raqam
      subject: res.subject,      
      score: res.score,          
      test_title: res.testTitle, 
      message: `Tabriklaymiz! Siz ${res.subject} fanidan ${res.score}% natija qayd etdingiz.` 
    };

    emailjs.send(
      'service_4bvzqy2',    // Service ID
      'template_pa6vbdm',   // Template ID
      templateParams, 
      's3ey1weWzO5vZCz9N'   // Public Key
    )
    .then(() => {
      alert("Natija telefoningizga yuborildi! ✅");
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Xatolik yuz berdi! Sozlamalarni tekshiring.");
    });
  };

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
        const avg = data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
        const lastScore = data[0].score;
        const prevScore = data[1] ? data[1].score : lastScore;
        const growthRate = ((lastScore - prevScore) / (prevScore || 1)) * 100;

        setStats({
          average: Math.round(avg),
          total: data.length,
          bestSubject: [...data].sort((a, b) => b.score - a.score)[0].subject,
          growth: growthRate.toFixed(1)
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
        <div className="h-1.5 w-1.5 bg-[#B23DEB] rounded-full mx-auto mt-1 animate-pulse shadow-[0_0_5px_#B23DEB]"></div>
      ) : null;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      
      <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* 1. Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#B23DEB] mb-2">
                <FiTerminal size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Core v3.0</span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                User <span className="text-[#B23DEB] not-italic">Analytics</span>
              </h1>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">System Status</p>
                    <p className="text-emerald-400 text-xs font-black uppercase">Online</p>
                  </div>
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* 2. Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Samaradorlik" value={`${stats.average}%`} trend={stats.growth} sub="O'rtacha ko'rsatkich" icon={<FiTrendingUp/>} color="#B23DEB" />
            <MetricCard title="Testlar" value={stats.total} trend="+1" sub="Jami urinishlar" icon={<FiActivity/>} color="#3B82F6" />
            <MetricCard title="O'sish" value={`${stats.growth}%`} trend={stats.growth} sub="Oxirgi natijadan" icon={<FiArrowUpRight/>} color="#10B981" />
            <MetricCard title="Eng yaxshi" value={stats.bestSubject} trend="0" sub="Asosiy yo'nalish" icon={<FiZap/>} color="#F59E0B" />
          </div>

          {/* 3. Charts & Calendar Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Area Chart */}
            <div className="lg:col-span-8 bg-[#111] border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500 flex items-center gap-2">
                <FiActivity className="text-[#B23DEB]"/> Progress Dinamikasi
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[...results].reverse()}>
                    <defs>
                      <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B23DEB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#B23DEB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '15px'}} />
                    <Area type="monotone" dataKey="score" stroke="#B23DEB" strokeWidth={4} fill="url(#purpleGlow)" dot={{ r: 4, fill: '#B23DEB' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="lg:col-span-4 bg-[#111] border border-white/5 p-8 rounded-[3rem] flex flex-col items-center">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] self-start text-gray-500 mb-6">Activity Log</h3>
              <style>{`
                .react-calendar { background: transparent !important; border: none !important; width: 100% !important; color: white; font-family: inherit; }
                .react-calendar__tile--active { background: #B23DEB !important; border-radius: 12px; color: white !important; }
                .react-calendar__tile { height: 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
                .react-calendar__navigation button { color: #B23DEB; font-weight: bold; }
                .react-calendar__month-view__weekdays__weekday { color: #444; text-decoration: none; font-size: 0.6rem; text-transform: uppercase; font-weight: 900; }
              `}</style>
              <Calendar tileContent={tileContent} className="custom-cal" />
            </div>
          </div>

          {/* 4. Recent Attempts Grid */}
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">So'nggi urinishlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {results.map((res) => (
              <div key={res.id} className="group bg-[#111] border border-white/5 p-8 rounded-[2.5rem] hover:border-[#B23DEB]/30 transition-all duration-500 relative overflow-hidden">
                
                {/* EmailJS/SMS Button */}
                <button 
                  onClick={() => sendSMSResult(res)}
                  className="absolute right-4 top-4 bg-[#B23DEB] text-white w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-10 group-hover:translate-x-0 shadow-[0_0_15px_#B23DEB55]"
                >
                  <FiMail size={18} />
                </button>

                <div className="mb-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    {res.subject}
                  </span>
                </div>

                <h3 className="text-sm font-black italic uppercase text-gray-300 mb-8 leading-tight group-hover:text-white transition-colors">
                  {res.testTitle}
                </h3>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black tracking-tighter italic">
                      {res.score}<span className="text-xs text-gray-600 not-italic ml-1">%</span>
                    </span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${res.score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {res.score >= 70 ? 'Optimal' : 'Needs Review'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${res.score >= 70 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                    style={{ width: `${res.score}%` }}
                   ></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB55; }
      `}</style>
    </div>
  );
};

// MetricCard Component
const MetricCard = ({ title, value, sub, icon, color, trend }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] hover:border-[#B23DEB]/30 transition-all duration-500 group relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
      >
        {icon}
      </div>
      <div className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 ${parseFloat(trend) >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
        {trend}%
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-4xl font-black mb-1 tracking-tighter italic">{value}</h3>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{title}</p>
      <p className="text-[9px] text-gray-600 mt-4 opacity-40 font-bold tracking-widest uppercase leading-none">{sub}</p>
    </div>
  </div>
);

export default Dashboard;