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
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
         <div className="animate-pulse flex flex-col items-center gap-4">
            <Trophy className="text-[#B23DEB]" size={60} />
            <p className="text-[#B23DEB] font-black tracking-widest uppercase">Reyting Yuklanmoqda...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-8 md:p-12 custom-scrollbar">
      
      {/* 1. Header Card */}
      <div className="bg-gradient-to-br from-[#B23DEB] via-[#8a2eb8] to-[#6a1b9a] rounded-[3rem] p-10 text-white shadow-[0_20px_50px_rgba(178,61,235,0.3)] mb-16 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-6 animate-bounce">
            <Trophy className="text-yellow-400" size={50} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Hall of <span className="text-yellow-300">Fame</span></h1>
          <p className="opacity-80 mt-3 font-medium tracking-wide max-w-md">Platformamizning eng kuchli bilimdonlari va yetakchilari ro'yxati.</p>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      {/* 2. Top 3 Podium Section */}
      <div className="flex items-end justify-center gap-4 md:gap-8 mb-16 px-4">
        
        {/* 2nd Place */}
        {leaders[1] && (
          <div className="flex flex-col items-center flex-1 max-w-[200px] bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] h-52 relative transition-all hover:bg-white/[0.05]">
            <div className="relative mb-3">
               <img src={leaders[1].photoURL || `https://ui-avatars.com/api/?name=${leaders[1].name}&background=silver&color=fff`} className="w-16 h-16 rounded-2xl border-2 border-gray-400 object-cover" alt="2nd" />
               <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">2</div>
            </div>
            <span className="text-sm font-bold text-gray-300 truncate w-full text-center">{leaders[1].name}</span>
            <span className="text-gray-500 font-black text-xl">{leaders[1].score}</span>
            <div className="mt-auto text-[10px] font-black text-gray-500 tracking-widest">SILVER</div>
          </div>
        )}

        {/* 1st Place (Winner) */}
        {leaders[0] && (
          <div className="flex flex-col items-center flex-1 max-w-[240px] bg-white/[0.05] border border-[#B23DEB]/30 p-8 rounded-[3rem] h-64 relative transform -translate-y-6 shadow-[0_15px_40px_rgba(178,61,235,0.2)]">
            <Crown className="absolute -top-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={45} />
            <div className="relative mb-4 scale-110">
               <img src={leaders[0].photoURL || `https://ui-avatars.com/api/?name=${leaders[0].name}&background=EAB308&color=fff`} className="w-20 h-20 rounded-3xl border-4 border-yellow-500/50 object-cover shadow-2xl" alt="1st" />
               <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black">1</div>
            </div>
            <span className="text-lg font-black text-white truncate w-full text-center">{leaders[0].name}</span>
            <span className="text-[#B23DEB] font-black text-3xl drop-shadow-[0_0_10px_#B23DEB]">{leaders[0].score}</span>
            <div className="mt-auto text-yellow-500 text-[11px] font-black tracking-[0.2em]">CHAMPION</div>
          </div>
        )}

        {/* 3rd Place */}
        {leaders[2] && (
          <div className="flex flex-col items-center flex-1 max-w-[200px] bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] h-48 relative transition-all hover:bg-white/[0.05]">
            <div className="relative mb-3">
               <img src={leaders[2].photoURL || `https://ui-avatars.com/api/?name=${leaders[2].name}&background=cd7f32&color=fff`} className="w-14 h-14 rounded-2xl border-2 border-orange-500/50 object-cover" alt="3rd" />
               <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">3</div>
            </div>
            <span className="text-sm font-bold text-gray-300 truncate w-full text-center">{leaders[2].name}</span>
            <span className="text-gray-500 font-black text-xl">{leaders[2].score}</span>
            <div className="mt-auto text-[10px] font-black text-orange-600 tracking-widest">BRONZE</div>
          </div>
        )}
      </div>

      {/* 3. List Section */}
      <div className="max-w-5xl mx-auto space-y-4 pb-20">
        {leaders.map((user, index) => {
          const isMe = currentUser?.uid === user.id;

          return (
            <div 
              key={user.id} 
              className={`group flex items-center justify-between p-6 rounded-3xl transition-all duration-300 border backdrop-blur-sm ${
                isMe 
                ? 'bg-[#B23DEB]/10 border-[#B23DEB]/50 shadow-[0_0_20px_rgba(178,61,235,0.1)]' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-6">
                <span className={`w-8 font-black text-xl ${index < 3 ? 'text-[#B23DEB]' : 'text-gray-700'}`}>
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                
                <div className="relative">
                   <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="avatar" />
                   {isMe && <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#B23DEB] rounded-full border-2 border-[#0a0a0a] animate-pulse"></div>}
                </div>

                <div>
                  <h4 className={`text-lg font-black tracking-tight ${isMe ? 'text-white' : 'text-gray-300'}`}>
                    {user.name} {isMe && <span className="text-[#B23DEB] ml-2 text-xs italic">(Siz)</span>}
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5">
                      <Zap size={12} className="text-yellow-500 fill-yellow-500" /> 
                      {user.testsCompleted || 0} Testlar
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5">
                      <Star size={12} className="text-[#B23DEB]" /> 
                      XP: {user.score * 10}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className={`text-3xl font-black ${isMe ? 'text-[#B23DEB]' : 'text-white'}`}>{user.score}</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Umumiy Ball</p>
                </div>
                {index < 3 && (
                   <div className={`p-2 rounded-xl ${index === 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-400'}`}>
                      <Medal size={28} />
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollbar CSS */}
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