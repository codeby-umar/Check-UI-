import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc, where, getDocs } from "firebase/firestore";
import { 
  IoCodeSlash, IoSend, IoTrash, IoTerminal, IoCheckmarkCircle, IoTimeOutline
} from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";

const Tekshirish = () => {
  const [taskText, setTaskText] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);
  const [vazifalar, setVazifalar] = useState([]);
  
  const user = auth.currentUser;
  const isAdmin = user?.email === "admin@gmail.com";

  // --- 1. ADMIN UCHUN VAZIFALARNI OLIYASH ---
  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "vazifalar"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setVazifalar(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  // --- 2. OTA-ONAGA TASDIQLASH XABARINI YUBORISH ---
  const sendApprovalNotification = async (vazifa) => {
    try {
      // Foydalanuvchi ma'lumotlarini bazadan qidiramiz (Email orqali)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", vazifa.userEmail));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return;

      const userData = querySnapshot.docs[0].data();
      const studentName = userData.name || "O'quvchi";
      const phone = userData.phone || "777777777";
      const parentTopic = phone.replace(/\D/g, "");

      const title = `VAZIFA TASDIQLANDI ✅`;
      const message = `Assalomu alaykum! \n\nFarzandingiz ${studentName} bugungi uy vazifasini muvaffaqiyatli topshirdi va o'qituvchi tomonidan tasdiqlandi. \n\nBilim olishdan charchamasin, qo'llab-quvvatlayotganingiz uchun rahmat! ✨`;
      const img = "https://static.vecteezy.com/system/resources/thumbnails/014/484/853/small/school-student-passing-exam-in-classroom-free-vector.jpg";

      const url = `https://ntfy.sh/${parentTopic}/publish?message=${encodeURIComponent(message)}&title=${encodeURIComponent(title)}&tags=white_check_mark,partying_face&priority=high&attach=${encodeURIComponent(img)}`;
      
      await fetch(url);
      toast.success("Ota-onaga xushxabar yuborildi! 📱");
    } catch (error) {
      console.error("Xabarnoma yuborishda xato:", error);
    }
  };

  // --- 3. VAZIFANI TOPSHIRISH ---
  const submitVazifa = async () => {
    if (!taskText.trim()) return;
    setIsUploading(true);
    try {
      await addDoc(collection(db, "vazifalar"), {
        content: taskText, 
        status: "Kutilmoqda",
        timestamp: new Date(),
        userEmail: user?.email || "Anonim"
      });
      setTaskText("");
      toast.success("Kod qabul qilindi! ✨");
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteVazifa = async (id) => {
    if(window.confirm("O'chirilsinmi?")) {
      await deleteDoc(doc(db, "vazifalar", id));
      toast.success("O'chirildi");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-zinc-300 font-sans selection:bg-[#B23DEB]/30">
      <Toaster position="bottom-right" />
      
      {/* --- NAV BAR --- */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B23DEB] to-[#7928CA] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(178,61,235,0.3)]">
            <IoTerminal className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase italic">
              {isAdmin ? "Admin" : "Student"} <span className="text-[#B23DEB] not-italic underline decoration-2 underline-offset-4">Portal</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Access Level</p>
            <p className="text-[11px] font-bold text-[#B23DEB] uppercase tracking-tighter italic">Verified Session</p>
          </div>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <p className="text-[10px] font-medium text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {user?.email}
          </p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!isAdmin ? (
          /* --- STUDENT UI --- */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase italic">Kodni <span className="text-[#B23DEB]">Yuborish</span></h2>
              <p className="text-zinc-500 text-sm">Topshiriq kodingizni kiriting.</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B23DEB] to-transparent rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <textarea 
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="// Kodingizni shu yerga paste qiling..."
                  className="w-full h-[350px] bg-transparent p-8 text-sm font-mono text-emerald-400/90 outline-none resize-none placeholder:text-zinc-800"
                />
              </div>
            </div>

            <button 
              onClick={submitVazifa}
              disabled={isUploading || !taskText.trim()}
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-black text-white bg-[#B23DEB] rounded-xl overflow-hidden transition-all hover:scale-[1.01] active:scale-95"
            >
              <IoSend className="mr-3" />
              <span className="uppercase tracking-widest text-xs">Vazifani yuborish</span>
            </button>
          </div>
        ) : (
          /* --- ADMIN UI --- */
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-white uppercase italic">Kelib tushgan <span className="text-[#B23DEB]">vazifalar</span></h2>

            <div className="grid grid-cols-1 gap-6">
              {vazifalar.map((v) => (
                <div key={v.id} className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden hover:border-[#B23DEB]/40 transition-all">
                  <div className="px-6 py-4 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#B23DEB]/10 flex items-center justify-center text-[#B23DEB]">
                        <IoCodeSlash size={14} />
                      </div>
                      <p className="text-xs font-black text-zinc-300">{v.userEmail}</p>
                    </div>
                    <button onClick={() => deleteVazifa(v.id)} className="text-zinc-600 hover:text-red-500"><IoTrash size={18} /></button>
                  </div>

                  <div className="p-6">
                    <pre className="bg-black/40 p-5 rounded-xl border border-white/5 text-[13px] font-mono text-blue-300">
                      {v.content}
                    </pre>
                  </div>

                  <div className="px-6 py-4 flex gap-3">
                    <button 
                      onClick={() => sendApprovalNotification(v)}
                      className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <IoCheckmarkCircle size={14}/> Tasdiqlash va SMS yuborish
                    </button>
                    <button className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Rad etish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tekshirish;