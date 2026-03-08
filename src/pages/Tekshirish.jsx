import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { 
  IoCodeSlash, 
  IoSend, 
  IoTrash, 
  IoTerminal,
  IoCheckmarkCircle,
  IoTimeOutline
} from "react-icons/io5";

const Tekshirish = () => {
  const [taskText, setTaskText] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);
  const [vazifalar, setVazifalar] = useState([]);
  
  const user = auth.currentUser;
  const isAdmin = user?.email === "admin@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "vazifalar"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setVazifalar(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

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
      alert("Kod qabul qilindi!");
    } catch (error) {
      alert("Xatolik!");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteVazifa = async (id) => {
    if(window.confirm("O'chirilsinmi?")) {
      await deleteDoc(doc(db, "vazifalar", id));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-zinc-300 font-sans selection:bg-[#B23DEB]/30">
      
      {/* --- NAV BAR --- */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B23DEB] to-[#7928CA] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(178,61,235,0.3)]">
            <IoTerminal className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase italic">
              {isAdmin ? "Admin" : "Student"} <span className="text-[#B23DEB] not-italic underline decoration-2 underline-offset-4"></span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Status</p>
            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-tighter">System Online</p>
          </div>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <p className="text-[10px] font-medium text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {user?.email?.split('@')[0]}
          </p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!isAdmin ? (
          /* --- STUDENT UI --- */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase italic">Kodni <span className="text-[#B23DEB]">Yuborish</span></h2>
              <p className="text-zinc-500 text-sm">Vazifangizni pastdagi terminalga kiriting va tasdiqlang.</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B23DEB] to-transparent rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 ml-4 uppercase tracking-widest">code.py</p>
                </div>
                <textarea 
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="// Bu yerga kodingizni yozing..."
                  className="w-full h-[400px] bg-transparent p-8 text-sm font-mono text-emerald-400/90 outline-none resize-none placeholder:text-zinc-800"
                />
              </div>
            </div>

            <button 
              onClick={submitVazifa}
              disabled={isUploading || !taskText.trim()}
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-black text-white bg-[#B23DEB] rounded-xl overflow-hidden transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <IoSend className="mr-3 text-lg" />
              <span className="uppercase tracking-[0.2em] text-xs">Vazifani topshirish</span>
            </button>
          </div>
        ) : (
          /* --- ADMIN UI --- */
          <div className="space-y-10">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black text-white uppercase italic">Inbox <span className="text-[#B23DEB] font-normal not-italic opacity-50">/</span> {vazifalar.length}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {vazifalar.map((v) => (
                <div key={v.id} className="bg-[#0D0D0D] border border-white/5 rounded-sm overflow-hidden hover:border-[#B23DEB]/40 transition-all group shadow-xl">
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#B23DEB]/10 flex items-center justify-center text-[#B23DEB]">
                        <IoCodeSlash size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-300">{v.userEmail}</p>
                        <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
                          <IoTimeOutline />
                          {v.timestamp?.toDate().toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteVazifa(v.id)}
                      className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <IoTrash size={18} />
                    </button>
                  </div>

                  {/* Code Body */}
                  <div className="p-6">
                    <pre className="bg-black/50 p-6 rounded-xl border border-white/5 overflow-x-auto text-[13px] font-mono text-blue-400/90 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
                      {v.content}
                    </pre>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex gap-3">
                    <button className="flex-1 py-3 bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <IoCheckmarkCircle size={14}/> Tasdiqlash
                    </button>
                    <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Rad etish
                    </button>
                  </div>
                </div>
              ))}
              
              {vazifalar.length === 0 && (
                <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Hozircha vazifalar yo'q</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tekshirish;