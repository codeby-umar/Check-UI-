import React from 'react';
import { FiHeart, FiArrowRight, FiSearch, FiFilter } from "react-icons/fi";

const Explore = () => {
  const items = [
    { title: "Advanced Framer Motion", author: "Alex Doe", level: "Intermediate", likes: "1.2k", color: "#B23DEB" },
    { title: "Node.js Microservices", author: "Sarah J.", level: "Advanced", likes: "850", color: "#3B82F6" },
    { title: "Modern UI Patterns", author: "Mike Ross", level: "Beginner", likes: "2.4k", color: "#10B981" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#B23DEB]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-20">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-6xl flex gap-4 md:text-5xl font-bold mb-6 tracking-tighter leading-none">
              EXPLORE <br />
              <span className="bg-gradient-to-r from-[#B23DEB] via-[#d484f5] to-[#B23DEB] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(178,61,235,0.3)]">
                BEYOND
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Discover the latest tutorials, templates, and interview prep kits shared by the global community.
            </p>
          </div>

          {/* Search & Filter bar (Dizaynni boyitish uchun) */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 px-4">
              <FiSearch className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tutorials..." 
                className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-gray-600"
              />
            </div>
            <button className="p-3 bg-white/5 hover:bg-[#B23DEB] rounded-xl transition-all duration-300">
              <FiFilter />
            </button>
          </div>
        </div>
      

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="group bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden hover:border-[#B23DEB]/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(178,61,235,0.1)] flex flex-col"
            >
              {/* Card Preview Area */}
              <div className="h-56 w-full relative overflow-hidden bg-[#050505]">
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle at center, ${item.color}, transparent)` }}
                ></div>
                
                {/* Abstract Design Elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div 
                    className="w-32 h-32 rounded-full blur-[60px] animate-pulse" 
                    style={{ backgroundColor: item.color }}
                   ></div>
                </div>

                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-white">
                  {item.level}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-white transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 mb-8 flex items-center gap-2 text-sm">
                  by <span className="text-[#B23DEB] font-semibold hover:underline cursor-pointer">{item.author}</span>
                </p>
                
                {/* Footer of Card */}
                <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-sm group-hover:text-red-400 transition-colors">
                    <FiHeart className={`${idx === 0 ? "fill-red-500 text-red-500" : ""}`} /> 
                    {item.likes}
                  </div>
                  
                  <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B23DEB] group/btn">
                    Explore 
                    <div className="w-8 h-8 rounded-full bg-[#B23DEB]/10 flex items-center justify-center group-hover/btn:bg-[#B23DEB] group-hover/btn:text-white transition-all duration-300">
                      <FiArrowRight />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <button className="group relative px-12 py-5 rounded-full border border-white/10 hover:border-[#B23DEB]/50 transition-all duration-500">
            <span className="relative z-10 font-bold tracking-widest text-sm uppercase group-hover:text-white transition-colors">
              View More Content
            </span>
            <div className="absolute inset-0 bg-[#B23DEB] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full opacity-10"></div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Explore;