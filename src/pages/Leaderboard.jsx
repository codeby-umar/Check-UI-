import React, { useEffect, useState } from 'react';
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { Trophy, Medal, Crown, Zap, Star } from 'lucide-react';

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"), 
      orderBy("score", "desc"), 
      limit(20) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
         <div className="animate-pulse flex flex-col items-center gap-4">
            <Trophy className="text-[#B23DEB]" size={60} />
            <p className="text-[#B23DEB] font-black tracking-widest uppercase text-sm">Reyting Yuklanmoqda...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-4 md:p-12 custom-scrollbar">
      
      {/* 1. Header Card */}
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#B23DEB] via-[#8a2eb8] to-[#6a1b9a] p-10 text-white  mb-16 relative overflow-hidden group rounded-sm">
        <div className="relative z-10 flex flex-col items-center text-center">
      
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-center">Hall of <span className="text-yellow-300">Fame</span></h1>
          <p className="opacity-80 mt-3 font-medium tracking-wide max-w-md text-center text-sm md:text-base">Platformamizning eng kuchli bilimdonlari va yetakchilari ro'yxati.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
      </div>

      {leaders.length > 0 && (
        <div className="flex items-end justify-center gap-2 md:gap-8 mb-16 px-2 max-w-4xl mx-auto">
          
          {/* 2nd Place */}
          {leaders[1] && (
            <div className="flex flex-col items-center flex-1 max-w-[200px] bg-white/[0.03] border border-white/10 p-4 md:p-6 rounded-[2rem] h-48 md:h-52 relative transition-all hover:bg-white/[0.05]">
              <div className="relative mb-3">
                 <img src={leaders[1].photoURL || `https://ui-avatars.com/api/?name=${leaders[1].name || 'User'}&background=silver&color=fff`} className="w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-gray-400 object-cover" alt="2nd" />
                 <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px]">2</div>
              </div>
              <span className="text-[10px] md:text-sm font-bold text-gray-300 truncate w-full text-center">{leaders[1].name}</span>
              <span className="text-gray-500 font-black text-lg md:text-xl">{leaders[1].score || 0}</span>
              <div className="mt-auto text-[8px] md:text-[10px] font-black text-gray-500 tracking-widest uppercase">Silver</div>
            </div>
          )}

          {/* 1st Place (Winner) */}
          {leaders[0] && (
            <div className="flex flex-col items-center flex-1 max-w-[240px] bg-white/[0.05] border border-[#B23DEB]/30 p-6 md:p-8 rounded-[2.5rem] h-56 md:h-64 relative transform -translate-y-6 shadow-[0_15px_40px_rgba(178,61,235,0.2)]">
              <Crown className="absolute -top-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={45} />
              <div className="relative mb-4 scale-105 md:scale-110">
                 <img src={leaders[0].photoURL || `https://ui-avatars.com/api/?name=${leaders[0].name || 'User'}&background=EAB308&color=fff`} className="w-16 h-16 md:w-20 md:h-20 rounded-3xl border-4 border-yellow-500/50 object-cover shadow-2xl" alt="1st" />
                 <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs">1</div>
              </div>
              <span className="text-sm md:text-lg font-black text-white truncate w-full text-center">{leaders[0].name}</span>
              <span className="text-[#B23DEB] font-black text-2xl md:text-3xl drop-shadow-[0_0_10px_#B23DEB]">{leaders[0].score || 0}</span>
              <div className="mt-auto text-yellow-500 text-[9px] md:text-[11px] font-black tracking-[0.2em] uppercase">Champion</div>
            </div>
          )}

          {/* 3rd Place */}
          {leaders[2] && (
            <div className="flex flex-col items-center flex-1 max-w-[200px] bg-white/[0.03] border border-white/10 p-4 md:p-6 rounded-[2rem] h-44 md:h-48 relative transition-all hover:bg-white/[0.05]">
              <div className="relative mb-3">
                 <img src={leaders[2].photoURL || `https://ui-avatars.com/api/?name=${leaders[2].name || 'User'}&background=cd7f32&color=fff`} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-orange-500/50 object-cover" alt="3rd" />
                 <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px]">3</div>
              </div>
              <span className="text-[10px] md:text-sm font-bold text-gray-300 truncate w-full text-center">{leaders[2].name}</span>
              <span className="text-gray-500 font-black text-lg md:text-xl">{leaders[2].score || 0}</span>
              <div className="mt-auto text-[8px] md:text-[10px] font-black text-orange-600 tracking-widest uppercase">Bronze</div>
            </div>
          )}
        </div>
      )}

      {/* 3. List Section */}
      <div className="max-w-5xl mx-auto space-y-4 pb-20">
        {leaders.length > 0 ? (
          leaders.map((user, index) => {
            const isMe = currentUser?.uid === user.id;

            return (
              <div 
                key={user.id} 
                className={`group flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl transition-all duration-300 border backdrop-blur-sm ${
                  isMe 
                  ? 'bg-[#B23DEB]/10 border-[#B23DEB]/50 shadow-[0_0_20px_rgba(178,61,235,0.1)]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-6">
                  <span className={`w-6 md:w-8 font-black text-sm md:text-xl ${index < 3 ? 'text-[#B23DEB]' : 'text-gray-700'}`}>
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  
                  <div className="relative shrink-0">
                     <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name || 'User'}`} className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover border border-white/10" alt="avatar" />
                     {isMe && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#B23DEB] rounded-full border-2 border-[#0a0a0a] animate-pulse"></div>}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm md:text-lg font-black tracking-tight truncate ${isMe ? 'text-white' : 'text-gray-300'}`}>
                      {user.name} {isMe && <span className="text-[#B23DEB] ml-1 text-[10px] italic">(Siz)</span>}
                    </h4>
                    <div className="flex items-center gap-2 md:gap-4 mt-1">
                      <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1">
                        <Zap size={10} className="text-yellow-500 fill-yellow-500" /> 
                        {user.testsCompleted || 0}
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1">
                        <Star size={10} className="text-[#B23DEB]" /> 
                        XP: {(user.score || 0) * 10}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-8 shrink-0">
                  <div className="text-right">
                    <p className={`text-xl md:text-3xl font-black ${isMe ? 'text-[#B23DEB]' : 'text-white'}`}>{user.score || 0}</p>
                    <p className="text-[8px] md:text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Ball</p>
                  </div>
                  {index < 3 && (
                     <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${index === 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-400'}`}>
                        <Medal size={20} className="md:w-7 md:h-7" />
                     </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest">Hali hech kim yo'q</div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Leaderboard;