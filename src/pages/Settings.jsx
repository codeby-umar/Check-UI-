import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { 
  Camera, Save, ShieldCheck, Zap, 
  BellRing, Crown, Settings as SettingsIcon,
  RefreshCw, Fingerprint, Activity, Mail, 
  Lock, ShieldAlert, Cpu, ChevronDown
} from "lucide-react";

const Settings = () => {
  const [adminData, setAdminData] = useState({
    name: "Yuklanmoqda...",
    email: "",
    role: "Bosh Admin",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=Admin",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdminData(prev => ({ ...prev, ...docSnap.data() }));
        }
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 custom-scrollbar">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
        
        {/* Left Side: Profile & Stats */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Profile Card */}
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] text-center relative overflow-hidden group backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#B23DEB] via-transparent to-transparent opacity-10 group-hover:opacity-25 transition-all duration-1000"></div>
            
            <div className="relative w-44 h-44 mx-auto mb-8 mt-4 group/avatar">
              <div className="w-full h-full rounded-[3rem] bg-gradient-to-tr from-[#B23DEB] via-purple-500 to-pink-500 p-1 shadow-[0_0_50px_rgba(178,61,235,0.2)] transform group-hover/avatar:rotate-6 transition-transform duration-500">
                <div className="w-full h-full rounded-[2.9rem] bg-[#0a0a0a] p-1.5 overflow-hidden">
                  <img 
                    src={adminData.image} 
                    className="w-full h-full rounded-[2.5rem] object-cover opacity-80 group-hover/avatar:scale-110 transition-all duration-700"
                    alt="admin-avatar"
                  />
                </div>
              </div>
              <label className="absolute -bottom-2 -right-2 p-4 bg-[#B23DEB] text-white rounded-2xl shadow-[0_10px_20px_rgba(178,61,235,0.4)] hover:scale-110 hover:rotate-12 transition-all cursor-pointer border-4 border-[#0a0a0a]">
                <Camera size={22} />
                <input type="file" className="hidden" />
              </label>
            </div>

            <div className="relative space-y-3">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-black text-white tracking-tighter italic drop-shadow-lg">{adminData.name}</h2>
                <Crown size={24} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
              </div>
              <p className="text-[#B23DEB] font-black text-[10px] uppercase tracking-[0.4em] px-4 py-1 bg-[#B23DEB]/10 rounded-full inline-block mb-8 border border-[#B23DEB]/20">{adminData.role}</p>
              
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 flex items-center justify-between group/id hover:border-[#B23DEB]/30 transition-all duration-500">
                <div className="flex items-center gap-3">
                   <Fingerprint size={16} className="text-gray-600 group-hover/id:text-[#B23DEB] transition-colors" />
                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Root Hash</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400 group-hover/id:text-white transition-colors">777_X_ROOT</span>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] text-white backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-white/[0.03] group-hover:text-[#B23DEB]/10 transition-colors duration-700 rotate-12">
               <Cpu size={140} />
            </div>
            <h3 className="font-black mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              <Activity size={18} className="text-[#B23DEB]" /> Tizim Resurslari
            </h3>
            <div className="space-y-10">
              <ProgressItem label="CPU Usage" percent="28%" color="bg-[#B23DEB]" />
              <ProgressItem label="Firewall Security" percent="100%" color="bg-emerald-500 shadow-[0_0_15px_#10b981]" />
            </div>
          </div>
        </div>

        {/* Right Side: Configuration */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-14 rounded-[4rem] backdrop-blur-2xl relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                   System <span className="text-[#B23DEB]">Config</span>
                </h2>
                <p className="text-gray-500 text-sm mt-3 font-medium tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500"/> Xavfsiz ulanish o'rnatilgan
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-[#B23DEB] to-purple-800 text-white rounded-[2rem] shadow-[0_10px_30px_rgba(178,61,235,0.3)] animate-pulse">
                <SettingsIcon size={32} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <AdminInput label="Admin Fullname" value={adminData.name} icon={<Zap size={18} className="text-yellow-400" />} />
              <AdminInput label="Recovery Email" value={auth.currentUser?.email || "admin@test.uz"} icon={<Mail size={18} className="text-blue-400" />} />
              <AdminInput label="Access Key" value="**********" type="password" icon={<Lock size={18} className="text-red-400" />} />
              
              {/* Premium Select Menu */}
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-[#B23DEB]" /> Authority Level
                </label>
                <div className="relative flex items-center">
                  <select className="w-full bg-white/[0.03] border border-white/5 text-gray-200 px-8 py-5 rounded-[2rem] font-bold outline-none appearance-none focus:border-[#B23DEB]/50 transition-all cursor-pointer">
                    <option className="bg-[#1a1a1a]">ROOT ACCESS</option>
                    <option className="bg-[#1a1a1a]">MANAGER</option>
                    <option className="bg-[#1a1a1a]">EDITOR</option>
                  </select>
                  <ChevronDown className="absolute right-6 text-gray-600 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ToggleCard 
                icon={<BellRing className="text-orange-500" />} 
                title="Global Notifications" 
                desc="Tizimdagi barcha o'zgarishlar uchun push-xabarlar"
                active={true}
              />
              <ToggleCard 
                icon={<ShieldCheck className="text-[#B23DEB]" />} 
                title="Biometric Login" 
                desc="Kirishda FaceID yoki Fingerprint talab qilish"
                active={false}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-8">
            <button className="flex items-center gap-3 text-gray-600 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-all group">
              <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> 
              Reset All
            </button>
            <button className="w-full sm:w-auto px-16 py-6 bg-[#B23DEB] text-white rounded-[2.5rem] font-black shadow-[0_20px_40px_rgba(178,61,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 tracking-[0.2em] text-sm uppercase group">
              <Save size={24} className="group-hover:animate-bounce" /> 
              Save Changes
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

// --- Custom Sub-Components ---

const AdminInput = ({ label, value, type = "text", disabled = false, icon }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4 flex items-center gap-2 group-focus-within:text-[#B23DEB] transition-all">
       {label}
    </label>
    <div className="relative flex items-center">
       <div className="absolute left-7 text-gray-600 group-focus-within:text-[#B23DEB] transition-colors duration-500">
         {icon}
       </div>
       <input 
        type={type} 
        defaultValue={value}
        disabled={disabled}
        className={`w-full pl-16 pr-8 py-5 rounded-[2rem] font-bold transition-all outline-none border ${
          disabled 
          ? "bg-white/[0.01] border-transparent text-gray-700 cursor-not-allowed" 
          : "bg-white/[0.03] border-white/5 text-gray-200 focus:border-[#B23DEB]/50 focus:bg-white/[0.05] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
        }`}
      />
    </div>
  </div>
);

const ProgressItem = ({ label, percent, color }) => (
  <div className="space-y-4">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
      <span className="flex items-center gap-2"><Cpu size={12}/> {label}</span>
      <span className="text-white bg-white/5 px-2 py-0.5 rounded">{percent}</span>
    </div>
    <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden p-1 border border-white/5">
      <div className={`h-full ${color} rounded-full transition-all duration-[2s] ease-out`} style={{ width: percent }}></div>
    </div>
  </div>
);

const ToggleCard = ({ icon, title, desc, active }) => (
  <div className="flex items-center justify-between p-7 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#B23DEB]/40 hover:bg-[#B23DEB]/5 transition-all duration-500 cursor-pointer group">
    <div className="flex items-center gap-6">
      <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div>
        <h4 className="font-black text-gray-200 text-sm mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-[10px] text-gray-600 font-bold leading-tight group-hover:text-gray-400 transition-colors uppercase">{desc}</p>
      </div>
    </div>
    <div className={`w-14 h-8 rounded-full flex items-center px-1.5 transition-all duration-500 ${active ? 'bg-[#B23DEB] shadow-[0_0_15px_#B23DEB]' : 'bg-white/10'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow-2xl transition-all duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export default Settings;