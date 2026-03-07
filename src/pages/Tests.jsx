import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { 
  IoTrashOutline, 
  IoPlayCircle, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoTimeOutline 
} from "react-icons/io5";
import { FiBookOpen } from "react-icons/fi";

const Tests = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@gmail.com"; 
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "tests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTests(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  const toggleTestStatus = async (e, testId, currentStatus) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "tests", testId), {
        isActive: !currentStatus
      });
    } catch (err) {
      alert("Xatolik yuz berdi: " + err.message);
    }
  };

  const handleDelete = async (e, testId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Haqiqatdan ham ushbu testni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!",
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "tests", testId));
      } catch (err) {
        alert("O'chirishda xatolik: " + err.message);
      }
    }
  };

  const handleStartTest = (test) => {
    if (isAdmin || test.isActive) {
      navigate(`/quiz/${test.id}`);
    } else {
      alert("Kechirasiz, ushbu test hozirda yopiq. Admin ruxsatini kuting.");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen custom-scrollbar overflow-y-auto">
      {/* Header Qismi */}
      <div className="flex justify-between px-7 items-end mb-12 max-w-7xl mx-auto border-b border-white/5 pb-8 pt-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            Mavjud <span className="text-[#B23DEB]">Testlar</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Bilimingizni sinash uchun eng so'nggi topshiriqlar va vaqtli testlar</p>
        </div>
        {/* Bu yerda tugma bor edi, olib tashlandi */}
      </div>

      <div className="gap-8 flex items-center justify-center flex-wrap pb-20 px-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test.id}
              className={`group relative h-92.5 w-80 bg-white/2 border border-white/5 p-5 transition-all duration-500 hover:border-[#B23DEB]/40 hover:bg-white/[0.04] rounded-2xl overflow-hidden ${!test.isActive && !isAdmin ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="relative w-full h-44 mb-6 rounded-xl overflow-hidden bg-[#050505]">
                <img
                  src={test.imageUrl || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={test.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                
                {!test.isActive && (
                  <div className="absolute top-3 left-3 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Yopiq
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#B23DEB]/10 text-[#B23DEB] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-[#B23DEB]/20">
                    {test.subject}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      <FiBookOpen size={13} className="text-[#B23DEB]"/> {test.questionsCount || 15}
                    </span>
                    <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      <IoTimeOutline size={13} className="text-[#B23DEB]"/> {test.duration || 20} min
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-[#B23DEB] transition-colors line-clamp-1">
                  {test.title}
                </h3>
                
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-medium">
                  {test.description || "Ushbu test orqali o'z mahoratingizni yangi bosqichga olib chiqing va natijalaringizni tahlil qiling."}
                </p>
              </div>

              {/* Hover Overlay: Start Button */}
              <div
                onClick={() => handleStartTest(test)}
                className={`absolute inset-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center z-10 cursor-pointer 
                  ${test.isActive || isAdmin ? 'bg-[#B23DEB]/80' : 'bg-gray-900/90'}`}
              >
                <div className="p-4 bg-white/20 rounded-full mb-4 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                  {test.isActive || isAdmin ? (
                    <IoPlayCircle size={50} className="text-white" />
                  ) : (
                    <IoLockClosedOutline size={30} className="text-white" />
                  )}
                </div>
                <span className="text-white font-black text-xl tracking-[0.3em] uppercase">
                  {test.isActive || isAdmin ? "Boshlash" : "Yopilgan"}
                </span>
              </div>

              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => toggleTestStatus(e, test.id, test.isActive)}
                    className={`p-2.5 rounded-full text-white shadow-xl transition-all hover:scale-110 ${test.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    title={test.isActive ? "Testni yopish" : "Testni ochish"}
                  >
                    {test.isActive ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(e, test.id)}
                    className="bg-red-500 hover:bg-red-600 p-2.5 rounded-full text-white shadow-xl transition-all hover:scale-110"
                    title="O'chirish"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-600 mb-4 flex justify-center"><FiBookOpen size={50}/></div>
            <p className="text-gray-400 text-lg">Hozircha hech qanday test mavjud emas.</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Tests;