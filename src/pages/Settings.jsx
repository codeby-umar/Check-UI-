import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { updatePassword } from "firebase/auth";
import { 
  Camera, Save, ShieldCheck, Zap, BellRing, Crown, Settings as SettingsIcon,
  RefreshCw, Fingerprint, Activity, Mail, Lock, Phone, Calendar, ChevronDown, Loader2
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  // 1. STATE-GA NEW FIELDS QO'SHILDI
  const [adminData, setAdminData] = useState({
    name: "",
    phone: "", // Yangi
    age: "",   // Yangi
    role: "Bosh Admin",
    image: "https://as2.ftcdn.net/jpg/01/12/09/17/1000_F_112091769_vWEmDiwVIpO4H1plGuhYgnmduTuiGUh2.jpg",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (auth.currentUser) {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAdminData(prev => ({ ...prev, ...data }));
            setNotifications(data.notifications ?? true);
            setBiometric(data.biometric ?? false);
          }
        }
      } catch (error) {
        console.error("Yuklashda xatolik:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Rasm hajmi juda katta (Max 1MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!adminData.name.trim()) {
      toast.error("Ismni kiritish majburiy!");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Tizimga kirilmagan!");

      const docRef = doc(db, "users", user.uid);
      // 2. FIRESTORE-GA SAQLASH QISMI YANGILANDI
      await setDoc(docRef, {
        name: adminData.name,
        phone: adminData.phone, // Yangi
        age: adminData.age,     // Yangi
        role: adminData.role,
        image: adminData.image,
        notifications: notifications,
        biometric: biometric,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (newPassword.trim() !== "") {
        if (newPassword.length < 6) {
          toast.error("Parol kamida 6 ta belgi bo'lishi shart!");
        } else {
          await updatePassword(user, newPassword);
          setNewPassword("");
          toast.success("Parol ham yangilandi!");
        }
      }

      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi!");
    } catch (error) {
      console.error("Saqlash xatosi:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Xavfsizlik uchun qayta tizimga kirishingiz kerak!");
      } else {
        toast.error("Xatolik: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-[#B23DEB]">
        <RefreshCw className="animate-spin" size={40} />
        <span className="text-xs font-bold tracking-widest uppercase">Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#050505] text-gray-300 p-4 md:p-10 custom-scrollbar">
      <Toaster position="top-right" />
      
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 max-w-7xl">
        
        {/* Left Side: Profile Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/3 border border-white/5 p-8 text-center backdrop-blur-3xl relative group rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-[#B23DEB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="w-full h-full rounded-[2.5rem] p-1 bg-gradient-to-tr from-[#B23DEB] to-fuchsia-500 transition-transform duration-500 overflow-hidden">
                <img src={adminData.image} className="w-full h-full rounded-[2.3rem] object-cover bg-[#0a0a0a]" alt="avatar" />
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-[#B23DEB] text-white rounded-xl cursor-pointer hover:scale-110 active:scale-90 transition-all shadow-lg shadow-[#B23DEB]/40">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="relative">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">{adminData.name || "Ism..."}</h2>
              <div className="flex flex-col gap-1 items-center">
                 <span className="text-[10px] font-black text-[#B23DEB] uppercase tracking-[0.3em] bg-[#B23DEB]/10 px-3 py-1 rounded-full border border-[#B23DEB]/20">
                  {adminData.role}
                 </span>
                 {adminData.phone && <span className="text-[10px] text-gray-500 font-mono mt-2">{adminData.phone}</span>}
              </div>
            </div>
          </div>

          <div className="bg-white/3 border border-white/5 p-6 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Activity size={14} className="text-[#B23DEB]" /> Holat
            </h3>
            <ProgressItem label="To'liqlik" percent={(adminData.name && adminData.phone && adminData.age) ? "100%" : "65%"} color="bg-[#B23DEB]" />
            <ProgressItem label="Xavfsizlik" percent="100%" color="bg-emerald-500" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/3 border border-white/5 p-8 md:p-10 backdrop-blur-3xl shadow-2xl rounded-3xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">System <span className="text-[#B23DEB]">Config</span></h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Shaxsiy ma'lumotlarni boshqarish</p>
              </div>
              <div className="w-12 h-12 bg-[#B23DEB]/10 rounded-2xl flex items-center justify-center text-[#B23DEB]">
                <SettingsIcon size={24} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Name */}
              <InputGroup 
                label="To'liq ism" 
                icon={<Zap size={16} />} 
                value={adminData.name} 
                onChange={(val) => setAdminData({...adminData, name: val})} 
              />

              {/* Telefon Raqami - YANGI */}
              <InputGroup 
                label="Telefon Raqami" 
                icon={<Phone size={16} />} 
                placeholder="+998 90 123 45 67"
                value={adminData.phone} 
                onChange={(val) => setAdminData({...adminData, phone: val})} 
              />

              {/* Yoshi - YANGI */}
              <InputGroup 
                label="Yoshingiz" 
                icon={<Calendar size={16} />} 
                type="number"
                placeholder="Masalan: 22"
                value={adminData.age} 
                onChange={(val) => setAdminData({...adminData, age: val})} 
              />

              <AdminInput label="Email" value={auth.currentUser?.email || ""} icon={<Mail size={16} />} disabled={true} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 tracking-widest">Lavozim</label>
                <div className="relative">
                  <select 
                    value={adminData.role}
                    onChange={(e) => setAdminData({...adminData, role: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/5 text-sm font-bold p-4 rounded-2xl outline-none appearance-none focus:border-[#B23DEB]/40 transition-all"
                  >
                    <option className="bg-[#111]" value="Bosh Admin">BOSH ADMIN</option>
                    <option className="bg-[#111]" value="Foydalanuvchi">FOYDALANUVCHI</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              <InputGroup 
                label="Yangi Parol" 
                icon={<Lock size={16} />} 
                type="password" 
                placeholder="O'zgartirish uchun yozing"
                value={newPassword} 
                onChange={(val) => setNewPassword(val)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <ToggleCard icon={<BellRing size={20} />} title="Xabarnoma" active={notifications} onClick={() => setNotifications(!notifications)} color="text-orange-400" />
              <ToggleCard icon={<Fingerprint size={20} />} title="Biometrika" active={biometric} onClick={() => setBiometric(!biometric)} color="text-cyan-400" />
            </div>
          </div>

          <div className="flex justify-end gap-6">
            <button onClick={handleSave} disabled={loading} className="w-full sm:w-auto px-10 py-4 bg-[#B23DEB] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Yordamchi Componentlar
const InputGroup = ({ label, icon, value, onChange, type = "text", placeholder = "" }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 tracking-widest group-focus-within:text-[#B23DEB] transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#B23DEB] transition-colors">{icon}</div>
      <input 
        type={type} 
        value={value} 
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none focus:border-[#B23DEB]/40 focus:bg-white/[0.08] transition-all placeholder:text-gray-700" 
      />
    </div>
  </div>
);

const AdminInput = ({ label, value, icon, disabled }) => (
  <div className="space-y-2 group opacity-50">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-4 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-4 text-gray-500">{icon}</div>
      <input type="text" value={value} disabled={disabled} className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none cursor-not-allowed" />
    </div>
  </div>
);

const ProgressItem = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500">
      <span>{label}</span>
      <span className="text-white">{percent}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: percent }}></div>
    </div>
  </div>
);

const ToggleCard = ({ icon, title, active, onClick, color }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-[#B23DEB]/5 border-[#B23DEB]/30' : 'bg-white/2 border-white/5'}`}>
    <div className="flex items-center gap-4">
      <div className={`${active ? color : 'text-gray-500'}`}>{icon}</div>
      <span className="text-xs font-bold uppercase text-gray-300">{title}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-[#B23DEB]' : 'bg-white/10'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);

export default Settings;