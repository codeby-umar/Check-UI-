import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

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
    if (isCorrect) setScore(score + 1);
    
    if (currentIdx + 1 < test.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz();
    }
  };


  const finishQuiz = async () => {
    setIsFinished(true);
    const percent = Math.round((score / test.questions.length) * 100);

    await addDoc(collection(db, "results"), {
      userId: auth.currentUser.uid,
      testTitle: test.title,
      score: percent,
      date: new Date()
    });
  };

  if (!test) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className=" p-6 flex items-center justify-center">
      {!isFinished ? (
        <div className=" p-10 rounded-sm bg-white w-full">
          <div className="flex justify-between mb-8">
            <span className="font-bold text-[#B23DEB]">Question:{currentIdx + 1}/{test.questions.length}</span>
            <span className="font-mono font-bold text-red-500">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-gray-800">{test.questions[currentIdx].text}</h2>
          
          <div className="grid gap-3">
            {test.questions[currentIdx].options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(opt.isCorrect)}
                className="p-4 border-2 border-gray-50 rounded-2xl hover:border-[#B23DEB] hover:bg-purple-50 transition-all text-left font-medium text-gray-700"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-sm shadow-sm text-center max-w-md w-full">
          <h2 className="text-3xl font-black text-gray-800 mb-2">Result</h2>
          <div className="text-6xl font-black text-[#B23DEB] mb-6">{Math.round((score / test.questions.length) * 100)}%</div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 bg-[#B23DEB] text-white rounded-2xl font-bold shadow-lg shadow-purple-100"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;