import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { 
  collection, addDoc, query, orderBy, 
  onSnapshot, serverTimestamp, doc, deleteDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase'; 

const LivingChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);

  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const getUserName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return `User_${currentUser?.uid?.substring(0, 4) || 'Anon'}`;
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const name = getUserName();
      await addDoc(collection(db, "messages"), {
        text: message.trim(),
        uid: currentUser?.uid || 'anon',
        displayName: name,
        createdAt: serverTimestamp(),
      });
      setMessage(''); 
    } catch (error) {
      console.error("Chat Logic Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xabarni butunlay o'chirish?")) {
      await deleteDoc(doc(db, "messages", id));
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#050505] text-slate-300 font-sans border-l border-white/5">
      
      {/* Header */}
      <div className="px-6 py-5 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#B23DEB] rounded-full shadow-[0_0_12px_#B23DEB] animate-pulse"></div>
          <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/80">
             Global<span className="text-[#B23DEB]">Chat</span>
          </h3>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/5 border border-red-500/20 rounded-full">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            <span className="text-[9px] text-red-500 font-black tracking-widest uppercase">Root Access</span>
          </div>
        )}
      </div>

      {/* Message Feed */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#B23DEB08,_transparent_40%)]"
      >
        {chatHistory.map((msg) => {
          const isMe = msg.uid === currentUser?.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
              
              {/* Sender Name - Har doim tepada va kichik */}
              <span className={`text-[10px] font-bold tracking-wider mb-1.5 px-1 ${isMe ? 'text-[#B23DEB]' : 'text-slate-500'}`}>
                {isMe ? 'Siz' : msg.displayName}
              </span>

              <div className={`relative max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex flex-row-reverse' : 'flex-row'} items-center gap-3`}>
                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all duration-300 ${
                  isMe 
                  ? 'bg-[#B23DEB] text-white rounded-tr-none shadow-lg shadow-[#B23DEB]/10' 
                  : 'bg-[#111111] border border-white/5 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Admin Action */}
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                    title="Xabarni o'chirish"
                  >
                    <FiTrash2 size={15} />
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[8px] text-slate-700 mt-1.5 font-medium tracking-tighter uppercase px-1">
                {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Terminal */}
      <div className="p-5 bg-[#0A0A0A] border-t border-white/5">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-[#111] border border-white/10 p-2 rounded-2xl focus-within:border-[#B23DEB]/40 focus-within:bg-[#141414] transition-all">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabar yo'llash..." 
              className="bg-transparent border-none outline-none text-slate-200 text-sm w-full py-2 px-3 placeholder:text-slate-800"
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              className="bg-[#B23DEB] text-white p-3 rounded-xl hover:bg-[#9b34cd] hover:shadow-[0_0_15px_#B23DEB44] transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
              <FiSend size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-3 px-2">
            <span className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em]">
              Auth: <span className="text-slate-500">{getUserName()}</span>
            </span>
            <span className="text-[9px] text-slate-800 font-mono tracking-widest">v2.4.0-STABLE</span>
          </div>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB22; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB44; }
      `}</style>
    </div>
  );
};

export default LivingChat;