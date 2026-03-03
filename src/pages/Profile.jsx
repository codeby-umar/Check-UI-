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
  IoImageOutline 
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
        imageUrl: imageUrl || "https://via.placeholder.com/150", 
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

  if (!isAdmin) return <div className="p-10 text-center text-gray-500 font-bold text-xl uppercase tracking-widest">Faqat adminlar uchun ruxsat berilgan</div>;

  return (
    <div>
      <div className="px-6">
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-gray-800">
          <span className="w-2.5 h-10 bg-[#B23DEB] rounded-full"></span> Yangi Test Yaratish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" placeholder="Test sarlavhasi (masalan: Grammatika)" className="md:col-span-2 p-3.5 bg-gray-50 rounded-lg outline-none border border-transparent focus:border-purple-200 font-medium" 
                value={title} onChange={e => setTitle(e.target.value)} />
             
             <div className="flex items-center bg-gray-50 rounded-lg  focus-within:border-purple-200">
                <input type="number" placeholder="Vaqt" className="w-full  bg-transparent outline-none text-center font-bold" 
                  value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} />
                <span className="text-[10px] font-black text-gray-400 uppercase">min</span>
             </div>
          </div>

          <div className="relative flex items-center">
            <select 
              className="w-full p-3.5 bg-gray-50 rounded-lg outline-none border border-transparent focus:border-purple-200 appearance-none cursor-pointer font-medium"
              value={subject} 
              onChange={e => setSubject(e.target.value)}
            >
              <option value="Rus tili">Rus tili</option>
              <option value="Ingliz tili">Ingliz tili</option>
              <option value="Matematika">Matematika</option>
              <option value="Dasturlash">Dasturlash</option>
            </select>
            <IoBookOutline className="absolute right-4 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative flex items-center">
            <input type="text" placeholder="Rasm URL manzili" className="w-full p-3.5 bg-gray-50 rounded-lg outline-none border border-transparent focus:border-purple-200 font-medium pl-12" 
                value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <IoImageOutline className="absolute left-4 text-gray-400" size={18} />
          </div>
        </div>
        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="p-6 border border-gray-100 rounded-lg bg-white relative hover:border-purple-200 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-[#B23DEB] bg-purple-50 px-4 py-1.5 rounded-full uppercase">Savol {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} className="text-red-300 hover:text-red-500 transition-colors"><IoTrashOutline size={20}/></button>
                )}
              </div>
              
              <input type="text" placeholder="Savol matnini yozing..." className="w-full p-3.5 bg-gray-50 rounded-2xl mb-5 outline-none font-medium border border-transparent focus:border-gray-200" 
                value={q.text} onChange={e => handleUpdate(qIdx, null, e.target.value)} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${opt.isCorrect ? 'border-green-400 bg-green-50/50' : 'border-gray-50 bg-white'}`}>
                    <button onClick={() => handleUpdate(qIdx, oIdx, null, false)} className={`${opt.isCorrect ? "text-green-500" : "text-gray-200"} hover:scale-110 active:scale-90 transition-all`}>
                      <IoCheckmarkCircle size={26} />
                    </button>
                    <input type="text" placeholder={`Variant ${oIdx + 1}`} className="bg-transparent outline-none text-sm w-full font-medium" 
                      value={opt.text} onChange={e => handleUpdate(qIdx, oIdx, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <button onClick={addNewQuestion} className="flex-1 py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold hover:border-purple-300 hover:text-purple-500 transition-all flex items-center justify-center gap-2">
            <IoAddCircleOutline size={22} /> Savol qo'shish
          </button>
          <button onClick={saveTest} className="flex-[1.5] py-4 bg-[#B23DEB] text-white rounded-lg font-black  shadow-purple-100 hover:bg-[#9a32cc] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
            <IoCloudUploadOutline size={22} /> Testni bazaga yuklash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;