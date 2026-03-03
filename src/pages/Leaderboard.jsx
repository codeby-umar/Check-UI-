import React, { useEffect, useState } from 'react';
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext"; // AuthContext ni chaqiramiz
import { Trophy, Medal, Crown, ArrowUp, Zap } from 'lucide-react';

const Leaderboard = () => {
  const { user: currentUser } = useAuth(); // Hozirgi login qilgan odam
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eng ko'p ball to'plagan 10 ta foydalanuvchi
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
      <div className="flex justify-center items-center text-[#B23DEB] font-black text-xl">
         Reyting Yuklanmoqda ...
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-[#B23DEB] to-[#8a2eb8] rounded-[40px] p-8 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <Trophy className="text-yellow-300 mx-auto mb-4" size={50} />
          <h1 className="text-4xl font-black tracking-tight">Top Foydalanuvchilar</h1>
          <p className="opacity-90 mt-2 font-medium">Bilimlar jangi: Kim eng ko'p ball to'pladi?</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white opacity-10 rounded-full"></div>
      </div>

      <div className="flex items-end justify-center gap-2 md:gap-6 mb-12 px-2">
        {leaders[1] && (
          <div className="flex flex-col items-center flex-1 bg-white p-4 rounded-3xl shadow-sm border-b-4 border-gray-300 h-44">
            <img src={leaders[1].photoURL || `https://ui-avatars.com/api/?name=${leaders[1].name}`} className="w-14 h-14 rounded-full border-4 border-gray-100 object-cover mb-2" alt="2nd" />
            <span className="text-sm font-bold text-gray-700 truncate w-full text-center">{leaders[1].name}</span>
            <span className="text-gray-400 font-black">{leaders[1].score}</span>
            <div className="mt-auto bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold">2-O'RIN</div>
          </div>
        )}

        {leaders[0] && (
          <div className="flex flex-col items-center flex-1 bg-white p-6 rounded-[35px] shadow-xl border-b-4 border-yellow-400 h-56 relative transform -translate-y-4 scale-110">
            <Crown className="absolute -top-8 text-yellow-500 fill-yellow-500" size={36} />
            <img src={leaders[0].photoURL || `https://ui-avatars.com/api/?name=${leaders[0].name}`} className="w-20 h-20 rounded-full border-4 border-yellow-100 object-cover mb-2 shadow-lg" alt="1st" />
            <span className="text-lg font-black text-gray-800 truncate w-full text-center">{leaders[0].name}</span>
            <span className="text-[#B23DEB] font-black text-2xl">{leaders[0].score}</span>
            <div className="mt-auto bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-[12px] font-black">G'OLIB</div>
          </div>
        )}
        {leaders[2] && (
          <div className="flex flex-col items-center flex-1 bg-white p-4 rounded-3xl shadow-sm border-b-4 border-orange-300 h-40">
            <img src={leaders[2].photoURL || `https://ui-avatars.com/api/?name=${leaders[2].name}`} className="w-12 h-12 rounded-full border-4 border-gray-100 object-cover mb-2" alt="3rd" />
            <span className="text-sm font-bold text-gray-700 truncate w-full text-center">{leaders[2].name}</span>
            <span className="text-gray-400 font-black">{leaders[2].score}</span>
            <div className="mt-auto bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">3-O'RIN</div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-50">
        {leaders.map((user, index) => {
          const isMe = currentUser?.uid === user.id;

          return (
            <div 
              key={user.id} 
              className={`flex items-center justify-between p-5 transition-all border-b last:border-0 ${
                isMe ? 'bg-purple-50 border-l-8 border-l-[#B23DEB]' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 font-black text-lg ${index < 3 ? 'text-[#B23DEB]' : 'text-gray-300'}`}>
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                <div className="relative">
                   <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} className="w-12 h-12 rounded-2xl object-cover" alt="avatar" />
                   {isMe && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${isMe ? 'text-[#B23DEB]' : 'text-gray-800'}`}>
                    {user.name} {isMe && "(Siz)"}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest flex items-center gap-1">
                    <Zap size={10} className="fill-yellow-400 text-yellow-400" /> Aktivlik: {user.testsCompleted || 0} ta test
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-black text-xl text-gray-900">{user.score}</p>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center justify-end">
                    TOP {((index + 1) / leaders.length * 100).toFixed(0)}%
                  </p>
                </div>
                {index === 0 && <Medal className="text-yellow-500" size={24} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;