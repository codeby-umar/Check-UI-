import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll bo'lganda header fonini o'zgartirish
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/practice", label: "Practice" },
    { to: "/explore", label: "Explore" },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-[#B23DEB] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(178,61,235,0.5)]">
            <span className="text-white font-black text-2xl">C</span>
          </div>
          <span className="text-2xl md:text-3xl text-white font-bold tracking-tighter">
            Check<span className="text-[#B23DEB]">UI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center bg-white/5 border border-white/10 px-8 py-2 rounded-full backdrop-blur-sm">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-all duration-300 ${
                      isActive 
                        ? "text-[#B23DEB] drop-shadow-[0_0_8px_rgba(178,61,235,0.6)]" 
                        : "text-gray-400 hover:text-white"
                    }`
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            className="text-sm font-bold px-8 py-3 rounded-full bg-gradient-to-r from-[#B23DEB] to-[#8e2dbd] text-white hover:shadow-[0_0_25px_rgba(178,61,235,0.4)] transition-all duration-300 active:scale-95"
            to={"/login"}
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoMdClose size="24" /> : <IoMdMenu size="24" />}
        </button>
      </div>

      {/* Mobile Menu (Overlay) */}
      <div
        className={`fixed inset-0 top-[0] left-0 w-full h-screen bg-[#0a0a0a] z-[-1] transition-transform duration-500 ease-in-out lg:hidden ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-4xl font-bold tracking-tighter transition-all ${
                  isActive ? "text-[#B23DEB]" : "text-white hover:text-[#B23DEB]"
                }`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            onClick={() => setIsOpen(false)}
            className="mt-4 text-xl font-bold p-5 px-12 rounded-2xl bg-[#B23DEB] text-white shadow-[0_10px_30px_rgba(178,61,235,0.3)]"
            to={"/login"}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;