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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          All Tests
        </h1>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#B23DEB] text-white px-8 py-3 rounded-sm  font-bold shadow-lg shadow-purple-200 hover:bg-[#9a32cc] transition-all"
          >
            Add Test
          </button>
        )}
      </div>

      <div className=" flex items-center flex-wrap gap-10 max-w-7xl mx-auto">
        {tests.map((test) => (
          <div
            key={test.id}
            className="group relative w-74.5 h-80 bg-white rounded-xl shadow-sm  border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-full h-50 mb-2 rounded-2xl  flex items-center justify-center p-3">
                <img
                  src={test.imageUrl}
                  alt="logo"
                  className="w-full rounded-xl h-full object-contain"
                />
              </div>

              <div className="bg-purple-100 text-[#B23DEB] text-[10px] px-3 py-1 rounded-full font-bold mb-2">
                {test.subject}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                {test.title}
              </h3>
              <p className="text-gray-400 text-[11px] line-clamp-2 leading-relaxed">
                {test.description ||
                  "Ushbu test orqali bilimingizni sinab ko'ring."}
              </p>
            </div>

            <div
              key={test.id}
              onClick={() => navigate(`/quiz/${test.id}`)}
              className="absolute inset-0 bg-[#B23DEB]/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-10"
            >
              <IoPlayCircle
                size={60}
                className="text-white mb-2 animate-pulse"
              />
              <span className="text-white font-black text-lg tracking-wider">
                START TEST
              </span>
            </div>

            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, test.id)}
                className="absolute top-4 right-4 text-white hover:text-red-200 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoTrashOutline size={22} />
              </button>
            )}
          </div>
        ))}
      </div>

      <AddTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Tests;
