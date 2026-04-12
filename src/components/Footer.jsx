import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiInstagram, FiSend, FiTwitter } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FiSend />, url: "https://t.me/checkui", label: "Telegram" },
    { icon: <FiInstagram />, url: "https://instagram.com/checkui", label: "Instagram" },
    { icon: <FiGithub />, url: "https://github.com/checkui", label: "GitHub" },
    { icon: <FiTwitter />, url: "https://twitter.com/checkui", label: "Twitter" },
  ];

  // Navigatsiyani mantiqiy ikkita qismga bo'ldik
  const mainLinks = [
    { name: "Bosh sahifa", url: "/" },
    { name: "Testlar", url: "/tests" },
    { name: "Natijalar", url: "/results" },
    { name: "Reyting", url: "/leaderboard" },
  ];

  const resourceLinks = [
    { name: "Haqimizda", url: "/about" },
    { name: "Blog", url: "/blog" },
    { name: "Yordam", url: "/help" },
    { name: "Aloqa", url: "/contact" },
  ];

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/[0.05] mt-32 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section - 4 ustun */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="inline-block group">
              <span className="text-3xl text-white font-bold tracking-tighter flex items-center">
                Check<span className="text-[#B23DEB] group-hover:drop-shadow-[0_0_8px_rgba(178,61,235,0.6)] transition-all">UI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-light">
              Zamonaviy test platformasi orqali o'z salohiyatingizni kashf eting.
            </p>
          </div>

          {/* Navigatsiya 1 - 2 ustun */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Asosiy</h4>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className="text-gray-400 hover:text-white text-[13px] transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigatsiya 2 - 2 ustun */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Resurslar</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className="text-gray-400 hover:text-white text-[13px] transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section - 4 ustun */}
          <div className="md:col-span-4 space-y-6 md:text-right">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Ijtimoiy tarmoqlar</h4>
            <div className="flex items-center gap-3 md:justify-end">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-[#B23DEB] hover:border-[#B23DEB]/30 transition-all duration-300"
                >
                  <span className="text-base">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-medium tracking-[0.15em] uppercase">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B23DEB] shadow-[0_0_8px_#B23DEB]"></div>
            <p>© {currentYear} CHECK UI PLATFORM</p>
          </div>
          
          <div className="flex gap-8 text-gray-600">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Maxfiylik</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Qoidalar</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;