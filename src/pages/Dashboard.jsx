import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
} from "recharts";
import { 
  FiTrendingUp, FiActivity, FiPieChart, FiZap, 
  FiArrowUpRight, FiCheckCircle, FiTerminal 
} from "react-icons/fi";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState({
    avgScore: 0,
    totalTests: 0,
    growth: 0,
    subjectData: [],
    activityMap: {}
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
        const lastScore = data[0].score;
        const prevScore = data[1] ? data[1].score : lastScore;
        const growthRate = ((lastScore - prevScore) / (prevScore || 1)) * 100;

        const subjects = {};
        const activity = {};

        data.forEach(r => {
          // Radar chart uchun
          const subName = r.subject || "Umumiy";
          if (!subjects[subName]) subjects[subName] = { subject: subName, score: 0, count: 0 };
          subjects[subName].score += r.score;
          subjects[subName].count += 1;

          // Activity Map (GitHub style) uchun
          if (r.date) {
            const d = r.date.toDate().toISOString().split('T')[0];
            activity[d] = (activity[d] || 0) + 1;
          }
        });

        setAnalytics({
          avgScore: Math.round(currentAvg),
          totalTests: data.length,
          growth: growthRate.toFixed(1),
          activityMap: activity,
          subjectData: Object.values(subjects).map(s => ({
            subject: s.subject,
            score: Math.round(s.score / s.count),
            fullMark: 100
          }))
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    /* ASOSIY KONTEYNER: h-screen va overflow-hidden orqali ekranga qamab qo'yamiz */
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      
      {/* Scroll bo'ladigan qism */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* 1. Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#B23DEB] mb-2">
                <FiTerminal size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Core v3.0</span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">
                User <span className="text-[#B23DEB] not-italic">Analytics</span>
              </h1>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">System Status</span>
                <span className="text-emerald-400 text-xs font-black uppercase">Active & Secured</span>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* 2. Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Samaradorlik" value={`${analytics.avgScore}%`} trend={analytics.growth} sub="O'rtacha ko'rsatkich" icon={<FiTrendingUp/>} color="#B23DEB" />
            <MetricCard title="Testlar" value={analytics.totalTests} trend="+2" sub="Jami urinishlar" icon={<FiActivity/>} color="#3B82F6" />
            <MetricCard title="O'sish" value={`${analytics.growth}%`} trend={analytics.growth} sub="Oxirgi natijadan" icon={<FiArrowUpRight/>} color="#10B981" />
            <MetricCard title="Rank" value="PRO" trend="0" sub="Bilim darajasi" icon={<FiZap/>} color="#F59E0B" />
          </div>

          {/* 3. Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Area Chart */}
            <div className="lg:col-span-8 bg-[#111] border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <FiPieChart size={200}/>
              </div>
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
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '15px'}} />
                    <Area type="monotone" dataKey="score" stroke="#B23DEB" strokeWidth={4} fill="url(#purpleGlow)" dot={{ r: 4, fill: '#B23DEB', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="lg:col-span-4 bg-[#111] border border-white/5 p-8 rounded-[3rem] flex flex-col items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] self-start text-gray-500 mb-6">Skills Radar</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.subjectData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#444', fontSize: 10, fontWeight: 'bold'}} />
                    <Radar name="Ball" dataKey="score" stroke="#B23DEB" fill="#B23DEB" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] font-bold text-gray-600 uppercase mt-4">Balanslangan ko'rsatkich</p>
            </div>
          </div>

          {/* 4. GitHub Style Activity Grid */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-[3rem]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-500 flex items-center gap-2">
              <FiCheckCircle className="text-[#B23DEB]"/> Kunlik Faollik (Deployment Map)
            </h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(70)].map((_, i) => {
                const colors = ['bg-white/5', 'bg-[#B23DEB]/20', 'bg-[#B23DEB]/40', 'bg-[#B23DEB]/60', 'bg-[#B23DEB]'];
                // Simulation: i % 5 va i % 3 orqali tasodifiy faollik ko'rsatamiz
                const intensity = (i % 5 === 0 || i % 3 === 0) ? Math.floor(Math.random() * 5) : 0;
                return (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-[3px] ${colors[intensity]} transition-all hover:ring-2 ring-white/30 cursor-pointer`}
                    title={`Activity: ${intensity}`}
                  ></div>
                )
              })}
            </div>
            <div className="mt-6 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
              <span>Less</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-white/5 rounded-sm"></div>
                <div className="w-3 h-3 bg-[#B23DEB]/30 rounded-sm"></div>
                <div className="w-3 h-3 bg-[#B23DEB]/60 rounded-sm"></div>
                <div className="w-3 h-3 bg-[#B23DEB] rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* 5. Recent Logs (Table) */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-[3rem] overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">So'nggi protokollar</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="pb-6 font-black">Test Title</th>
                    <th className="pb-6 font-black text-center">Efficiency</th>
                    <th className="pb-6 font-black text-center">Status</th>
                    <th className="pb-6 font-black text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.slice(0, 6).map((res) => (
                    <tr key={res.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 font-bold text-sm italic tracking-tight text-gray-300 group-hover:text-white transition-colors">
                        {res.testTitle}
                      </td>
                      <td className="py-5 font-mono text-[#B23DEB] font-black text-center text-lg">
                        {res.score}%
                      </td>
                      <td className="py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          res.score >= 70 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {res.score >= 70 ? 'Passed' : 'Review'}
                        </span>
                      </td>
                      <td className="py-5 text-right text-gray-600 text-[10px] font-black uppercase tracking-tighter">
                        {res.date?.toDate().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

const MetricCard = ({ title, value, sub, icon, color, trend }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] hover:border-[#B23DEB]/30 transition-all duration-500 group relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-white/[0.05] transition-all transform group-hover:scale-150 group-hover:-rotate-12">
      <div className="text-8xl">{icon}</div>
    </div>
    <div className="flex justify-between items-start mb-6">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
      >
        {icon}
      </div>
      <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${parseFloat(trend) >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
        {parseFloat(trend) >= 0 ? <FiArrowUpRight/> : <FiTrendingUp className="rotate-180"/>} {Math.abs(trend)}%
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-4xl font-black mb-1 tracking-tighter italic">{value}</h3>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{title}</p>
      <p className="text-[9px] text-gray-400 mt-4 opacity-40 font-bold tracking-widest uppercase">{sub}</p>
    </div>
  </div>
);

export default Dashboard;