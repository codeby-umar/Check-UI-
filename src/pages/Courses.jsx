import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { 
  collection, onSnapshot, query, orderBy, 
  addDoc, serverTimestamp, deleteDoc, doc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import html2canvas from "html2canvas"; // Screenshot kutubxonasi
import { 
  Clock, Star, Sparkles, 
  ArrowRight, ShieldCheck, 
  Layout, Plus, X, FileText, Trash2, Eye,
  Download // Faqat yuklab olish iconi qoldi
} from "lucide-react"; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const taskRef = useRef(null); // Screenshot olinadigan joy

  // Modallar uchun statelar
  const [isHWModalOpen, setIsHWModalOpen] = useState(false); 
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Yangi ma'lumotlar statelari
  const [newHW, setNewHW] = useState({ title: "", description: "", imageUrl: "", taskText: "", deadline: "" });
  const [newCourse, setNewCourse] = useState({ title: "", category: "Programming", description: "", imageUrl: "", videoUrl: "", duration: "" });

  const pythonDefaultCourses = [
    {
      id: "py-01",
      title: "Python Asoslari: To'liq Kurs",
      category: "Programming",
      description: "Dasturlash dunyosiga ilk qadam.",
      imageUrl: "https://i.ytimg.com/vi/FpKo9QpS6pY/hq720.jpg",
      videoUrl: "https://www.youtube.com/watch?v=FpKo9QpS6pY",
      duration: "6.5h"
    }
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user && user.email === "admin@gmail.com");
    });

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
      unsubscribeAuth();
      unsubscribeCourses();
      unsubscribeHomeworks();
    };
  }, []);

  // Screenshot olish funksiyasi
  const takeScreenshot = async () => {
    if (taskRef.current) {
      const canvas = await html2canvas(taskRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${selectedTask.title}-vazifa.png`;
      link.click();
    }
  };

  // --- KURS AMALLARI ---
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, "courses"), { ...newCourse, createdAt: serverTimestamp() });
      setIsCourseModalOpen(false);
      setNewCourse({ title: "", category: "Programming", description: "", imageUrl: "", videoUrl: "", duration: "" });
      alert("Kurs qo'shildi!");
    } catch (e) { alert(e.message); }
  };

  const handleDeleteCourse = async (e, id) => {
    e.stopPropagation();
    if (!isAdmin || id === "py-01") return; 
    if (window.confirm("Kursni o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "courses", id));
    }
  };

  // --- VAZIFA AMALLARI ---
  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, "homeworks"), {
        ...newHW,
        imageUrl: newHW.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        createdAt: serverTimestamp()
      });
      setIsHWModalOpen(false);
      setNewHW({ title: "", description: "", imageUrl: "", taskText: "", deadline: "" });
      alert("Vazifa qo'shildi!");
    } catch (e) { alert(e.message); }
  };

  const handleDeleteHW = async (e, id) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm("Vazifani o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "homeworks", id));
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

          {isAdmin && (
            <div className="flex gap-4">
               {filter === "Homework" ? (
                 <button onClick={() => setIsHWModalOpen(true)} className="flex items-center gap-2 bg-[#B23DEB] px-6 py-3 rounded-sm font-bold uppercase text-xs tracking-widest transition-all hover:opacity-80 active:scale-95"><Plus size={18}/> New Task</button>
               ) : (
                 <button onClick={() => setIsCourseModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-sm font-bold uppercase text-xs tracking-widest transition-all hover:bg-gray-200 active:scale-95"><Plus size={18}/> New Course</button>
               )}
            </div>
          )}
        </header>

        <div className="flex items-center gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filter === cat ? "bg-[#B23DEB] border-[#B23DEB] text-white" : "bg-[#111] border-white/5 text-gray-500"}`}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><div className="w-8 h-8 border-2 border-t-[#B23DEB] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filter === "Homework" ? (
              homeworks.map((hw) => (
                <div key={hw.id} className="group bg-[#0f0f0f] border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all flex flex-col relative">
                  <img src={hw.imageUrl} className="w-full h-48 object-cover" alt="" />
                  {isAdmin && <button onClick={(e) => handleDeleteHW(e, hw.id)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>}
                  <div className="p-7">
                    <h3 className="text-xl font-bold mb-2">{hw.title}</h3>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-red-400 font-bold uppercase">{hw.deadline}</span>
                      <button onClick={() => setSelectedTask(hw)} className="text-[#B23DEB] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"><Eye size={14}/> View</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              courses.filter(c => filter === "All" || c.category === filter).map((course) => (
                <div key={course.id} className="group bg-[#0f0f0f] border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all flex flex-col relative">
                   <div className="relative aspect-video">
                    <img src={course.imageUrl} className="w-full h-full object-cover" alt="" />
                    {isAdmin && course.id !== "py-01" && <button onClick={(e) => handleDeleteCourse(e, course.id)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <span className="text-[#B23DEB] text-[10px] font-black uppercase mb-2">{course.category}</span>
                    <h3 className="text-xl font-bold mb-3">{course.title}</h3>
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

        {/* MODAL: KURS QO'SHISH */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md p-6 rounded-sm">
              <div className="flex justify-between mb-6">
                <h2 className="font-black uppercase italic">New <span className="text-[#B23DEB]">Course</span></h2>
                <button onClick={() => setIsCourseModalOpen(false)}><X/></button>
              </div>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <input required placeholder="Title" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                <select className="w-full bg-white/5 border border-white/10 p-3 text-sm text-gray-400" onChange={e => setNewCourse({...newCourse, category: e.target.value})}>
                  <option value="Programming">Programming</option>
                  <option value="Math">Math</option>
                </select>
                <input required placeholder="Duration (e.g. 4h)" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewCourse({...newCourse, duration: e.target.value})} />
                <input required placeholder="Image URL" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewCourse({...newCourse, imageUrl: e.target.value})} />
                <input required placeholder="Video URL (YouTube)" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewCourse({...newCourse, videoUrl: e.target.value})} />
                <textarea placeholder="Description" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                <button type="submit" className="w-full bg-[#B23DEB] py-4 font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-transform">Publish Course</button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VAZIFA QO'SHISH */}
        {isHWModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md p-6 rounded-sm">
              <div className="flex justify-between mb-6">
                <h2 className="font-black uppercase italic">New <span className="text-[#B23DEB]">Task</span></h2>
                <button onClick={() => setIsHWModalOpen(false)}><X/></button>
              </div>
              <form onSubmit={handleAddHomework} className="space-y-4">
                <input required placeholder="Title" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewHW({...newHW, title: e.target.value})} />
                <textarea required placeholder="Short Description" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewHW({...newHW, description: e.target.value})} />
                <textarea required placeholder="Task Code/Text" className="w-full bg-[#B23DEB]/5 border border-[#B23DEB]/20 p-3 text-sm font-mono focus:border-[#B23DEB] outline-none" rows="4" onChange={e => setNewHW({...newHW, taskText: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Image URL" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewHW({...newHW, imageUrl: e.target.value})} />
                  <input required placeholder="Deadline" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-[#B23DEB] outline-none" onChange={e => setNewHW({...newHW, deadline: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-[#B23DEB] py-4 font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-transform">Create Task</button>
              </form>
            </div>
          </div>
        )}

        {/* VAZIFANI KO'RISH MODALI - HIMOYALANGAN VA SCREENSHOT BILAN */}
        {selectedTask && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" 
               onContextMenu={(e) => e.preventDefault()}> {/* O'ng tugmani bloklash */}
            <div className="bg-[#0a0a0a] border border-[#B23DEB]/30 w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl shadow-[#B23DEB]/10">
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111]">
                <h2 className="text-xl font-black uppercase text-[#B23DEB] tracking-tighter italic select-none">{selectedTask.title}</h2>
                <div className="flex items-center gap-4">
                  {/* Screenshot tugmasi */}
                  <button 
                    onClick={takeScreenshot}
                    className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                    title="Rasmga olish"
                  >
                    <Download size={20}/>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setSelectedTask(null)}><X size={20}/></button>
                </div>
              </div>

              {/* Rasmga olinadigan asosiy qism - select-none (nusxalashni taqiqlash) */}
              <div ref={taskRef} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a] select-none">
                <p className="text-gray-300 text-sm mb-6 leading-relaxed select-none">
                  {selectedTask.description}
                </p>
                
                <div className="relative group/code">
                  <pre className="bg-[#050505] border border-white/5 p-6 rounded-sm text-sm text-emerald-400 font-mono whitespace-pre-wrap ring-1 ring-[#B23DEB]/5 select-none pointer-events-none">
                    {selectedTask.taskText}
                  </pre>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#111] flex justify-between items-center select-none">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Muddati:</span>
                  <span className="text-xs font-black uppercase text-red-400 tracking-wider">{selectedTask.deadline}</span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="bg-white/5 px-8 py-2 rounded-sm text-[10px] font-black uppercase border border-white/5 hover:bg-white/10 transition-all">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB; border-radius: 10px; }
        
        /* Matnni belgilashni butkul bloklash uchun global CSS */
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default Courses;