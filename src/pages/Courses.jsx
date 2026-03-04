import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  Search, Clock, Star, 
  PlayCircle, Filter, Sparkles, 
  Layers, ArrowRight, BookMarked,
  ShieldCheck, Zap
} from "lucide-react"; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getDocs o'rniga onSnapshot (real-time) ishlatish yaxshiroq
    const q = query(collection(db, "courses"), orderBy("title", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setCourses(coursesData);
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
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      
      {/* 1. Header Area (Fixed) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Banner & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#B23DEB]/10 border border-[#B23DEB]/20 px-4 py-2 rounded-2xl">
                <Sparkles size={14} className="text-[#B23DEB]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B23DEB]">Neural Academy v2.0</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Elite <span className="text-[#B23DEB] not-italic">Modules</span>
              </h1>
              <p className="text-gray-500 font-bold text-sm max-w-sm uppercase tracking-widest leading-relaxed">
                Tizimning eng yuqori darajadagi ta'lim protokollari bilan tanishing.
              </p>
            </div>

            <div className="relative w-full lg:w-125">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#B23DEB] to-blue-600 rounded-[2.5rem] blur opacity-20"></div>
              <div className="relative flex items-center bg-[#111] border border-white/5 rounded-[2.5rem] px-8 py-2">
                <Search className="text-gray-600" size={22} />
                <input
                  type="text"
                  placeholder="KURS QIDIRISH..."
                  className="w-full bg-transparent border-none outline-none py-5 px-5 text-white placeholder:text-gray-800 font-black uppercase text-xs tracking-widest"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. Categories Navigator */}
          <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-10 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                  filter === cat 
                  ? "bg-[#B23DEB] text-white border-[#B23DEB]" 
                  : "bg-transparent text-gray-600 border-white/5 hover:border-[#B23DEB]/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3. Courses Grid */}
          {loading ? (
             <div className="flex flex-col items-center py-40 opacity-20">
                <div className="w-12 h-12 border-4 border-t-[#B23DEB] border-white/10 rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-24">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="group relative bg-[#111] rounded-[4rem] border border-white/5 hover:border-[#B23DEB]/40 transition-all duration-700 flex flex-col"
                >
                  {/* Visual Header */}
                  <div className="relative h-72 p-5">
                    <div className="w-full h-full rounded-[3.2rem] overflow-hidden relative">
                      <img 
                        src={course.imageUrl || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop"} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[50%] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent"></div>
                      
                      {/* Floating Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                          <ShieldCheck size={10} /> Certified
                        </span>
                        <span className="bg-[#B23DEB] px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                          {course.category}
                        </span>
                      </div>

                      {/* Play Action */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 group-hover:scale-100">
                        <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl">
                          <PlayCircle size={40} className="fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-10 pt-2 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1.5 text-yellow-500">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black">4.9</span>
                      </div>
                      <div className="h-[1px] flex-1 mx-4 bg-white/5"></div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Layers size={14} className="text-[#B23DEB]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">12 Modules</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#B23DEB] transition-colors leading-tight italic uppercase tracking-tighter">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider line-clamp-2 mb-10 leading-relaxed opacity-60">
                      {course.description || "Tizimning maxfiy o'quv protokoli orqali bilimingizni yangilang."}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
                        <Clock size={14} className="text-[#B23DEB]" />
                        <span className="text-[9px] font-black uppercase tracking-widest">4.5 Hours</span>
                      </div>
                      
                      <button className="w-14 h-14 bg-white hover:bg-[#B23DEB] text-black hover:text-white rounded-full flex items-center justify-center transition-all duration-500 hover:rotate-[-45deg] shadow-xl">
                        <ArrowRight size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-40">
              <BookMarked className="mx-auto text-white/5 mb-8" size={100} />
              <p className="text-gray-700 font-black text-2xl uppercase tracking-[0.5em]">No Data Found</p>
              <button 
                onClick={() => {setFilter("All"); setSearchTerm("");}}
                className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[#B23DEB] text-[10px] font-black uppercase tracking-widest hover:bg-[#B23DEB] hover:text-white transition-all"
              >
                Reset Database Filter
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB55; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Courses;