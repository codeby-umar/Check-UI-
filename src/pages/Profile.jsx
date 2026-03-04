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
  IoTimeOutline,
  IoShieldCheckmarkOutline
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
    if (!title || !questions[0].text) return alert("Iltimos, barcha maydonlarni to'ldiring!");
    
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
      alert("Protokol bazaga muvaffaqiyatli yuklandi!");
      
      setTitle(""); 
      setImageUrl("");
      setTimeLimit(15);
      setQuestions([{ text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }]);
    } catch (err) { 
      alert("Tizim xatosi: " + err.message); 
    }
  };

  if (!isAdmin) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-6">
       <div className="p-12 bg-[#111] border border-red-500/20 rounded-[3rem] text-center backdrop-blur-3xl shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <IoShieldCheckmarkOutline className="mx-auto text-red-500 mb-6" size={60} />
          <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] mb-2">Access Denied</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
             Faqat administratorlar protokol yaratish huquqiga ega
          </p>
       </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto pb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-12">
            <div>
              <div className="flex items-center gap-2 text-[#B23DEB] mb-4">
                <div className="w-2 h-2 bg-[#B23DEB] rounded-full animate-pulse shadow-[0_0_10px_#B23DEB]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Creator Studio v3.0</span>
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                News <span className="text-[#B23DEB] not-italic">Test</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-sm border border-white/10 backdrop-blur-xl">
               <div className="text-right">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Auth Session</p>
                  <p className="text-xs font-black text-white italic">{user?.email}</p>
               </div>
               <div className="w-10 h-10 bg-[#B23DEB]/20 rounded-full border border-[#B23DEB]/30 flex items-center justify-center">
                  <IoShieldCheckmarkOutline className="text-[#B23DEB]" size={20} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Title & Subject */}
            <div className="lg:col-span-2 space-y-6">
              <div className="group relative">
                <input 
                  type="text" 
                  placeholder="TEST SARLAVHASI..." 
                  className="w-full px-8 py-6 bg-[#111] border border-white/5 rounded-[2.5rem] outline-none text-white focus:border-[#B23DEB]/40 transition-all font-black uppercase text-sm tracking-widest"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex items-center">
                  <IoBookOutline className="absolute left-6 text-[#B23DEB]" size={22} />
                  <select 
                    className="w-full pl-16 pr-8 py-5 bg-[#111] border border-white/5 rounded-4xl outline-none text-gray-400 focus:border-[#B23DEB]/40 appearance-none cursor-pointer font-black uppercase text-[10px] tracking-widest"
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                  >
                    <option value="Rus tili">Rus tili</option>
                    <option value="Ingliz tili">Ingliz tili</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Dasturlash">Dasturlash</option>
                  </select>
                </div>

                <div className="relative flex items-center">
                  <IoImageOutline className="absolute left-6 text-gray-600" size={22} />
                  <input 
                    type="text" 
                    placeholder="IMAGE URL..." 
                    className="w-full pl-16 pr-8 py-5 bg-[#111] border border-white/5 rounded-4xl outline-none text-white focus:border-[#B23DEB]/40 font-black uppercase text-[10px] tracking-widest "
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Time Limit Card */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-8 rounded-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#B23DEB] opacity-20 group-hover:opacity-100 transition-opacity"></div>
              <IoTimeOutline size={30} className="text-[#B23DEB] mb-4" />
              <input 
                type="number" 
                className="bg-transparent text-5xl font-black text-white text-center w-full outline-none italic tracking-tighter"
                value={timeLimit} 
                onChange={e => setTimeLimit(Number(e.target.value))} 
              />
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2">Vaqt Limiti (Min)</p>
            </div>
          </div>

          {/* 3. Questions Loop */}
          <div className="space-y-10">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="relative p-10 bg-[#111] border border-white/5 rounded-sm group hover:border-[#B23DEB]/30 transition-all duration-700">
                
                {/* Question Header */}
                <div className="flex justify-between text-white items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-[1.2rem] font-black italic shadow-2xl">
                      {qIdx + 1 < 10 ? `0${qIdx + 1}` : qIdx + 1}
                    </div>
                    <div className="h-0.5 bg-white/50 w-12"></div>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em]">Question Module</span>
                  </div>
                  
                  {questions.length > 1 && (
                    <button 
                      onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} 
                      className="w-12 h-12 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500 group-hover:rotate-90"
                    >
                      <IoTrashOutline size={20}/>
                    </button>
                  )}
                </div>
                
                <textarea 
                  placeholder="Savol kiriting .." 
                  className="w-full p-8 bg-white/2 border border-white rounded-sm  mb-8 outline-none font-semibold text-xl text-white  focus:border-white/10 resize-none tracking-tight leading-relaxed italic" 
                  value={q.text} 
                  onChange={e => handleUpdate(qIdx, null, e.target.value)} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx} 
                      className={`flex items-center gap-5 p-5 rounded-4xl  transition-all duration-500 ${
                        opt.isCorrect 
                        ? ' bg-[#B23DEB]/5 ' 
                        : 'border-white/5 bg-transparent'
                      }`}
                    >
                      <button 
                        onClick={() => handleUpdate(qIdx, oIdx, null, false)} 
                        className={`transition-all duration-700 ${opt.isCorrect ? "text-[#B23DEB] scale-125 " : "text-white hover:text-white/20"}`}
                      >
                        <IoCheckmarkCircle size={32} />
                      </button>
                      <input 
                        type="text" 
                        placeholder={`VARIANT ${oIdx + 1}`} 
                        className="bg-transparent outline-none text-white font-black uppercase text-xs tracking-widest w-full "
                        value={opt.text} 
                        onChange={e => handleUpdate(qIdx, oIdx, e.target.value)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4. Action Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 flex gap-4 z-50">
            <button 
              onClick={addNewQuestion} 
              className="flex-1 py-5 bg-[#111] border border-white/10 rounded-[2.5rem] text-white font-black text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 backdrop-blur-xl shadow-2xl"
            >
              <IoAddCircleOutline size={20} /> SAVOL QO'SHISH
            </button>
            
            <button 
              onClick={saveTest} 
              className="flex-[1.5] py-5 bg-[#B23DEB] text-white rounded-[2.5rem] font-black text-[10px] tracking-[0.2em]  hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <IoCloudUploadOutline size={20} /> BAZAGA YUKLASH
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB55; }
      `}</style>
    </div>
  );
};

export default Profile;