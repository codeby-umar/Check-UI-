import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Search, BookOpen, Clock, Star, PlayCircle } from "lucide-react"; 
import { FiFilter } from "react-icons/fi";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    };
    fetchCourses();
  }, []);

  const categories = ["All", "Math", "English", "programming", "Physics"];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "All" || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-8 md:p-12 custom-scrollbar">
      {/* 1. Header & Search Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Bizning <span className="text-[#B23DEB] drop-shadow-[0_0_15px_rgba(178,61,235,0.4)]">Kurslar</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">Bilimingizni oshirish uchun eng yaxshi kontentlar to'plami.</p>
          </div>

          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-0 bg-[#B23DEB]/5 rounded-2xl blur-xl group-focus-within:bg-[#B23DEB]/15 transition-all"></div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#B23DEB] w-5 h-5 transition-colors" />
            <input
              type="text"
              placeholder="Kurslarni izlash..."
              className="relative w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-gray-600 outline-none focus:border-[#B23DEB]/50 focus:ring-4 focus:ring-[#B23DEB]/5 transition-all backdrop-blur-md"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Categories Filter */}
        <div className="flex items-center gap-4 mt-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[#B23DEB]">
            <FiFilter size={20} />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap border ${
                filter === cat 
                ? "bg-[#B23DEB] text-white border-[#B23DEB] shadow-[0_10px_25px_rgba(178,61,235,0.3)] scale-105" 
                : "bg-white/[0.03] text-gray-500 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Courses Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#B23DEB]/30 transition-all duration-500 flex flex-col hover:bg-white/[0.04] hover:-translate-y-2"
          >
            {/* Image Overlay */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} 
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
              
              <div className="absolute top-5 left-5">
                <span className="bg-[#B23DEB] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">
                  {course.level || "BOSH"}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <PlayCircle className="text-white w-12 h-12 fill-[#B23DEB]/20" />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 flex flex-col flex-1 space-y-4">
              <div className="flex items-center gap-5">
                <div className="flex items-center text-[#F59E0B] gap-1.5 bg-[#F59E0B]/10 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black">{course.rating || "4.8"}</span>
                </div>
                <div className="flex items-center text-gray-500 gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{course.lessonsCount || 12} Dars</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white group-hover:text-[#B23DEB] transition-colors leading-tight">
                {course.title}
              </h3>
              
              <p className="text-gray-500 text-sm line-clamp-2 font-medium leading-relaxed">
                {course.description || "Ushbu kurs davomida siz eng kerakli ko'nikmalarni amaliy mashqlar orqali o'rganasiz."}
              </p>

              {/* Footer */}
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 bg-white/5 px-3 py-1.5 rounded-xl">
                  <Clock className="w-4 h-4 text-[#B23DEB]" />
                  <span className="text-[10px] font-black uppercase">{course.duration || "4 SOAT"}</span>
                </div>
                <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs hover:bg-[#B23DEB] hover:text-white transition-all duration-300 shadow-xl active:scale-95">
                  BOSHLASH
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
            <Search size={40} className="text-gray-700" />
          </div>
          <p className="text-gray-500 font-black text-xl tracking-tight">Kechirasiz, kurslar topilmadi...</p>
          <button onClick={() => setFilter("All")} className="mt-4 text-[#B23DEB] font-bold hover:underline">Filterni tozalash</button>
        </div>
      )}

      {/* Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Courses;