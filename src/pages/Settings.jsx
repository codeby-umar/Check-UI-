import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Firebase ulanishi
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Camera, Save, ShieldCheck, Zap, BellRing, Crown, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [adminData, setAdminData] = useState({
    name: "Yuklanmoqda...",
    email: "",
    role: "Bosh Admin",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=Admin", // Admin uchun professionalroq abstrakt rasm
  });

  // Firebase'dan admin ma'lumotlarini olish
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
    <div className="px-10">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className=" p-8 rounded-lg  shadow-2xl text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="relative w-36 h-36 mx-auto mb-6 mt-4">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl shadow-indigo-200">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img 
                    src={adminData.image} 
                    className="w-full h-full rounded-full object-cover"
                    alt="admin-avatar"
                  />
                </div>
              </div>
              <label className="absolute bottom-1 right-1 p-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-indigo-600 transition-all cursor-pointer border-4 border-white">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{adminData.name}</h2>
                <Crown size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-6">{adminData.role}</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">ID:</span>
                  <span className="text-xs font-mono font-bold text-slate-600 uppercase">#adm_777</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-lg text-white shadow-2xl shadow-slate-300">
            <h3 className="font-bold mb-6 flex items-center gap-3">
              <SettingsIcon size={20} className="text-indigo-400" /> Tizim holati
            </h3>
            <div className="space-y-6">
              <ProgressItem label="Xotira" percent="42%" color="bg-indigo-400" />
              <ProgressItem label="Xavfsizlik" percent="100%" color="bg-emerald-400" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white p-8 md:p-10 rounded-lg  shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Boshqaruvi</h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">Shaxsiy va tizim sozlamalarini tahrirlash</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Zap size={24} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminInput label="Admin Ismi" value={adminData.name} />
              <AdminInput label="Email Manzili" value={auth.currentUser?.email || "admin@test.uz"} />
              <AdminInput label="Maxfiy Kod" value="**********" type="password" />
              <AdminInput label="Kirish Huquqi" value="To'liq (Root)" disabled />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToggleCard 
                icon={<BellRing className="text-orange-500" />} 
                title="Tizim Bildirishnomalari" 
                desc="Har bir yangi foydalanuvchi uchun xabar olish"
                active={true}
              />
              <ToggleCard 
                icon={<ShieldCheck className="text-indigo-500" />} 
                title="Super-Xavfsizlik" 
                desc="Har bir kirishda IP-manzilni tekshirish"
                active={true}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4">
            <button className="text-slate-400 font-bold hover:text-slate-600 px-6 transition-all">
              Barchasini tiklash
            </button>
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3">
              <Save size={20} /> O'zgarishlarni Saqlash
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Custom Components for Admin ---

const AdminInput = ({ label, value, type = "text", disabled = false }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1 group-focus-within:text-indigo-500 transition-colors">
      {label}
    </label>
    <input 
      type={type} 
      defaultValue={value}
      disabled={disabled}
      className={`w-full px-6 py-4 rounded-lg font-bold transition-all outline-none border-2 ${
        disabled 
        ? "bg-slate-50 border-transparent text-slate-400 cursor-not-allowed" 
        : "bg-white border-slate-100 text-slate-800 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-50/50"
      }`}
    />
  </div>
);

const ProgressItem = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
      <span>{label}</span>
      <span className="text-white">{percent}</span>
    </div>
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: percent }}></div>
    </div>
  </div>
);

const ToggleCard = ({ icon, title, desc, active }) => (
  <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-all">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{title}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <div className={`w-11 h-6 rounded-lg flex items-center px-1 transition-all ${active ? 'bg-indigo-500' : 'bg-slate-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-lg  transition-all ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export default Settings;