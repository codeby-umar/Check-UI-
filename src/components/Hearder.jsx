import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";

function Hearder() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/practice", label: "Practice" },
    { to: "/explore", label: "Explore" },
  ];

  return (
    <div className="relative">
      <div className="flex container mx-auto px-4 p-6 md:p-10 items-center justify-between">
        {/* Logo */}
        <a className="text-[32px] md:text-[40px] text-white font-bold whitespace-nowrap" href="/">
          <span className="text-[#B23DEB]">Check</span> UI
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-10 xl:gap-20">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                className={({ isActive }) =>
                  `text-lg transition-all ${
                    isActive ? "text-[#B23DEB]" : "text-gray-600 hover:text-[#B23DEB]"
                  }`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <Link
            className="text-lg p-4 px-10 rounded-full bg-[#B23DEB] text-white"
            to={"/login"}
          >
            Sign In
          </Link>
        </ul>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden text-white p-2" 
          onClick={toggleMenu}
        >
          {isOpen ? <IoMdClose size="35px" /> : <IoMdMenu size="35px" />}
        </button>
      </div>
      <div
        className={`absolute top-full left-0 w-full  z-50 lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-125 text-white bg-gray-400 border-b border-gray-800" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-xl ${
                    isActive ? "text-[#B23DEB]" : "text-white0"
                  }`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <Link
            onClick={() => setIsOpen(false)}
            className="text-lg p-3 px-10 rounded-full bg-[#B23DEB] text-white mt-4"
            to={"/login"}
          >
            Sign In
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Hearder;