import React, { useEffect, useState } from 'react';
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Crown, ArrowUp } from 'lucide-react';

const Leaderboard = () => {
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
      <div className="flex justify-center items-center h-screen text-[#B23DEB] font-bold">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-[#B23DEB] rounded-3xl p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black flex items-center gap-2">
              <Trophy className="text-yellow-300" size={32} />
              Leaderboard
            </h1>
            <p className="opacity-80 mt-2">Eng yaxshi natija ko'rsatgan foydalanuvchilar</p>
          </div>
          {/* Bezak uchun abstrakt doira */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Top 3 Talents (Card view) */}
        <div className="grid grid-cols-3 gap-4 mb-8 items-end">
          {leaders.slice(0, 3).map((user, index) => (
            <div key={user.id} className={`flex flex-col items-center p-4 rounded-2xl shadow-sm ${
              index === 0 ? 'bg-white border-2 border-[#B23DEB] h-48' : 'bg-white h-40'
            }`}>
              <div className="relative">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} 
                  alt={user.name}
                  className={`rounded-full object-cover ${index === 0 ? 'w-20 h-20' : 'w-14 h-14'}`}
                />
                {index === 0 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500" size={30} />}
              </div>
              <p className="font-bold text-gray-800 mt-2 text-sm truncate w-full text-center">{user.name}</p>
              <p className={`font-black ${index === 0 ? 'text-[#B23DEB] text-xl' : 'text-gray-500'}`}>
                {user.score}
              </p>
            </div>
          ))}
        </div>

        {/* List Section */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          {leaders.map((user, index) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 font-bold text-lg ${index < 3 ? 'text-[#B23DEB]' : 'text-gray-400'}`}>
                  #{index + 1}
                </span>
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} 
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-xs text-gray-400">Yutuqlar: {user.achievements || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-bold text-gray-900">{user.score.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center justify-end">
                    <ArrowUp size={10} /> 12%
                  </p>
                </div>
                {index === 0 && <Medal className="text-yellow-500" size={20} />}
                {index === 1 && <Medal className="text-gray-400" size={20} />}
                {index === 2 && <Medal className="text-orange-400" size={20} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;