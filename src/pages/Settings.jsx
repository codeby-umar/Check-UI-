import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { 
  Camera, Save, ShieldCheck, Zap, BellRing, Crown, Settings as SettingsIcon,
  RefreshCw, Fingerprint, Activity, Mail, Lock, ShieldAlert, Cpu, ChevronDown, Check
} from "lucide-react";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Yuklanmoqda...",
    email: "",
    role: "Bosh Admin",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#050505] text-gray-300 p-4 md:p-10 custom-scrollbar selection:bg-[#B23DEB]/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        
        {/* Left Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] text-center backdrop-blur-3xl relative group transition-all hover:border-[#B23DEB]/20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#B23DEB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="w-full h-full rounded-[2.5rem] p-1 bg-gradient-to-tr from-[#B23DEB] to-fuchsia-500 shadow-2xl group-hover:rotate-3 transition-transform duration-500">
                <img src={adminData.image} className="w-full h-full rounded-[2.3rem] object-cover bg-[#0a0a0a]" alt="avatar" />
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-[#B23DEB] text-white rounded-xl cursor-pointer hover:scale-110 active:scale-90 transition-all shadow-lg shadow-[#B23DEB]/40">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{adminData.name}</h2>
                <Crown size={18} className="text-yellow-500" />
              </div>
              <span className="text-[10px] font-black text-[#B23DEB] uppercase tracking-[0.3em] bg-[#B23DEB]/10 px-3 py-1 rounded-full border border-[#B23DEB]/20">
                {adminData.role}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Activity size={14} className="text-[#B23DEB]" /> Tizim Holati
            </h3>
            <ProgressItem label="Server Yuklamasi" percent="24%" color="bg-[#B23DEB]" />
            <ProgressItem label="Xavfsizlik" percent="100%" color="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.03] border border-white/5 p-8 md:p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  System <span className="text-[#B23DEB]">Config</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500"/> Xavfsiz kanal orqali ulanish
                </p>
              </div>
              <div className="w-12 h-12 bg-[#B23DEB]/10 rounded-2xl flex items-center justify-center text-[#B23DEB]">
                <SettingsIcon size={24} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <AdminInput label="To'liq ism" value={adminData.name} icon={<Zap size={16} />} />
              <AdminInput label="Email Manzil" value={auth.currentUser?.email || "admin@cloud.uz"} icon={<Mail size={16} />} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 tracking-widest">Kirish Huquqi</label>
                <div className="relative">
                  <select className="w-full bg-white/[0.05] border border-white/5 text-sm font-bold p-4 rounded-2xl outline-none appearance-none focus:border-[#B23DEB]/40 transition-all">
                    <option className="bg-[#111]">ROOT ACCESS</option>
                    <option className="bg-[#111]">MODERATOR</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
              <AdminInput label="Xavfsizlik Kaliti" value="********" type="password" icon={<Lock size={16} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <ToggleCard 
                icon={<BellRing size={20} />} 
                title="Notifications" 
                active={notifications} 
                onClick={() => setNotifications(!notifications)}
                color="text-orange-400"
              />
              <ToggleCard 
                icon={<Fingerprint size={20} />} 
                title="Biometrics" 
                active={biometric} 
                onClick={() => setBiometric(!biometric)}
                color="text-cyan-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all group">
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Reset
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-[#B23DEB] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#B23DEB]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Save size={18} /> Saqlash
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

const AdminInput = ({ label, value, type = "text", icon }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 tracking-widest group-focus-within:text-[#B23DEB] transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#B23DEB] transition-colors">{icon}</div>
      <input type={type} defaultValue={value} className="w-full bg-white/[0.05] border border-white/5 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none focus:border-[#B23DEB]/40 focus:bg-white/[0.08] transition-all" />
    </div>
  </div>
);

const ProgressItem = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-gray-500">
      <span>{label}</span>
      <span className="text-white">{percent}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: percent }}></div>
    </div>
  </div>
);

const ToggleCard = ({ icon, title, active, onClick, color }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
      active ? 'bg-[#B23DEB]/5 border-[#B23DEB]/30' : 'bg-white/[0.02] border-white/5'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`${active ? color : 'text-gray-500'} transition-colors`}>{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wide text-gray-300">{title}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#B23DEB]' : 'bg-white/10'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);

export default Settings;