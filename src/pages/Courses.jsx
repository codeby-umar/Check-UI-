import { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase sozlamalaringiz
import { collection, getDocs } from "firebase/firestore";
import { Search, BookOpen, Clock, Star, PlayCircle } from "lucide-react"; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("Hammasi");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    };
    fetchCourses();
  }, []);


  const categories = ["Hammasi", "Matematika", "Ingliz tili", "Dasturlash", "Fizika"];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "Hammasi" || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kurslarimiz</h1>
            <p className="text-slate-500 mt-2">Bilimingizni oshirish uchun eng yaxshi kontentlar</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kurs qidirish..."
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-[20px] shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Filtrlar */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                filter === cat 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Kurslar Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white rounded-[35px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col"
          >
            {/* Kurs rasmi */}
            <div className="relative h-52 overflow-hidden">
              <img 
                src={course.image || "https://via.placeholder.com/400x250"} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  {course.level || "Boshlang'ich"}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                <PlayCircle className="text-white w-14 h-14" />
              </div>
            </div>

            {/* Kurs ma'lumoti */}
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-amber-500 gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-slate-700">{course.rating || "4.8"}</span>
                </div>
                <div className="flex items-center text-slate-400 gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[12px] font-medium">{course.lessonsCount || 12} dars</span>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                {course.description || "Ushbu kurs davomida siz eng kerakli ko'nikmalarni amaliy mashqlar orqali o'rganasiz."}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">{course.duration || "4 soat"}</span>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300">
                  Boshlash
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bo'sh holat */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-white inline-block p-10 rounded-[40px] shadow-sm border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg">Bu ruknda kurslar topilmadi.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;