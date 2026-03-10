import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FiTrendingUp, FiActivity, FiZap, FiArrowUpRight, FiTerminal, FiBell, FiUser 
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    average: 0, total: 0, bestSubject: "-", growth: 0
  });

  const isFirstLoad = useRef(true);
  const processedIds = useRef(new Set());

  // 1. Profilni yuklash
  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) setUserData(userDoc.data());
      }
    };
    fetchProfile();
  }, []);

  // 2. NTFY BILDIRISHNOMA (Psixologik yondashuv bilan)
  const sendNtfyNotification = async (res, isAuto = false) => {
    const subject = res?.subject || "Dars";
    const testTitle = res?.testTitle || "Nazorat ishi";
    const score = Number(res?.score) || 0;
    const studentName = userData?.name || "O'quvchi";
    const phone = userData?.phone || "777777777";
    const parentTopic = phone.replace(/\D/g, "");

    let config = {
      title: "",
      tags: "",
      priority: "default",
      img: "https://ntfy.sh/static/images/success.png",
      message: ""
    };

    if (score >= 90) {
      // JUDA YUQORI NATIJA
      config = {
        title: `SUYUNCHI! A'LO NATIJA 🎉`,
        tags: "partying_face,star,mortar_board,heart",
        priority: "high",
        img: "https://previews.123rf.com/images/classicvector/classicvector2007/classicvector200700037/150785557-sysadmine-computer-programmer-working-at-computer.jpg",
        message: `Assalomu alaykum, hurmatli ota-ona! \n\nFarzandingiz ${studentName} bugun "${subject}" fanidan "${testTitle}" testida hayratlanarli ${score}% natija ko'rsatdi! \n\nBu juda yuqori ko'rsatkich! Farzandingiz bilan faxrlansangiz arziydi. Mashaqqatli mehnatlaringiz mevasi ko'rinmoqda. Ilohim, doim shunday cho'qqilarda bo'lsin! 🚀`
      };
    } else if (score >= 70) {
      // O'RTACHA YAXSHI
      config = {
        title: `Yaxshi natija - ${studentName}`,
        tags: "slightly_smiling_face,chart_with_upwards_trend",
        priority: "default",
        img: "https://ntfy.sh/static/images/success.png",
        message: `Assalomu alaykum! Farzandingiz ${studentName} "${subject}" fanidan ${score}% natija qayd etdi. \n\nKo'rsatkich yomon emas, bolangiz o'z ustida ishlamoqda. Yana biroz e'tibor va rag'bat bilan natijalarni yanada yuqori ko'tarish mumkin. Rahmat!`
      };
    } else {
      // PAST NATIJA - QATTIQ GAPLAR
      config = {
        title: `DIQQAT: NATIJA JUDA PAST! ⚠️`,
        tags: "warning,disappointed,exclamation",
        priority: "high",
        img: "https://img.freepik.com/fotos-premium/404-pagina-no-encontrada-concepto-escena-personas-diseno-dibujos-animados-plana-oficinista-esta-molesto_198565-6945.jpg",
        message: `DIQQAT: Hurmatli ota-ona! \n\nBugun farzandingiz ${studentName} "${subject}" fanidan "${testTitle}" testida juda past — bor-yo'g'i ${score}% natija ko'rsatdi. \n\nBu natija bizni jiddiy xavotirga solmoqda. Iltimos, farzandingizning darslariga tayyorgarligini QATTIQROQ NAZORAT QILING! Kelajakda qiynalib qolmasligi uchun hozirdan chora ko'rishingizni va jiddiyroq shug'ullanishini talab qilishingizni so'raymiz.`
      };
    }

    try {
      const url = `https://ntfy.sh/${parentTopic}/publish?message=${encodeURIComponent(config.message)}&title=${encodeURIComponent(config.title)}&tags=${config.tags}&priority=${config.priority}&attach=${encodeURIComponent(config.img)}`;
      
      const response = await fetch(url);

      if (response.ok) {
        if (isAuto) {
          toast.success(`Avto-SMS: ${studentName} - ${score}%`, { icon: '🤖' });
        } else {
          toast.success("Ota-onaga xabar yetkazildi! 📱");
        }
      }
    } catch (error) {
      console.error("SMS xatosi:", error);
    }
  };

  // 3. Firestore Realtime + Auto Notification
  useEffect(() => {
    if (!auth.currentUser || !userData) return;

    const q = query(
      collection(db, "results"), 
      where("userId", "==", auth.currentUser.uid), 
      orderBy("date", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newDoc = { id: change.doc.id, ...change.doc.data() };
          
          if (!isFirstLoad.current && !processedIds.current.has(newDoc.id)) {
            sendNtfyNotification(newDoc, true);
          }
          processedIds.current.add(newDoc.id);
        }
      });

      isFirstLoad.current = false;
      setResults(data);

      if (data.length > 0) {
        const avg = data.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / data.length;
        setStats({
          average: Math.round(avg),
          total: data.length,
          bestSubject: [...data].sort((a, b) => b.score - a.score)[0]?.subject || "-",
          growth: data[1] ? (((data[0].score - data[1].score) / (data[1].score || 1)) * 100).toFixed(1) : 0
        });
      }
    });

    return () => unsubscribe();
  }, [userData]); 

  // Kalendar uchun nuqtalar
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasTest = results.some((res) => {
        const testDate = res.date?.toDate ? res.date.toDate() : new Date(res.date);
        return testDate.toDateString() === date.toDateString();
      });
      return hasTest ? <div className="h-1.5 w-1.5 bg-[#B23DEB] rounded-full mx-auto mt-1 animate-pulse shadow-[0_0_5px_#B23DEB]"></div> : null;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      <Toaster position="bottom-center" />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#B23DEB] mb-2">
                <FiTerminal size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Core v3.0</span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                {userData?.name ? userData.name.split(" ")[0] : "User"} <span className="text-[#B23DEB] not-italic">Analytics</span>
              </h1>
            </div>
            
            <div className="bg-white/5 border border-white/10 px-6 py-3 flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{userData?.name || "Yuklanmoqda..."}</p>
                  <p className="text-emerald-400 text-xs font-black uppercase tracking-tighter italic">Active System</p>
               </div>
               <div className="w-10 h-10 bg-[#B23DEB]/10 rounded-xl flex items-center justify-center border border-[#B23DEB]/20">
                  <FiUser className="text-[#B23DEB]" />
               </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Samaradorlik" value={`${stats.average}%`} trend={stats.growth} sub="O'rtacha ko'rsatkich" icon={<FiTrendingUp/>} color="#B23DEB" />
            <MetricCard title="Testlar" value={stats.total} trend="+1" sub="Jami urinishlar" icon={<FiActivity/>} color="#3B82F6" />
            <MetricCard title="O'sish" value={`${stats.growth}%`} trend={stats.growth} sub="Dinamika" icon={<FiArrowUpRight/>} color="#10B981" />
            <MetricCard title="Eng yaxshi" value={stats.bestSubject} trend="MAX" sub="Asosiy yo'nalish" icon={<FiZap/>} color="#F59E0B" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#111] border border-white/5 p-8 relative overflow-hidden group">
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

            <div className="lg:col-span-4 bg-[#111] border border-white/5 p-8 flex flex-col items-center">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] self-start text-gray-500 mb-6">Activity Log</h3>
              <Calendar tileContent={tileContent} className="custom-cal" />
            </div>
          </div>

          {/* Results List */}
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">So'nggi urinishlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {results.map((res) => (
              <div key={res.id} className="group bg-[#111] border border-white/5 p-8 hover:border-[#B23DEB]/30 transition-all duration-500 relative overflow-hidden">
                <button 
                  onClick={() => sendNtfyNotification(res)}
                  className="absolute right-4 top-4 bg-[#B23DEB] text-white w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 z-10"
                >
                  <FiBell size={18} />
                </button>
                <div className="mb-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    {res.subject}
                  </span>
                </div>
                <h3 className="text-sm font-black italic uppercase text-gray-300 mb-8 leading-tight group-hover:text-white transition-colors">
                  {res.testTitle}
                </h3>
                <div className="flex justify-between items-end">
                    <span className="text-3xl font-black tracking-tighter italic">
                      {res.score}<span className="text-xs text-gray-600 not-italic ml-1">%</span>
                    </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${res.score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {res.score >= 70 ? 'Optimal' : 'Needs Review'}
                  </span>
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${res.score >= 70 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} style={{ width: `${res.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .custom-cal { background: transparent !important; border: none !important; color: white !important; }
        .react-calendar__tile { color: white; height: 45px !important; }
        .react-calendar__tile--now { background: rgba(178, 61, 235, 0.1) !important; color: #B23DEB !important; }
        .react-calendar__tile--active { background: #B23DEB !important; color: white !important; border-radius: 0 !important; }
        .react-calendar__navigation button { color: #B23DEB !important; font-size: 1.2rem; }
      `}</style>
    </div>
  );
};

const MetricCard = ({ title, value, sub, icon, color, trend }) => (
  <div className="bg-[#111] border border-white/5 p-6 hover:border-[#B23DEB]/30 transition-all duration-500 group relative">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 flex items-center justify-center text-xl border" style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}>
        {icon}
      </div>
      <div className={`px-2 py-1 text-[9px] font-black ${parseFloat(trend) >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
        {trend}%
      </div>
    </div>
    <h3 className="text-4xl font-black mb-1 tracking-tighter italic">{value}</h3>
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{title}</p>
    <p className="text-[9px] text-gray-600 mt-4 opacity-40 font-bold tracking-widest uppercase">{sub}</p>
  </div>
);

export default Dashboard;