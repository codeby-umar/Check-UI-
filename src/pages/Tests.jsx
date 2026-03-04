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
} from "firebase/firestore";
import { IoTrashOutline, IoPlayCircle } from "react-icons/io5";
import { FiPlus, FiBookOpen } from "react-icons/fi";
import AddTestModal from "../components/AddTestModal";

const Tests = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@gmail.com";
  const [tests, setTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "tests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTests(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (e, testId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Haqiqatdan ham ushbu testni o'chirmoqchimisiz?",
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "tests", testId));
      } catch (err) {
        alert("Xatolik: " + err.message);
      }
    }
  };

  return (
    <div className="bg-[#0a0a0a] h-full py-10  ">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12 max-w-7xl mx-auto border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Mavjud <span className="text-[#B23DEB]">Testlar</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Bilimingizni sinash uchun eng so'nggi topshiriqlar</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 bg-[#B23DEB] text-white px-8 py-4 rounded-2xl font-black shadow-[0_10px_30px_rgba(178,61,235,0.3)] hover:scale-105 transition-all active:scale-95"
          >
            <FiPlus size={20} />
            YANGI TEST
          </button>
        )}
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto pb-20">
        {tests.map((test) => (
          <div
            key={test.id}
            className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 transition-all duration-500 hover:border-[#B23DEB]/30 hover:bg-white/[0.04] overflow-hidden"
          >
            {/* Test Image Container */}
            <div className="relative w-full h-48 mb-6 rounded-[2rem] overflow-hidden bg-[#050505]">
              <img
                src={test.imageUrl}
                alt={test.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#B23DEB]/10 text-[#B23DEB] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-[#B23DEB]/20">
                  {test.subject}
                </span>
                <span className="text-[10px] text-gray-600 font-bold flex items-center gap-1">
                  <FiBookOpen size={12}/> 15 Savol
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-[#B23DEB] transition-colors line-clamp-1 leading-tight">
                {test.title}
              </h3>
              
              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-medium">
                {test.description || "Ushbu test orqali o'z mahoratingizni yangi bosqichga olib chiqing."}
              </p>
            </div>

            {/* Hover Overlay - Start Test */}
            <div
              onClick={() => navigate(`/quiz/${test.id}`)}
              className="absolute inset-0 bg-[#B23DEB]/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center z-10 cursor-pointer"
            >
              <div className="p-4 bg-white/20 rounded-full mb-4 animate-bounce">
                <IoPlayCircle size={50} className="text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-[0.2em]">BOSHLASH</span>
            </div>

            {/* Admin Delete Action */}
            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, test.id)}
                className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              >
                <IoTrashOutline size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <AddTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Tests;