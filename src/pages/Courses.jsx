import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  Search, Clock, Star, 
  PlayCircle, Sparkles, 
  Layers, ArrowRight, BookMarked,
  ShieldCheck, Layout
} from "lucide-react"; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const pythonDefaultCourses = [
    {
      id: "py-01",
      title: "Python Asoslari: To'liq Kurs",
      category: "Programming",
      description: "Dasturlash dunyosiga ilk qadam. O'zgaruvchilar va algoritmlar.",
      imageUrl: "https://i.ytimg.com/vi/FpKo9QpS6pY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB21zOF9QycK_ecC1EbU9e6xqfmoA",
      videoUrl: "https://www.youtube.com/watch?v=FpKo9QpS6pY",
      duration: "6.5h",
      modules: "18",
      rating: "4.9"
    },
    {
      id: "py-02",
      title: "Django & Backend Tizimlari",
      category: "Programming",
      description: "Murakkab veb-tizimlar va API arxitekturasini Python bilan quring.",
      imageUrl: "https://infocom.uz/_next/image?url=https%3A%2F%2Fapi.infocom.uz%2Fstorage%2Fimages%2Fposts%2Fnormal%2FUvGDlcGW0B5LDFvsTaVjBqy8m1P24RWIHTCnfuhc.jpg&w=3840&q=75",
      videoUrl: "https://www.youtube.com/watch?v=otQfX26-m-w",
      duration: "12h",
      modules: "25",
      rating: "5.0"
    },
    {
      id: "py-03",
      title: "AI va Data Science",
      category: "Programming",
      description: "Neyron tarmoqlar va katta ma'lumotlar bilan ishlash kursi.",
      imageUrl: "https://tkmce.ac.in/images/AI%20&%20Data%20Science.jpg",
      videoUrl: "https://www.youtube.com/watch?v=578f5_0-t44",
      duration: "8.2h",
      modules: "14",
      rating: "4.8"
    }
  ];

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("title", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses([...pythonDefaultCourses, ...dbData]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ["All", "Math", "English", "Programming", "Physics"];
  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "All" || course.category === filter;
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#B23DEB]/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#B23DEB]/10 border border-[#B23DEB]/20 px-3 py-1 rounded-full">
              <Sparkles size={12} className="text-[#B23DEB]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B23DEB]">Neural Academy v2.0</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
              Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B23DEB] to-purple-400">Modules</span>
            </h1>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-[#B23DEB] opacity-20 group-hover:opacity-40 rounded-xl blur transition duration-500"></div>
            <div className="relative flex items-center bg-[#111] border border-white/5 rounded-xl px-4 py-1">
              <Search className="text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Kurslarni qidirish..."
                className="bg-transparent border-none outline-none py-3 px-4 text-sm w-64 placeholder:text-gray-700"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                filter === cat 
                ? "bg-[#B23DEB] border-[#B23DEB] text-white shadow-[0_0_20px_rgba(178,61,235,0.3)]" 
                : "bg-[#111] border-white/5 text-gray-500 hover:border-[#B23DEB]/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-32">
            <div className="w-10 h-10 border-2 border-t-[#B23DEB] border-white/5 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all duration-500 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck size={10} /> Certified
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <a 
                    href={course.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                  >
                  </a>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#B23DEB] text-[10px] font-bold uppercase tracking-widest">{course.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} className="fill-current" />
                      <span className="text-xs font-bold">{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#B23DEB] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-6 h-8">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Layout size={14} />
                        <span className="text-[10px] font-bold">{course.modules}</span>
                      </div>
                    </div>
                    
                    <a 
                      href={course.videoUrl}
                      target="_blank"
                      className="p-2 bg-white/5 hover:bg-[#B23DEB] text-white rounded-lg transition-colors group/btn"
                    >
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <BookMarked size={60} className="mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-widest">Ma'lumot topilmadi</h3>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Courses;