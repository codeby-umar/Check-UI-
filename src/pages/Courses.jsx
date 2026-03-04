import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { 
  Search, BookOpen, Clock, Star, 
  PlayCircle, Filter, Sparkles, 
  Layers, ArrowRight, BookMarked 
} from "lucide-react"; 

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

  const categories = ["All", "Math", "English", "Programming", "Physics"];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "All" || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 custom-scrollbar">
      <div className="max-w-7xl mx-auto mb-16">
        
        {/* 1. Header & Search Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#B23DEB] font-black tracking-[0.3em] uppercase text-[10px]">
              <Sparkles size={16} /> O'quv Platformasi
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
              Premium <span className="text-[#B23DEB] not-italic">Kurslar</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              Bilimingizni oshirish uchun eng yuqori sifatli va eksklyuziv kontentlar to'plami.
            </p>
          </div>

          <div className="relative w-full lg:w-[450px] group">
            <div className="absolute inset-0 bg-[#B23DEB]/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-[2rem] px-6 py-2 backdrop-blur-xl group-focus-within:border-[#B23DEB]/50 transition-all">
              <Search className="text-gray-500 group-focus-within:text-[#B23DEB] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Kurs nomini kiriting..."
                className="w-full bg-transparent border-none outline-none py-4 px-4 text-white placeholder:text-gray-600 font-bold"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. Categories Filter */}
        <div className="flex items-center gap-4 mt-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-[#B23DEB]">
            <Filter size={20} />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === cat 
                ? "bg-[#B23DEB] text-white border-[#B23DEB] shadow-[0_10px_25px_rgba(178,61,235,0.4)] scale-105" 
                : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/20 hover:text-white"
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
            className="group relative bg-white/[0.02] rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-[#B23DEB]/30 transition-all duration-500 flex flex-col hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden p-4">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                <img 
                  src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                
                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-16 h-16 bg-[#B23DEB] rounded-full flex items-center justify-center shadow-[0_0_30px_#B23DEB] scale-50 group-hover:scale-100 transition-transform duration-500">
                    <PlayCircle className="text-white fill-white" size={30} />
                  </div>
                </div>

                <div className="absolute top-6 left-6">
                  <span className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#B23DEB]">
                    {course.level || "Boshlang'ich"}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-10 pt-4 flex flex-col flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center text-yellow-500 gap-1.5 bg-yellow-500/5 px-3 py-1 rounded-xl border border-yellow-500/10">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-black">{course.rating || "4.8"}</span>
                </div>
                <div className="flex items-center text-gray-500 gap-1.5">
                  <Layers className="w-4 h-4 text-[#B23DEB]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{course.lessonsCount || 12} Modul</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#B23DEB] transition-colors leading-tight italic uppercase tracking-tighter">
                {course.title}
              </h3>
              
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                {course.description || "Ushbu eksklyuziv kurs davomida siz eng zamonaviy texnologiyalarni mutaxassislardan o'rganasiz."}
              </p>

              {/* Card Footer */}
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <Clock className="w-4 h-4 text-[#B23DEB]" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{course.duration || "4h 30m"}</span>
                </div>
                
                <button className="flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#B23DEB] hover:text-white hover:shadow-[0_10px_20px_rgba(178,61,235,0.3)] transition-all duration-300">
                  Start <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-40 animate-pulse">
          <BookMarked className="mx-auto text-white/5 mb-6" size={80} />
          <p className="text-gray-600 font-black text-xl uppercase tracking-[0.3em]">Kurslar topilmadi</p>
          <button 
            onClick={() => {setFilter("All"); setSearchTerm("");}}
            className="mt-6 text-[#B23DEB] font-bold underline underline-offset-8"
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Courses;