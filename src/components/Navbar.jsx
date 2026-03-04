import { RiPencilFill, RiAccountCircleFill } from "react-icons/ri";
import { IoMdAnalytics, IoMdSettings } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLeaderboard, MdMarkUnreadChatAlt } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { IoLogOut } from "react-icons/io5";
import { AiFillCode } from "react-icons/ai";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); 
    try {
      await signOut(auth);
      navigate("/login"); 
    } catch (error) {
      console.error("Chiqishda xatolik:", error);
    }
  };

  return (
    <div className="w-80 sticky top-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-8 z-100">
      {/* Logo Section */}
      <div className="mb-16">
        <a href="/" className="text-3xl font-black tracking-tighter text-white group">
          <span className="text-[#B23DEB] drop-shadow-[0_0_8px_rgba(178,61,235,0.4)] transition-all group-hover:drop-shadow-[0_0_15px_rgba(178,61,235,0.6)]">Check</span> UI
        </a>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">Menu</p>
        <ul className="space-y-2">
          <NavItem to="/dashboard" icon={<IoMdAnalytics size="22" />} label="Dashboard" />
          <NavItem to="/tests" icon={<RiPencilFill size="22" />} label="Tests" />
          <NavItem to="/courses" icon={<HiClipboardDocumentList size="22" />} label="Courses" />
          <NavItem to="/profile" icon={<RiAccountCircleFill size="22" />} label="Profile" />
          <NavItem to="/leaderboard" icon={<MdLeaderboard size="22" />} label="Leaderboard" />
          <NavItem to="/chat" icon={<MdMarkUnreadChatAlt size="22" />} label="Chat UI" />
          <NavItem to="/code" icon={<AiFillCode size="22" />} label="Coders" />
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="pt-8 border-t border-white/5 space-y-2">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">Account</p>
        <NavItem to="/setting" icon={<IoMdSettings size="22" />} label="Settings" />
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group"
        >
          <div className="transition-transform group-hover:rotate-12">
            <IoLogOut size="24" />
          </div>
          <span className="font-bold tracking-tight">Log Out</span>
        </button>
      </div>
    </div>
  );
}

// Yordamchi komponent - Takrorlanishni kamaytirish uchun
function NavItem({ to, icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl font-bold tracking-tight transition-all duration-300 group ${
            isActive 
              ? "bg-[#B23DEB]/10 text-[#B23DEB] shadow-[inset_0_0_20px_rgba(178,61,235,0.05)]" 
              : "text-gray-500 hover:text-white hover:bg-white/5"
          }`
        }
      >
        <div className="transition-transform group-hover:scale-110">
          {icon}
        </div>
        <span>{label}</span>
        
        {/* Aktiv bo'lganda yonida kichik chiziqcha chiqishi uchun */}
        <NavLink 
          to={to} 
          className={({isActive}) => isActive ? "ml-auto w-1.5 h-1.5 rounded-full bg-[#B23DEB] shadow-[0_0_10px_#B23DEB]" : "hidden"}
        />
      </NavLink>
    </li>
  );
}

export default Navbar;