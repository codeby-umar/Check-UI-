import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, deleteDoc, orderBy, limit, getDoc, where, getDocs } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { Trash2, User, Target, ShieldCheck, Zap, Fingerprint, Bell, Award } from 'lucide-react';
import { toast, Toaster } from "react-hot-toast";

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.email === "admin@gmail.com";

  // --- 1. NTFY XABARNOMA YUBORISH (OTA-ONA UCHUN) ---
  const sendNtfyNotification = async (res) => {
    if (!isAdmin) return;

    const loadingToast = toast.loading("Ota-ona ma'lumotlari qidirilmoqda...");

    try {
      const usersRef = collection(db, "users");
      // Eng ishonchli qidiruv: email orqali
      const userQuery = query(usersRef, where("email", "==", res.email || ""));
      const querySnapshot = await getDocs(userQuery);
      
      if (querySnapshot.empty) {
        toast.dismiss(loadingToast);
        toast.error("Ota-ona raqami topilmadi! (Foydalanuvchi bazada yo'q)");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const studentName = userData.name || res.displayUser;
      const phone = userData.phone || "777777777";
      const score = Number(res.score) || 0;
      const parentTopic = phone.replace(/\D/g, ""); // Faqat raqamlarni qoldirish

      let config = {
        title: `Imtihon: ${score}%`,
        tags: "memo",
        priority: "default",
        message: ""
      };

      // Psixologik xabarlar
      if (score >= 90) {
        config = {
          title: `SUYUNCHI: ${studentName} 🎉`,
          tags: "partying_face,star,mortar_board",
          priority: "high",
          message: `Assalomu alaykum! Farzandingiz ${studentName} bugun "${res.testTitle}" testidan ${score}% ball to'plab, guruhda peshqadam bo'ldi! Barakalla! 🚀`
        };
      } else if (score < 60) {
        config = {
          title: `DIQQAT: ${studentName} ⚠️`,
          tags: "warning,disappointed",
          priority: "high",
          message: `Hurmatli ota-ona, farzandingiz ${studentName} "${res.testTitle}" testidan ${score}% ball oldi. Past ko'rsatkich. Iltimos, darslarini birgalikda nazorat qilaylik.`
        };
      } else {
        config.message = `Farzandingiz ${studentName} "${res.testTitle}" testidan ${score}% natija ko'rsatdi. Yomon emas, yana bir oz harakat qilsa, natija yaxshilanadi!`;
      }

      const url = `https://ntfy.sh/${parentTopic}/publish?message=${encodeURIComponent(config.message)}&title=${encodeURIComponent(config.title)}&tags=${config.tags}&priority=${config.priority}`;
      
      await fetch(url);
      toast.dismiss(loadingToast);
      toast.success(`SMS yuborildi: ${studentName}`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Xatolik yuz berdi!");
    }
  };

  // --- 2. NATIJALAR VA ISMLARNI REAL-TIME OLISH ---
  useEffect(() => {
    const q = query(collection(db, "results"), orderBy("score", "desc"), limit(40));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const resultsData = await Promise.all(snapshot.docs.map(async (resultDoc) => {
        const data = resultDoc.data();
        
        // ISMNI "USERS" KOLLIKSIYASIDAN DINAMIK QIDIRISH
        let finalName = data.userName || data.displayUser || data.email?.split('@')[0] || "Noma'lum";

        if (data.email) {
          const userQuery = query(collection(db, "users"), where("email", "==", data.email));
          const userSnap = await getDocs(userQuery);
          if (!userSnap.empty) {
            finalName = userSnap.docs[0].data().name;
          }
        }

        return {
          id: resultDoc.id,
          ...data,
          displayUser: finalName,
        };
      }));

      setResults(resultsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Natijani o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "results", id));
      toast.success("O'chirildi");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#080808] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#B23DEB] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#B23DEB] font-black italic tracking-widest animate-pulse">DATA SYNCHRONIZING...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-3 text-zinc-300 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="relative mb-12 p-8 bg-[#0D0D0D] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Award size={120} className="text-[#B23DEB]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Global <span className="text-[#B23DEB] not-italic">Leaderboard</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <Zap size={12} className="text-yellow-500" /> Tizimdagi eng yuqori ko'rsatkichlar
            </p>
          </div>
          {isAdmin && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-[#B23DEB]/10 border border-[#B23DEB]/20 rounded-full">
              <ShieldCheck size={14} className="text-[#B23DEB]" />
              <span className="text-[#B23DEB] text-[9px] font-black uppercase tracking-widest">Admin Control Active</span>
            </div>
          )}
        </div>

        {/* --- LIST --- */}
        <div className="space-y-4">
          {results.map((res, index) => {
            const score = res.score ?? 0;
            const isTop3 = index < 3;

            return (
              <div 
                key={res.id} 
                className={`group relative flex flex-col md:flex-row items-center justify-between p-4 bg-[#0D0D0D] border transition-all duration-300 rounded-xl ${
                  isTop3 ? 'border-[#B23DEB]/40 shadow-[0_0_30px_rgba(178,61,235,0.05)]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* User Info */}
                <div className="flex items-center gap-6 flex-1 w-full">
                  <div className={`text-3xl font-black italic w-10 ${isTop3 ? 'text-[#B23DEB]' : 'text-zinc-800'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${
                    isTop3 ? 'bg-[#B23DEB]/10 border-[#B23DEB]/20 text-[#B23DEB]' : 'bg-white/5 border-white/10 text-zinc-500'
                  }`}>
                    <User size={28} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#B23DEB] bg-[#B23DEB]/5 px-2 py-0.5 rounded">Student</span>
                      <span className="text-[9px] font-mono text-zinc-600">ID: {res.id.slice(-6)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white italic capitalize truncate tracking-tight">{res.displayUser}</h4>
                  </div>
                </div>

                {/* Test Info */}
                <div className="flex-1 w-full md:px-10 my-4 md:my-0 border-l border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-[#B23DEB]" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 italic truncate">
                        {res.testTitle || "General Quiz"}
                      </span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Fingerprint size={10} className="text-zinc-500" />
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{res.testId?.slice(0, 8) || "NO-ID"}</span>
                      </div>
                   </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className={`text-4xl font-black italic tracking-tighter ${
                      score >= 85 ? 'text-emerald-500' : score >= 60 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {score}%
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => sendNtfyNotification(res)}
                        className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                        title="SMS yuborish"
                      >
                        <Bell size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(res.id)}
                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;