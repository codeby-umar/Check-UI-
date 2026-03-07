import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, deleteDoc, orderBy, limit, getDoc } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { Trash2, User, BarChart3, Target, ShieldCheck, Zap, BookOpen, Fingerprint } from 'lucide-react';

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.email === "admin@gmail.com";

  useEffect(() => {
    const q = query(
      collection(db, "results"), 
      orderBy("score", "desc"), 
      limit(100)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const resultsData = await Promise.all(snapshot.docs.map(async (resultDoc) => {
        const data = resultDoc.data();
        
        // --- TEST VA MUALLIF MA'LUMOTLARINI ID ORQALI OLISH ---
        let testAuthor = "Noma'lum Muallif";
        let testTitle = data.testTitle || "Noma'lum Test";

        if (data.testId) {
            try {
                const testRef = doc(db, "tests", data.testId);
                const testSnap = await getDoc(testRef);
                if (testSnap.exists()) {
                    const testData = testSnap.data();
                    testAuthor = testData.author || testData.creatorEmail || "Muallif topilmadi";
                    testTitle = testData.title || testTitle; 
                }
            } catch (err) {
                console.log("ID bo'yicha testni olishda xato:", err);
            }
        }

        // Foydalanuvchi ismini aniqlash
        let finalName = data.author || data.userName || (data.email ? data.email.split('@')[0] : "Noma'lum");

        return {
          id: resultDoc.id, // Natijaning o'z IDsi
          ...data,
          displayUser: finalName,
          testCreator: testAuthor,
          testId: data.testId // Testning IDsi
        };
      }));

      setResults(resultsData);
      setLoading(false);
    }, (error) => {
      console.error("Xatolik:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Ushbu natijani o'chirib yubormoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, "results", id));
      } catch (err) {
        alert("O'chirishda xatolik!");
      }
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center font-black text-[#B23DEB] animate-pulse italic text-2xl">
       MA'LUMOTLAR YUKLANMOQDA...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-10 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] p-8 rounded-sm border border-white/5 shadow-2xl">
          <div>
            <h2 className="text-3xl font-bold uppercase italic tracking-tighter flex items-center gap-3">
              Natijalar <span className="text-[#B23DEB]">ID Nazorati</span>
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase mt-1 tracking-[0.3em] italic opacity-60">
               Tizimdagi barcha natijalar va ID raqamlar
            </p>
          </div>
          {isAdmin && (
             <div className="mt-4 md:mt-0 bg-red-500/10 border border-red-500/20 px-6 py-2 rounded-2xl flex items-center gap-2">
                <ShieldCheck size={18} className="text-red-500" />
                <span className="text-red-500 text-[10px] font-black uppercase italic tracking-widest">Administrator</span>
             </div>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((res, index) => {
            const score = res.score ?? 0;
            const isTop3 = index < 3;

            return (
              <div 
                key={res.id} 
                className={`relative overflow-hidden bg-white/1 border p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white/[0.03] ${
                  isTop3 ? 'border-[#B23DEB]/40 bg-[#B23DEB]/1' : 'border-white/5'
                }`}
              >
                {/* 1. O'quvchi ma'lumoti */}
                <div className="flex items-center gap-6 flex-1 w-full">
                  <div className={`text-2xl font-black italic w-10 ${isTop3 ? 'text-[#B23DEB]' : 'text-gray-800'}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <User className={isTop3 ? 'text-[#B23DEB]' : 'text-gray-600'} size={24} />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                       <p className="text-[9px] text-[#B23DEB] font-black uppercase tracking-widest">O'quvchi</p>
                       <span className="text-[8px] text-gray-600 font-mono">ID: {res.id.slice(0, 6)}...</span>
                    </div>
                    <h4 className="text-xl font-black text-white italic capitalize truncate tracking-tight">
                      {res.displayUser}
                    </h4>
                  </div>
                </div>

                {/* 2. Test va ID ma'lumoti */}
                <div className="flex-1 w-full md:px-10 border-l border-r border-white/5">
                   <div className="flex items-center gap-2 text-gray-400">
                      <Target size={14} className="text-[#B23DEB]" />
                      <span className="text-[11px] font-black uppercase tracking-widest italic truncate">
                        {res.testTitle || "Noma'lum Test"}
                      </span>
                   </div>
                   
                   <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen size={10} className="text-gray-600" />
                        <p className="text-[9px] text-gray-500 font-bold uppercase">
                          Muallif: <span className="text-gray-300">{res.testCreator}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fingerprint size={10} className="text-gray-600" />
                        <p className="text-[9px] text-gray-500 font-bold uppercase">
                          Test ID: <span className="text-[#B23DEB] font-mono">{res.testId || "N/A"}</span>
                        </p>
                      </div>
                   </div>
                </div>

                {/* 3. Ball va O'chirish */}
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className={`text-4xl font-black italic ${score >= 70 ? 'text-green-500' : (score >= 40 ? 'text-orange-500' : 'text-red-500')}`}>
                      {score}%
                    </p>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1 text-center">Score</p>
                  </div>

                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(res.id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90"
                      title="Natijani o'chirish"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                {/* Background Decoration */}
                {isTop3 && (
                  <div className="absolute -right-2 -top-2 opacity-5 rotate-12 pointer-events-none">
                     <Zap size={80} className="fill-[#B23DEB]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;