import { AiFillProfile } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdMarkUnreadChatAlt } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AiFillCode } from "react-icons/ai";



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
    <div className="w-1/4 flex items-center justify-center">
      <div className="flex flex-col justify-evenly gap-7 h-screen ">
        <a href="/" className="text-4xl text-white">
          <span className="text-[#B23DEB] font-semibold">Check</span> UI
        </a>
        <ul>
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <IoMdAnalytics size={"25px"} /> Dashboard
          </NavLink>
          <NavLink
            to={"/tests"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <RiPencilFill size={"25px"} /> Tests
          </NavLink>
          <NavLink
            to={"/courses"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <HiClipboardDocumentList size={"28px"} /> Courses
          </NavLink>
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <RiAccountCircleFill size={"27px"} /> Profile
          </NavLink>
          <NavLink
            to={"/leaderboard"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <MdLeaderboard size={"25px"} /> Leaderboard
          </NavLink>
          <NavLink
            to={"/chat"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <MdMarkUnreadChatAlt size={"25px"} />
            Chat UI
          </NavLink>
          <NavLink
            to={"/code"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            < AiFillCode  size={"28px"} /> Coders
          </NavLink>
        </ul>
        <div>
          <NavLink
            to={"/setting"}
            className={({ isActive }) =>
              `flex items-center mb-7 gap-6 transition-all ${
                isActive ? "text-[#B23DEB]" : " hover:text-[#B23DEB]"
              }`
            }
          >
            {" "}
            <IoMdSettings size={"28px"} /> Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center mb-7 gap-6 transition-all  hover:text-[#B23DEB] w-full"
          >
            <IoLogOut size={"29px"} />
            <span className="text-black">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
