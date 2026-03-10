import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, where, serverTimestamp, setDoc, doc, limit, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { 
  IoAddCircleOutline, IoTrashOutline, IoCheckmarkCircle, 
  IoCloudUploadOutline, IoTimeOutline, IoShieldCheckmarkOutline, 
  IoCloseOutline, IoChatbubblesOutline, IoSendOutline, IoBookOutline, IoImageOutline,
  IoPersonRemoveOutline
} from "react-icons/io5";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@gmail.com";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMsg, setPrivateMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);

  // Test Creator States (SAQLANDI)
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [subject, setSubject] = useState("Rus tili");
  const [imageUrl, setImageUrl] = useState(""); 
  const [questions, setQuestions] = useState([
    { text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }
  ]);

  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        lastSeen: serverTimestamp()
      }, { merge: true });

      const q = query(collection(db, "users"), orderBy("lastSeen", "desc"), limit(50));
      return onSnapshot(q, (snap) => {
        setUsers(snap.docs.map(doc => doc.data()).filter(u => u.uid !== user.uid));
      });
    }
  }, [user]);

  // ASOSIY CHAT LOGIKASI - ADMINGA HAMMA XABAR KELADI
  useEffect(() => {
    if (!selectedUser || !user) return;
    
    let q;
    if (isAdmin) {
      // ADMIN: Bazadagi oxirgi 500 ta xabarni filtrsiz olish (Spy Mode)
      q = query(collection(db, "private_messages"), orderBy("createdAt", "asc"), limit(500));
    } else {
      // USER: Faqat o'ziga tegishli chatId bo'yicha olish
      const combinedId = [user.uid, selectedUser.uid].sort().join("_");
      q = query(collection(db, "private_messages"), where("chatId", "==", combinedId), orderBy("createdAt", "asc"));
    }

    const unsub = onSnapshot(q, (snap) => {
      let msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isAdmin) {
        // Admin tanlagan user ishtirok etgan barcha suhbatlarni ko'rsatish
        msgs = msgs.filter(m => m.from === selectedUser.uid || m.to === selectedUser.uid);
      }
      setChatHistory(msgs);
    });
    return () => unsub();
  }, [selectedUser, user, isAdmin]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  const deleteMessage = async (id) => {
    if (isAdmin && window.confirm("Xabarni o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "private_messages", id));
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!privateMsg.trim() || !selectedUser) return;
    
    const combinedId = [user.uid, selectedUser.uid].sort().join("_");
    const msgData = {
      text: privateMsg, 
      from: user.uid, 
      fromName: user.displayName || user.email.split('@')[0],
      to: selectedUser.uid, 
      toName: selectedUser.name, 
      chatId: combinedId, 
      createdAt: serverTimestamp(),
    };
    
    setPrivateMsg("");
    try { await addDoc(collection(db, "private_messages"), msgData); } catch (err) { console.log(err); }
  };

  // Test Creator Funksiyalari (SAQLANDI)
  const addNewQuestion = () => setQuestions([...questions, { text: "", options: Array(4).fill(0).map((_, i) => ({ text: "", isCorrect: i === 0 })) }]);
  const handleUpdate = (qIdx, oIdx, val, isText = true) => {
    const newQuestions = [...questions];
    if (isText) oIdx === null ? newQuestions[qIdx].text = val : newQuestions[qIdx].options[oIdx].text = val;
    else newQuestions[qIdx].options.forEach((opt, i) => opt.isCorrect = i === oIdx);
    setQuestions(newQuestions);
  };
  const saveTest = async () => {
    if (!title || !questions[0].text) return alert("To'ldiring!");
    try {
      await addDoc(collection(db, "tests"), { title, timeLimit, subject, imageUrl, questions, createdAt: new Date(), author: user.email });
      alert("Test muvaffaqiyatli yuklandi!"); 
      setIsModalOpen(false);
      setTitle("");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden text-white font-sans">
      
      {/* NAVBAR */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111] z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#B23DEB] rounded-xl flex items-center justify-center font-black italic shadow-[0_0_20px_#B23DEB44]">BT</div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Chat <span className="text-[#B23DEB]">{isAdmin ? "Spy_Monitor" : "Panel"}</span>
          </h1>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-[#B23DEB] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#9b34cd] transition-all shadow-[0_0_15px_#B23DEB44]">
            Yangi Test Yaratish
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* USERS LIST */}
        <div className="w-20 md:w-80 bg-[#080808] border-r border-white/5 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {users.map(u => (
            <button key={u.uid} onClick={() => setSelectedUser(u)} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${selectedUser?.uid === u.uid ? 'bg-[#B23DEB]/10 border-[#B23DEB]/30' : 'border-transparent hover:bg-white/5'}`}>
              <div className="w-11 h-11 bg-[#151515] rounded-xl border border-white/10 flex items-center justify-center font-bold text-[#B23DEB]">{u.name[0].toUpperCase()}</div>
              <div className="hidden md:block text-left truncate">
                <p className="text-sm font-black truncate">{u.name}</p>
                <p className="text-[8px] text-emerald-500 font-black uppercase">Online</p>
              </div>
            </button>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          {selectedUser ? (
            <div className="flex-1 flex flex-col p-4 md:p-10 max-w-5xl mx-auto w-full overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#B23DEB]">{selectedUser.name}</h3>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest italic">{isAdmin ? "LIVE_MONITORING_ACTIVE" : "SECURE_CONNECTION"}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 bg-white/5 rounded-full"><IoCloseOutline size={20}/></button>
              </div>

              {/* MESSAGES */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatHistory.map(m => (
                  <div key={m.id} className={`flex flex-col group ${m.from === user.uid ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {isAdmin && (
                        <button onClick={() => deleteMessage(m.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all"><IoTrashOutline size={14}/></button>
                      )}
                      <span className="text-[7px] text-gray-600 font-black uppercase">
                        {m.fromName} → {m.toName}
                      </span>
                    </div>
                    <div className={`px-5 py-3 rounded-2xl text-sm max-w-[80%] ${m.from === user.uid ? 'bg-[#B23DEB] text-white rounded-tr-none' : 'bg-[#111] border border-white/5 text-gray-300 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT AREA */}
              <form onSubmit={sendMsg} className="mt-6 flex gap-3 p-3 bg-[#111] rounded-[2rem] border border-white/10">
                <input type="text" className="flex-1 bg-transparent border-none outline-none px-6 text-sm" placeholder={isAdmin ? "Admin nomidan javob..." : "Xabar..."} value={privateMsg} onChange={(e) => setPrivateMsg(e.target.value)} />
                <button type="submit" className="w-12 h-12 bg-[#B23DEB] rounded-full flex items-center justify-center"><IoSendOutline size={18}/></button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
              <IoChatbubblesOutline size={120} className="text-[#B23DEB] mb-4 animate-pulse" />
              <p className="text-xl font-black uppercase tracking-[0.4em] italic">Select_User_to_Spy</p>
            </div>
          )}
        </div>
      </div>

      {/* TEST CREATOR MODAL (SAQLANDI) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0a0a0a] w-full max-w-6xl h-[90vh] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden animate-zoomIn shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#111]">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#B23DEB]">Creator <span className="text-white">Studio</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 transition-all"><IoCloseOutline size={30}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">
                  <input type="text" placeholder="TEST SARLAVHASI..." className="w-full px-8 py-6 bg-[#111] border border-white/5 rounded-[2rem] outline-none text-white focus:border-[#B23DEB]/40 font-black uppercase text-xs tracking-widest" value={title} onChange={e => setTitle(e.target.value)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select className="w-full px-8 py-5 bg-[#111] border border-white/5 rounded-3xl outline-none text-gray-400 font-black uppercase text-[10px] tracking-widest appearance-none" value={subject} onChange={e => setSubject(e.target.value)}>
                      <option value="Rus tili">Rus tili</option>
                      <option value="Ingliz tili">Ingliz tili</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Dasturlash">Dasturlash</option>
                    </select>
                    <input type="text" placeholder="IMAGE URL..." className="w-full px-8 py-5 bg-[#111] border border-white/5 rounded-3xl outline-none text-white focus:border-[#B23DEB]/40 font-black uppercase text-[10px] tracking-widest" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                  </div>
                </div>
                <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] text-center flex flex-col justify-center border-b-4 border-[#B23DEB]">
                  <IoTimeOutline size={30} className="text-[#B23DEB] mx-auto mb-2" />
                  <input type="number" className="bg-transparent text-5xl font-black text-white text-center w-full outline-none italic" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} />
                  <p className="text-[10px] font-black text-gray-600 uppercase mt-2 tracking-widest">Minut_Limit</p>
                </div>
              </div>
              <div className="space-y-10 pb-20">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-10 bg-[#111] border border-white/5 rounded-[2.5rem] relative group hover:border-[#B23DEB]/20 transition-all">
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black italic rounded-xl text-xl shadow-2xl">{qIdx + 1}</div>
                      {questions.length > 1 && <button onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} className="text-red-500 hover:scale-125 transition-all"><IoTrashOutline size={20}/></button>}
                    </div>
                    <textarea placeholder="Savol matnini kiriting..." className="w-full p-8 bg-white/5 border border-white/10 rounded-2xl mb-8 outline-none text-white italic text-lg focus:border-white/20 transition-all" value={q.text} onChange={e => handleUpdate(qIdx, null, e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${opt.isCorrect ? 'border-[#B23DEB] bg-[#B23DEB]/10 shadow-[0_0_15px_#B23DEB22]' : 'border-white/5'}`}>
                          <button onClick={() => handleUpdate(qIdx, oIdx, null, false)} className={`transition-transform ${opt.isCorrect ? "text-[#B23DEB] scale-110" : "text-gray-600 hover:text-gray-400"}`}><IoCheckmarkCircle size={28} /></button>
                          <input type="text" placeholder={`Variant ${oIdx + 1}`} className="bg-transparent outline-none text-xs font-black uppercase w-full tracking-widest text-gray-300" value={opt.text} onChange={e => handleUpdate(qIdx, oIdx, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t border-white/5 bg-[#111] flex gap-4">
              <button onClick={addNewQuestion} className="flex-1 py-5 bg-[#1a1a1a] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-white/5"><IoAddCircleOutline size={18}/> Savol Qo'shish</button>
              <button onClick={saveTest} className="flex-[1.5] py-5 bg-[#B23DEB] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_30px_#B23DEB88] transition-all"><IoCloudUploadOutline size={18}/> Bazaga Yuklash</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB33; border-radius: 10px; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Profile;