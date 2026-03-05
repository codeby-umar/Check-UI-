import React from "react";
import { Link } from "react-router-dom";

import { FiGithub, FiInstagram, FiSend, FiTwitter } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social havolalar obyekti tozalangan holatda
  const socialLinks = [
    { icon: <FiSend />, url: "https://t.me/checkui", label: "Telegram" },
    {
      icon: <FiInstagram />,
      url: "https://instagram.com/checkui",
      label: "Instagram",
    },
    { icon: <FiGithub />, url: "https://github.com/checkui", label: "GitHub" },
    {
      icon: <FiTwitter />,
      url: "https://twitter.com/checkui",
      label: "Twitter",
    },
  ];

  const navLinks = [
    { name: "Bosh sahifa", url: "/" },
    { name: "Testlar", url: "/tests" },
    { name: "Natijalar", url: "/results" },
    { name: "Haqimizda", url: "/about" },
  ];

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/5 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <Link to="/" className="group flex items-center gap-2">
                <div className="w-10 h-10 bg-[#B23DEB] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(178,61,235,0.5)]">
                  <span className="text-white font-black text-2xl">C</span>
                </div>
                <span className="text-2xl md:text-3xl text-white font-bold tracking-tighter">
                  Check<span className="text-[#B23DEB]">UI</span>
                </span>
              </Link>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Eng zamonaviy test platformasi. O'z bilmingizni real-vaqt rejimida
              tekshiring.
            </p>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">
              Menyu
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-gray-500 hover:text-[#B23DEB] text-sm transition-all duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">
              Ijtimoiy
            </h4>
            <div className="flex items-center gap-5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-[#B23DEB] text-xl transition-colors duration-300"
                  aria-label={social.label}
                  style={{ fontSize: "1.2rem" }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright qismi - YANADA MINIMALISTIKA */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-gray-700 text-[10px] font-medium uppercase tracking-[0.2em]">
            &copy; {currentYear} Check UI Platform.
          </p>
          <div className="flex gap-6 text-gray-700 text-[10px] uppercase tracking-widest">
            {/* Privacy va Termsni shunchaki matn sifatida qoldirdik */}
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
