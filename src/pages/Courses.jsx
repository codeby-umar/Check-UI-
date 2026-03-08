import { useState, useEffect } from "react";
import { db } from "../firebase";
import { 
  collection, onSnapshot, query, orderBy, 
  addDoc, serverTimestamp, deleteDoc, doc 
} from "firebase/firestore";
import { 
  Clock, Star, Sparkles, 
  ArrowRight, ShieldCheck, 
  Layout, Plus, X, FileText, Trash2, Eye
} from "lucide-react"; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  
  // Modallar uchun statelar
  const [isModalOpen, setIsModalOpen] = useState(false); // Qo'shish modali
  const [selectedTask, setSelectedTask] = useState(null); // Ko'rish modali
  
  const [newHW, setNewHW] = useState({
    title: "",
    description: "",
    imageUrl: "",
    taskText: "", 
    deadline: ""
  });

  const pythonDefaultCourses = [
    {
      id: "py-01",
      title: "Python Asoslari: To'liq Kurs",
      category: "Programming",
      description: "Dasturlash dunyosiga ilk qadam. O'zgaruvchilar va algoritmlar.",
      imageUrl: "https://i.ytimg.com/vi/FpKo9QpS6pY/hq720.jpg",
      videoUrl: "https://www.youtube.com/watch?v=FpKo9QpS6pY",
      duration: "6.5h",
      modules: "18",
      rating: "4.9"
    }
  ];

  useEffect(() => {
    const qCourses = query(collection(db, "courses"), orderBy("title", "asc"));
    const unsubscribeCourses = onSnapshot(qCourses, (snapshot) => {
      const dbData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses([...pythonDefaultCourses, ...dbData]);
      setLoading(false);
    });

    const qHomeworks = query(collection(db, "homeworks"), orderBy("createdAt", "desc"));
    const unsubscribeHomeworks = onSnapshot(qHomeworks, (snapshot) => {
      const hwData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHomeworks(hwData);
    });

    return () => {
      unsubscribeCourses();
      unsubscribeHomeworks();
    };
  }, []);

  const handleAddHomework = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "homeworks"), {
        ...newHW,
        imageUrl: newHW.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewHW({ title: "", description: "", imageUrl: "", taskText: "", deadline: "" });
      alert("Vazifa muvaffaqiyatli qo'shildi!");
    } catch (error) {
      alert("Xatolik: " + error.message);
    }
  };

  const handleDeleteHW = async (e, id) => {
    e.stopPropagation(); // Kartochka bosilib ketishini oldini oladi
    if(window.confirm("Ushbu vazifani o'chirishni xohlaysizmi?")) {
      try {
        await deleteDoc(doc(db, "homeworks", id));
      } catch (error) {
        alert("O'chirishda xatolik!");
      }
    }
  };

  const categories = ["All", "Math", "Programming", "Homework"];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#B23DEB]/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B23DEB] to-purple-400">
              {filter === "Homework" ? "Assignments" : "Modules"}
            </span>
          </h1>

          {filter === "Homework" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#B23DEB] hover:bg-[#9a35cc] text-white px-8 py-3.5 rounded-sm font-bold transition-all shadow-[0_0_30px_rgba(178,61,235,0.4)] active:scale-95 uppercase text-xs tracking-widest"
            >
              <Plus size={18} /> New Task
            </button>
          )}
        </header>

        <div className="flex items-center gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${
                filter === cat 
                ? "bg-[#B23DEB] border-[#B23DEB] text-white" 
                : "bg-[#111] border-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><div className="w-8 h-8 border-2 border-t-[#B23DEB] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filter === "Homework" ? (
              homeworks.map((hw) => (
                <div key={hw.id} className="group bg-[#0f0f0f] rounded-sm border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all duration-500 flex flex-col relative">
                  <div>
                    <img src={hw.imageUrl} alt={hw.title} className="w-full h-50  group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={(e) => handleDeleteHW(e, hw.id)}
                      className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{hw.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{hw.description}</p>
                    
                    <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 uppercase font-black">Deadline</span>
                        <span className="text-xs text-red-400 font-bold">{hw.deadline}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedTask(hw)}
                        className="flex items-center gap-2 bg-[#B23DEB]/10 hover:bg-[#B23DEB] text-[#B23DEB] hover:text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase transition-all tracking-widest border border-[#B23DEB]/20"
                      >
                        <Eye size={14} /> View Task
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              courses.filter(c => filter === "All" || c.category === filter).map((course) => (
                <div key={course.id} className="group bg-[#0f0f0f] rounded-sm border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all duration-500 flex flex-col">
                   {/* Kurs kartochkasi qismi (o'zgarishsiz) */}
                   <div className="relative aspect-video overflow-hidden">
                    <img src={course.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <span className="text-[#B23DEB] text-[10px] font-black uppercase tracking-widest mb-2">{course.category}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                    <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-gray-500">
                       <span className="text-[10px] font-bold uppercase">{course.duration}</span>
                       <a href={course.videoUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-[#B23DEB] text-white rounded-sm transition-all"><ArrowRight size={18} /></a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 1. VAZIFA QO'SHISH MODALI */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md rounded-sm shadow-2xl animate-in zoom-in duration-200">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111]">
                <h2 className="text-lg font-black uppercase italic tracking-tighter">New <span className="text-[#B23DEB]">Task</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddHomework} className="p-6 space-y-4">
                <input required type="text" placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-[#B23DEB]/50" 
                  onChange={e => setNewHW({...newHW, title: e.target.value})} />
                <textarea required rows="2" placeholder="Short Description" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm outline-none focus:border-[#B23DEB]/50" 
                  onChange={e => setNewHW({...newHW, description: e.target.value})} />
                <textarea required rows="5" placeholder="CODE / TASK TEXT (Detailed)" className="w-full bg-[#B23DEB]/5 border border-[#B23DEB]/20 rounded-sm px-4 py-3 text-sm font-mono outline-none focus:border-[#B23DEB]" 
                  onChange={e => setNewHW({...newHW, taskText: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Image URL" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm" onChange={e => setNewHW({...newHW, imageUrl: e.target.value})} />
                  <input required type="text" placeholder="Deadline" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm" onChange={e => setNewHW({...newHW, deadline: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-[#B23DEB] hover:bg-[#9a35cc] text-white font-black py-4 rounded-sm mt-2 transition-all uppercase text-xs tracking-widest">Create Task</button>
              </form>
            </div>
          </div>
        )}

        {/* 2. VAZIFANI KO'RISH MODALI (FAQAT MATN UCHUN) */}
        {selectedTask && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl transition-all">
            <div className="bg-[#0a0a0a] border border-[#B23DEB]/30 w-full max-w-2xl rounded-sm shadow-[0_0_50px_rgba(178,61,235,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111]">
                <div>
                  <h2 className="text-xl font-black uppercase text-[#B23DEB] tracking-tight">{selectedTask.title}</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Assignment Details</p>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-[0.2em]">Objective:</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedTask.description}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase text-[#B23DEB] mb-3 tracking-[0.2em]">Task / Code Content:</h4>
                  <div className="relative group">
                    <pre className="bg-[#050505] border border-white/5 p-6 rounded-sm text-sm text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-auto shadow-inner">
                      {selectedTask.taskText}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#111] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Deadline: {selectedTask.deadline}</span>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Courses;