import * as React from "react";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiEdit2, FiSearch } from "react-icons/fi"; 

function Navbars() {
  const { user } = useAuth();
  // Rasmni xotiradan olish
  const [avatarSrc, setAvatarSrc] = React.useState(localStorage.getItem("user_avatar") || undefined);
  
  const userName = user?.displayName || user?.email?.split("@")[0] || "Mehmon";
  const firstLetter = userName.charAt(0).toUpperCase();

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setAvatarSrc(base64Image);
        localStorage.setItem("user_avatar", base64Image); // Saqlash qismi
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex items-center border-b justify-between p-8 bg-[#0a0a0a]">
      
      {/* Chap tomon: Matnlar */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome, <span className="text-[#B23DEB] capitalize">{userName}!</span>
        </h1>
        <p className="text-gray-500 text-lg mt-1 font-medium">
          Here is your Profile Dashboard
        </p>
      </div>

      {/* O'ng tomon: Qidiruv va Profil */}
      <div className="flex items-center gap-8">
        
        {/* Search Input */}
        <div className="relative group hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="h-14 w-80 rounded-2xl bg-white/5 border border-white/10 px-6 pr-12 text-white outline-none focus:border-[#B23DEB] transition-all"
          />
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size="22" />
        </div>

        {/* Notification Icon */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-[#B23DEB] cursor-pointer transition-all">
          <FiBell size="24" />
        </div>

        {/* User Avatar & Upload */}
        <div className="group relative">
          <ButtonBase
            component="label"
            sx={{
              borderRadius: "50%",
              padding: "2px",
              border: "2px solid #B23DEB",
              transition: "0.3s",
              "&:hover": { boxShadow: "0 0 15px rgba(178, 61, 235, 0.5)" }
            }}
          >
            <Avatar
              alt={userName}
              src={avatarSrc}
              sx={{ 
                width: 55, 
                height: 55, 
                background: !avatarSrc ? "#B23DEB" : "transparent",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {firstLetter}
            </Avatar>
            
            {/* Edit Icon */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#B23DEB] rounded-full flex items-center justify-center text-white border-2 border-[#0a0a0a]">
              <FiEdit2 size="12" />
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </ButtonBase>
        </div>
      </div>
    </div>
  );
}

export default Navbars;