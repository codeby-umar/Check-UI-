import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { 
  IoAddCircleOutline, 
  IoTrashOutline, 
  IoCheckmarkCircle, 
  IoCloudUploadOutline, 
  IoBookOutline, 
  IoImageOutline,
  IoTimeOutline
} from "react-icons/io5";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@gmail.com";

  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [subject, setSubject] = useState("Rus tili");
  const [imageUrl, setImageUrl] = useState(""); 
  const [questions, setQuestions] = useState([
    { text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }
  ]);

  const addNewQuestion = () => {
    setQuestions([...questions, { text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }]);
  };

  const handleUpdate = (qIdx, oIdx, val, isText = true) => {
    const newQuestions = [...questions];
    if (isText) {
      if (oIdx === null) newQuestions[qIdx].text = val;
      else newQuestions[qIdx].options[oIdx].text = val;
    } else {
      newQuestions[qIdx].options.forEach((opt, i) => opt.isCorrect = i === oIdx);
    }
    setQuestions(newQuestions);
  };

  const saveTest = async () => {
    if (!title || !questions[0].text) return alert("Sarlavha va kamida bitta savolni to'ldiring!");
    
    try {
      await addDoc(collection(db, "tests"), {
        title, 
        timeLimit, 
        subject,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000", 
        questions,
        createdAt: new Date(),
        author: user.email
      });
      alert("Test muvaffaqiyatli saqlandi!");
      
      setTitle(""); 
      setImageUrl("");
      setTimeLimit(15);
      setQuestions([{ text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }]);
    } catch (err) { 
      alert("Xatolik yuz berdi: " + err.message); 
    }
  };

  if (!isAdmin) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
       <div className="p-10 bg-white/5 border border-white/10 rounded-[2rem] text-center backdrop-blur-xl">
          <p className="text-gray-500 font-black text-xl uppercase tracking-widest">
             Faqat adminlar uchun ruxsat berilgan
          </p>
       </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-8 md:p-12 custom-scrollbar">
      <div className="max-w-5xl mx-auto pb-20">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <span className="w-3 h-12 bg-[#B23DEB] rounded-full shadow-[0_0_15px_#B23DEB]"></span>
            Yangi Test <span className="text-[#B23DEB]">Yaratish</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium tracking-wide">Platforma uchun yangi kontent qo'shish paneli</p>
        </div>

        {/* 1. Basic Info Card */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] mb-10 space-y-6 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 relative group">
              <input 
                type="text" 
                placeholder="Test sarlavhasi..." 
                className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none text-white focus:border-[#B23DEB]/50 transition-all font-bold placeholder:text-gray-700"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-4 focus-within:border-[#B23DEB]/50 transition-all">
              <IoTimeOutline className="text-gray-600" size={20} />
              <input 
                type="number" 
                className="w-full bg-transparent p-4 outline-none text-white text-center font-black"
                value={timeLimit} 
                onChange={e => setTimeLimit(Number(e.target.value))} 
              />
              <span className="text-[10px] font-black text-[#B23DEB] uppercase tracking-tighter">min</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative flex items-center group">
              <select 
                className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none text-gray-400 focus:border-[#B23DEB]/50 appearance-none cursor-pointer font-bold pr-12"
                value={subject} 
                onChange={e => setSubject(e.target.value)}
              >
                <option value="Rus tili">Rus tili</option>
                <option value="Ingliz tili">Ingliz tili</option>
                <option value="Matematika">Matematika</option>
                <option value="Dasturlash">Dasturlash</option>
              </select>
              <IoBookOutline className="absolute right-5 text-gray-600 pointer-events-none" size={20} />
            </div>

            <div className="relative flex items-center group">
              <input 
                type="text" 
                placeholder="Muqova rasm URL (ixtiyoriy)..." 
                className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none text-white focus:border-[#B23DEB]/50 font-bold pl-14 placeholder:text-gray-700"
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
              />
              <IoImageOutline className="absolute left-5 text-gray-600" size={22} />
            </div>
          </div>
        </div>

        {/* 2. Questions Section */}
        <div className="space-y-8">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-[#B23DEB]/20 transition-all duration-500">
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-[#B23DEB] text-white rounded-xl text-xs font-black shadow-[0_5px_15px_rgba(178,61,235,0.4)]">
                    {qIdx + 1}
                  </span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Savol tarkibi</span>
                </div>
                
                {questions.length > 1 && (
                  <button 
                    onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} 
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                  >
                    <IoTrashOutline size={18}/>
                  </button>
                )}
              </div>
              
              <textarea 
                placeholder="Savol matnini bu yerga kiriting..." 
                className="w-full p-6 bg-white/[0.01] border border-white/5 rounded-3xl mb-8 outline-none font-bold text-lg text-white placeholder:text-gray-800 focus:border-white/10 min-h-[100px] resize-none" 
                value={q.text} 
                onChange={e => handleUpdate(qIdx, null, e.target.value)} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`group/opt flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${opt.isCorrect ? 'border-[#B23DEB]/50 bg-[#B23DEB]/5' : 'border-white/5 bg-white/[0.01]'}`}>
                    <button 
                      onClick={() => handleUpdate(qIdx, oIdx, null, false)} 
                      className={`transition-all duration-500 ${opt.isCorrect ? "text-[#B23DEB] scale-110 shadow-[0_0_10px_#B23DEB]" : "text-white/10 hover:text-white/30"}`}
                    >
                      <IoCheckmarkCircle size={28} />
                    </button>
                    <input 
                      type="text" 
                      placeholder={`Variant ${oIdx + 1}`} 
                      className="bg-transparent outline-none text-white font-bold w-full placeholder:text-gray-800"
                      value={opt.text} 
                      onChange={e => handleUpdate(qIdx, oIdx, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mt-12">
          <button 
            onClick={addNewQuestion} 
            className="flex-1 py-5 border-2 border-dashed border-white/10 rounded-3xl text-gray-500 font-black hover:border-[#B23DEB]/50 hover:text-[#B23DEB] transition-all flex items-center justify-center gap-3 group"
          >
            <IoAddCircleOutline size={24} className="group-hover:rotate-180 transition-transform duration-500" /> 
            SAVOL QO'SHISH
          </button>
          
          <button 
            onClick={saveTest} 
            className="flex-[1.5] py-5 bg-[#B23DEB] text-white rounded-3xl font-black shadow-[0_15px_35px_rgba(178,61,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <IoCloudUploadOutline size={24} /> 
            BAZAGA YUKLASH
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Profile;