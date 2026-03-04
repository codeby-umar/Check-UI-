import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { Timer, HelpCircle, ChevronRight, Trophy, LayoutDashboard, BrainCircuit, Rocket } from "lucide-react";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      const docRef = doc(db, "tests", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTest(data);
        setTimeLeft(data.timeLimit * 60); 
      }
    };
    fetchTestData();
  }, [id]);

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

  const finishQuiz = async (finalScore = score) => {
    setIsFinished(true);
    const percent = Math.round((finalScore / test.questions.length) * 100);

    try {
      await addDoc(collection(db, "results"), {
        userId: auth.currentUser.uid,
        testTitle: test.title,
        score: percent,
        correctAnswers: finalScore,
        totalQuestions: test.questions.length,
        date: new Date()
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
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 custom-scrollbar flex flex-col items-center">
      
      {!isFinished ? (
        <div className="w-full max-w-4xl animate-fade-in">
          
          {/* 1. Header: Info & Timer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
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

          {/* 2. Question Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-white/[0.02] -rotate-12">
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
                  className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-[#B23DEB] hover:border-[#B23DEB] hover:shadow-[0_10px_30px_rgba(178,61,235,0.3)] transition-all duration-300 text-left"
                >
                  <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{opt.text}</span>
                  <ChevronRight className="text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-2" size={24} />
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-center text-gray-600 text-[10px] mt-8 uppercase font-black tracking-[0.5em]">
            Cyber-Battle Protocol Alpha-7
          </p>

        </div>
      ) : (
        /* 3. Result View */
        <div className="w-full max-w-xl animate-scale-up mt-10">
          <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] backdrop-blur-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#B23DEB]/10 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
                <Trophy className="text-yellow-500" size={48} />
              </div>
              
              <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Natija Yakunlandi!</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10">Sizning umumiy natijangiz</p>

              <div className="relative inline-block mb-12">
                 <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(178,61,235,0.5)]">
                   {Math.round((score / test.questions.length) * 100)}<span className="text-[#B23DEB] text-4xl">%</span>
                 </div>
                 <div className="absolute -right-8 -top-4 bg-emerald-500 text-[#0a0a0a] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                   Passed
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-gray-500 text-[10px] font-black uppercase mb-1">To'g'ri</p>
                    <p className="text-2xl font-black text-white">{score}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Xato</p>
                    <p className="text-2xl font-black text-red-500">{test.questions.length - score}</p>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center gap-3 w-full py-6 bg-[#B23DEB] text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(178,61,235,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm group"
                >
                  <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                  Dashboardga qaytish
                </button>
                <button 
                   onClick={() => window.location.reload()}
                   className="flex items-center justify-center gap-3 w-full py-6 bg-white/5 text-gray-400 rounded-[2rem] font-black border border-white/10 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-sm"
                >
                  <Rocket size={20} />
                  Qayta urinish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scale-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default QuizPage;