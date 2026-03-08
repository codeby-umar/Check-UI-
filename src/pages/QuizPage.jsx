import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { Timer, ChevronRight, BrainCircuit, Maximize } from "lucide-react";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scoreRef = useRef(0);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // --- FULLSCREEN ---
  const startQuiz = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  // --- FINISH QUIZ ---
  const finishQuiz = async (finalScore = scoreRef.current, status = "Completed") => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const totalQuestions = test?.questions?.length || 1;
    const percent = Math.round((finalScore / totalQuestions) * 100);

    try {
      await addDoc(collection(db, "results"), {
        userId: auth.currentUser?.uid || "anonymous",
        testId: id,
        testTitle: test?.title || "Noma'lum Test",
        score: percent,
        correctAnswers: finalScore,
        totalQuestions: test?.questions?.length || 0,
        date: new Date(),
        status: status
      });
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  };

  // --- SECURITY LOGIC ---
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    const forceTerminate = async (reason) => {
      if (!isFinishedRef.current && test && isFullscreen) {
        await finishQuiz(scoreRef.current, `Terminated: ${reason}`);
        alert(`Test to'xtatildi! Sabab: ${reason}`);
        navigate("/dashboard");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isFinishedRef.current && isFullscreen) {
        forceTerminate("To'liq ekran rejimidan chiqildi");
      }
    };

    const handleBlur = () => {
      if (!isFinishedRef.current && isFullscreen) {
        forceTerminate("Sahifa tark etildi (Tab switch)");
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [test, isFullscreen, navigate]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const docRef = doc(db, "tests", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.questions) {
            data.questions = data.questions.map(q => ({
              ...q,
              options: shuffleArray(q.options)
            }));
          }
          setTest(data);
          setTimeLeft(data.timeLimit * 60); 
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchTestData();
  }, [id]);

  // --- TIMER ---
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isFinished && isFullscreen) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && test && !isFinished && isFullscreen) {
      finishQuiz(scoreRef.current, "Time Expired");
    }
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, test, isFullscreen]);

  const handleAnswer = (isCorrect) => {
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);
    
    if (currentIdx + 1 < test.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz(nextScore, "Completed");
    }
  };

  if (!test) return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <BrainCircuit className="text-[#B23DEB] animate-spin" size={60} />
      <p className="text-[#B23DEB] font-black tracking-widest animate-pulse uppercase">Yuklanmoqda...</p>
    </div>
  );

  if (!isFullscreen && !isFinished) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] border border-white/10 p-10 rounded-sm text-center shadow-2xl animate-fade-in">
          <Maximize className="text-[#B23DEB] mb-6 mx-auto" size={48} />
          <h2 className="text-2xl font-black text-white mb-4 uppercase italic">Testni Boshlash</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Test boshlanganda Sidebar va menyular bloklanadi. To'liq ekran rejimidan chiqish testni bekor qiladi.
          </p>
          <button 
            onClick={startQuiz}
            className="w-full py-4 bg-[#B23DEB] text-white font-black rounded-lg hover:scale-105 transition-transform uppercase tracking-widest shadow-[0_0_20px_rgba(178,61,235,0.4)]"
          >
            Kirish va Boshlash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9998] h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 flex flex-col items-center select-none custom-scrollbar">
      {!isFinished ? (
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B23DEB] rounded-lg flex items-center justify-center text-white font-black text-xl">
                {currentIdx + 1}
              </div>
              <div className="hidden sm:block">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Savol</p>
                <div className="flex gap-1 mt-1">
                  {test.questions.map((_, i) => (
                    <div key={`prog-${i}`} className={`h-1 rounded-full transition-all duration-500 ${i <= currentIdx ? 'w-4 bg-[#B23DEB]' : 'w-1 bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all ${timeLeft < 30 ? 'border-red-500 animate-pulse text-red-500' : 'border-[#B23DEB]/30 text-white'}`}>
              <Timer size={20} />
              <span className="text-xl font-mono font-black">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 md:p-16 shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-12">
              {test.questions[currentIdx].text}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {test.questions[currentIdx].options.map((opt, i) => (
                <button 
                  key={`opt-${i}`} 
                  onClick={() => handleAnswer(opt.isCorrect)}
                  className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-[#B23DEB] hover:border-[#B23DEB] transition-all duration-300 text-left"
                >
                  <span className="text-lg font-bold text-gray-300 group-hover:text-white">{opt.text}</span>
                  <ChevronRight className="text-gray-600 group-hover:text-white transform group-hover:translate-x-2 transition-all" size={24} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl animate-scale-up mt-10 text-center">
          <div className="bg-[#111] border border-white/10 p-16 rounded-3xl backdrop-blur-3xl">
            <h2 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Natija Tayyor!</h2>
            <div className="text-9xl font-black text-white my-10 drop-shadow-[0_0_30px_rgba(178,61,235,0.5)]">
              {Math.round((score / (test?.questions?.length || 1)) * 100)}<span className="text-[#B23DEB] text-4xl">%</span>
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-full py-6 bg-[#B23DEB] text-white rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all shadow-lg"
            >
              Dashboardga qaytish
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media print { body { display: none !important; } }
        .select-none { user-select: none; -webkit-user-select: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default QuizPage;