import * as React from "react";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiSearch, FiMessageSquare, FiCheck } from "react-icons/fi";
import { db } from "../firebase"; 
import { collection, query, where, onSnapshot, doc, writeBatch, getDoc } from "firebase/firestore";

function Navbars() {
  const { user } = useAuth();
  // Firestore-dan keladigan profil ma'lumotlari uchun state
  const [profile, setProfile] = React.useState({
    name: "",
    image: ""
  });
  const [notifications, setNotifications] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const audioRef = React.useRef(new Audio("https://raw.githubusercontent.com/rafaelproenca/react-chat-ui/master/public/notification.mp3"));

  // 1. Foydalanuvchi ma'lumotlarini Firestore-dan real-time kuzatish
  React.useEffect(() => {
    if (!user?.uid) return;

    // Settings-da saqlangan ma'lumotlarni har doim yangi holatda olish
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || user.displayName || user.email.split("@")[0],
          image: data.image || ""
        });
      } else {
        // Agar bazada hali yo'q bo'lsa, Auth-dagi ma'lumotni ko'rsatib turish
        setProfile({
          name: user.displayName || user.email.split("@")[0],
          image: user.photoURL || ""
        });
      }
    });

    return () => unsubscribeProfile();
  }, [user]);

  // Bildirishnomalar qismi (O'zgarishsiz qoldi)
  React.useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "messages"),
      where("uid", "==", user.uid)
    );

    const unsubscribeMsgs = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const unreadMsgs = allMsgs.filter(msg => msg.status !== "read");
      const sorted = unreadMsgs
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5); // Ko'proq ko'rsatish uchun 5 ta qildim

      if (unreadMsgs.length > unreadCount && unreadCount !== 0) {
        audioRef.current.play().catch(() => {});
      }

      setNotifications(sorted);
      setUnreadCount(unreadMsgs.length);
    });

    return () => unsubscribeMsgs();
  }, [user?.uid, unreadCount]);

  const markAllAsRead = async () => {
    if (notifications.length === 0) return;
    const batch = writeBatch(db);
    notifications.forEach((msg) => {
      const msgRef = doc(db, "messages", msg.id);
      batch.update(msgRef, { status: "read" });
    });
    try {
      await batch.commit();
      setShowDropdown(false);
    } catch (err) { console.error(err); }
  };

  // Birinchi harfni olish (Avatar uchun)
  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "M";

  return (
    <div className="w-full flex items-center border-b border-white/5 mb-4 justify-between p-8 bg-[#0a0a0a] relative z-50 font-sans">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome, <span className="text-[#B23DEB] capitalize">{profile.name}!</span>
        </h1>
        <p className="text-gray-500 text-lg mt-1 font-medium italic">Profile Dashboard</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden lg:block">
          <input type="text" placeholder="Search..." className="h-14 w-80 rounded-2xl bg-white/5 border border-white/10 px-6 text-white outline-none focus:border-[#B23DEB] transition-all" />
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size="22" />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className={`p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-[#B23DEB] transition-all relative ${unreadCount > 0 ? 'ring-2 ring-[#B23DEB]/50' : ''}`}
          >
            <FiBell size="24" className={unreadCount > 0 ? "animate-pulse text-[#B23DEB]" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B23DEB] text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-4 border-[#0a0a0a] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-6 w-96 bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-drop-in backdrop-blur-xl z-[100]">
              <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <span className="text-white font-black text-[10px] tracking-widest uppercase">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="flex items-center gap-1 text-[10px] text-[#B23DEB] font-bold hover:opacity-70 transition-all">
                    <FiCheck size={14} /> MARK READ
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((msg) => (
                    <div key={msg.id} className="p-5 border-b border-white/5 hover:bg-white/5 transition-all group">
                       <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#B23DEB]/10 flex items-center justify-center text-[#B23DEB]">
                          <FiMessageSquare size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-bold group-hover:text-[#B23DEB] transition-colors flex justify-between">
                            {msg.displayName || "System"}
                            <span className="text-[10px] text-gray-600 font-normal">
                                {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Now"}
                            </span>
                          </p>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-600 text-sm">No new alerts</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Sinxronlangan Avatar */}
        <div className="relative">
            <Avatar 
                alt={profile.name} 
                src={profile.image} 
                sx={{ 
                    width: 55, 
                    height: 55, 
                    border: "2px solid #B23DEB",
                    background: "#B23DEB", 
                    fontSize: "1.2rem", 
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
            >
                {firstLetter}
            </Avatar>
        </div>
      </div>

      <style>{`
        @keyframes dropIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-drop-in { animation: dropIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Navbars;