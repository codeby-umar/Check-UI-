import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase'; 

const LivingChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // try-catch qo'shildi xatoni ko'rish uchun
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatHistory(msgs);
      }, (error) => {
        // AGAR SHU YERDA XATO CHIQSA, KONSOOLDA KO'RASAN
        console.error("FIREBASE ERROR:", error.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.log("Qidiruvda xato:", e);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const currentUser = auth.currentUser;
      
      // Xabar yuborishdan oldin obyektni tayyorlab olamiz
      const newMessage = {
        text: message.trim(),
        uid: currentUser?.uid || 'guest_' + Math.random().toString(36).substr(2, 9),
        displayName: currentUser?.displayName || 'Mehmon',
        photoURL: currentUser?.photoURL || '',
        createdAt: serverTimestamp(),
      };

      setMessage(''); // Inputni srazu tozalash
      await addDoc(collection(db, "messages"), newMessage);
    } catch (error) {
      console.error("YUBORISHDA XATO:", error);
      alert("Xabar ketmadi! Konsolni tekshir.");
    }
  };

  return (
    <div className="flex h-150 flex-col bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/5 bg-white/2">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-[#B23DEB] rounded-full animate-pulse shadow-[0_0_10px_#B23DEB]"></span>
          Global Chat
        </h3>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {chatHistory.length === 0 && (
          <p className="text-gray-600 text-center text-sm mt-10">Hozircha xabarlar yo'q...</p>
        )}
        
        {chatHistory.map((msg) => {
          const isMe = msg.uid === auth.currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                isMe ? 'bg-[#B23DEB] text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'
              }`}>
                {!isMe && <p className="text-[10px] font-bold text-[#B23DEB] mb-1">{msg.displayName}</p>}
                <p className="break-words">{msg.text}</p>
                <p className="text-[8px] opacity-30 mt-1 text-right">
                  {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-[#111] border-t border-white/5">
        <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10  p-2 focus-within:border-[#B23DEB]/50 transition-all">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar..." 
            className="bg-transparent border-none outline-none text-white text-sm w-full py-1 px-2"
          />
          <button type="submit" className="bg-[#B23DEB] text-white p-2 rounded-lg hover:opacity-80 active:scale-90">
            <FiSend size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LivingChat;