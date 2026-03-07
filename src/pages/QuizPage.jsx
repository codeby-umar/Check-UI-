import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { Timer, HelpCircle, ChevronRight, LayoutDashboard, BrainCircuit, Rocket, AlertTriangle } from "lucide-react";

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  // Score va holatni o'z vaqtida ushlab qolish uchun Ref'lar
  const scoreRef = useRef(0);
  const isFinishedRef = useRef(false);

  // Score o'zgarganda Refni yangilaymiz
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // --- QAT'IY XAVFSIZLIK LOGIKASI ---
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    
    const handleActionViolation = () => {
      setWarningCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 2) {
          // 2-urinishda darhol tugatish
          finishQuiz(scoreRef.current);
          alert("Xavfsizlik qoidalari buzilgani sababli test yakunlandi!");
        } else {
          alert("DIQQAT: Skrinshot olish yoki sahifadan chiqish taqiqlangan! Yana bir urinishda test bekor qilinadi.");
        }
        return newCount;
      });
    };

    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      // PrintScreen va skrinshot hotkeylari
      if (
        e.key === 'PrintScreen' || e.keyCode === 44 || e.keyCode === 123 ||
        (e.ctrlKey && (e.keyCode === 80 || e.keyCode === 83 || e.keyCode === 85)) || // P, S, U
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // I, J, C
        (isMac && e.metaKey && e.shiftKey && (e.keyCode === 51 || e.keyCode === 52 || e.keyCode === 53)) // Cmd+Shift+3/4/5
      ) {
        e.preventDefault();
        handleActionViolation();
      }
    };

    // Snipping Tool ochilganda yoki boshqa ilovaga o'tilganda (Focus yo'qolganda)
    const handleBlur = () => {
      // Blur bo'lganda darhol jazolash
      if (!isFinishedRef.current) {
        handleActionViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isFinishedRef.current) {
        handleActionViolation();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [test]); 

  // --- TEST MA'LUMOTLARINI OLISh ---
  useEffect(() => {
    const fetchTestData = async () => {
      const docRef = doc(db, "tests", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.questions) {
          data.questions = data.questions.map(question => ({
            ...question,
            options: shuffleArray(question.options)
          }));
        }
        setTest(data);
        setTimeLeft(data.timeLimit * 60); 
      }
    };
    fetchTestData();
  }, [id]);

  // --- TIMER ---
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && test && !isFinished) {
      finishQuiz();
    }
  }, [timeLeft, isFinished, test]);

  const handleAnswer = (isCorrect) => {
    let currentScore = score;
    if (isCorrect) {
      currentScore = score + 1;
      setScore(currentScore);
    }
    
    if (currentIdx + 1 < test.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz(currentScore);
    }
  };

  const finishQuiz = async (finalScore = scoreRef.current) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    const totalQuestions = test?.questions?.length || 1;
    const percent = Math.round((finalScore / totalQuestions) * 100);

    try {
      await addDoc(collection(db, "results"), {
        userId: auth.currentUser?.uid || "anonymous",
        testTitle: test?.title || "Noma'lum Test",
        score: percent,
        correctAnswers: finalScore,
        totalQuestions: test?.questions?.length || 0,
        date: new Date(),
        violations: warningCount + 1,
        status: warningCount >= 1 ? "Terminated" : "Completed"
      });
    } catch (e) {
      console.error("Xatolik natijani saqlashda: ", e);
    }
  };

  if (!test) return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <BrainCircuit className="text-[#B23DEB] animate-spin" size={60} />
      <p className="text-[#B23DEB] font-black tracking-[0.3em] uppercase animate-pulse">Test yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 custom-scrollbar flex flex-col items-center select-none no-print">
      
      {!isFinished ? (
        <div className="w-full max-w-4xl animate-fade-in">
          
          {warningCount > 0 && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500 text-red-500 text-center rounded-sm font-black text-sm uppercase flex items-center justify-center gap-3 animate-pulse">
              <AlertTriangle size={20} /> Ogohlantirish: {warningCount} / 2 - Test yakunlanishi mumkin!
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/2 border border-white/5 p-6 rounded-sm backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#B23DEB]/10 rounded-2xl flex items-center justify-center border border-[#B23DEB]/20">
                <span className="text-xl font-black text-[#B23DEB]">{currentIdx + 1}</span>
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-wider text-sm">Savol Progressi</h3>
                <div className="flex gap-1 mt-1">
                  {test.questions.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentIdx ? 'w-6 bg-[#B23DEB]' : 'w-2 bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border-2 transition-all duration-500 ${timeLeft < 30 ? 'border-red-500 animate-pulse bg-red-500/10' : 'border-[#B23DEB]/30 bg-[#B23DEB]/5'}`}>
              <Timer className={timeLeft < 30 ? 'text-red-500' : 'text-[#B23DEB]'} size={24} />
              <span className={`text-2xl font-mono font-black ${timeLeft < 30 ? 'text-red-500' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="bg-white/3 border border-white/5 rounded-sm p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-white/2 -rotate-12">
               <HelpCircle size={250} />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-12 relative z-10">
              {test.questions[currentIdx].text}
            </h2>
            
            <div className="grid grid-cols-1 gap-4 relative z-10">
              {test.questions[currentIdx].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(opt.isCorrect)}
                  className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-[#B23DEB] hover:border-[#B23DEB] hover:shadow-[0_10px_30px_rgba(178,61,235,0.3)] transition-all duration-300 text-left"
                >
                  <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{opt.text}</span>
                  <ChevronRight className="text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-2" size={24} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* NATIJA QISMI */
        <div className="w-full max-w-xl animate-scale-up mt-10">
          <div className="bg-white/2 border border-white/5 p-12 rounded-sm backdrop-blur-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#B23DEB]/10 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
                {warningCount >= 2 ? "Test To'xtatildi!" : "Natija Yakunlandi!"}
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10">
                {warningCount >= 2 ? "Xavfsizlik qoidasi buzildi" : "Sizning natijangiz"}
              </p>

              <div className="relative inline-block mb-12">
                 <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(178,61,235,0.5)]">
                   {Math.round((score / (test?.questions?.length || 1)) * 100)}<span className="text-[#B23DEB] text-4xl">%</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                    <p className="text-gray-500 text-[10px] font-black uppercase mb-1">To'g'ri</p>
                    <p className="text-2xl font-black text-white">{score}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                    <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Xato</p>
                    <p className="text-2xl font-black text-red-500">{test?.questions?.length - score}</p>
                 </div>
              </div>

              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-3 w-full py-6 bg-[#B23DEB] text-white rounded-sm font-black shadow-[0_20px_40px_rgba(178,61,235,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm group"
              >
                <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                Dashboardga qaytish
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print { body { display: none !important; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        .select-none { user-select: none; -webkit-user-select: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scale-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default QuizPage;