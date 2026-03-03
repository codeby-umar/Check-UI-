import { AiFillProfile } from "react-icons/ai"; 
import { RiPencilFill } from "react-icons/ri"; 
import { IoMdAnalytics } from "react-icons/io"; 
import { NavLink } from "react-router-dom"
import { RiAccountCircleFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";







function Navbar() {
  return (
    <div className='w-1/5 flex items-center justify-center'>
      <div className="flex flex-col justify-evenly gap-7 h-screen ">
            <a href="/" className="text-4xl text-white"><span className="text-[#B23DEB] font-semibold">Check</span> UI</a>
            <ul>
               <NavLink to={"/dashboard"} className="flex items-center mb-7 gap-4"> <IoMdAnalytics size={"25px"} /> Dashboard</NavLink>
               <NavLink className="flex items-center mb-7 gap-4"> <RiPencilFill size={"25px"} />  Tests</NavLink>
               <NavLink className="flex items-center mb-7 gap-4">  <HiClipboardDocumentList size={"28px"} /> Courses</NavLink>
               <NavLink className="flex items-center mb-7 gap-4"> <RiAccountCircleFill size={"27px"}/> Profile</NavLink>
               <NavLink className="flex items-center mb-7 gap-4"> <MdLeaderboard size={"25px"}/> Leaderboard</NavLink>
               <NavLink className="flex items-center mb-7 gap-4"> < MdDarkMode size={"28px"} /> Dark mode</NavLink>
            </ul>
            <div>
              <NavLink to={"/setting"} className="flex items-center mb-7  gap-4"> <IoMdSettings size={"28px"}/>  Settings</NavLink>
              <NavLink to={"/"} className="flex items-center mb-7  gap-4"> <IoLogOut size={"28px"}/>  Log Out</NavLink>
            </div>
      </div>
    </div>
  )
}

export default Navbar