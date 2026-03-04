import React, { useState } from 'react';

const Explore = () => {
  
  const items = [
    { title: "Advanced Framer Motion", author: "Alex Doe", level: "Intermediate", likes: "1.2k", color: "#B23DEB" },
    { title: "Node.js Microservices", author: "Sarah J.", level: "Advanced", likes: "850", color: "#3B82F6" },
    { title: "Modern UI Patterns", author: "Mike Ross", level: "Beginner", likes: "2.4k", color: "#10B981" },
  ];

  return (
    <div className=" text-white py-10 px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-4 tracking-tighter">
              EXPLORE <span className="text-[#B23DEB]">BEYOND</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Discover the latest tutorials, templates, and interview prep kits shared by the community.
            </p>
          </div>
        </div>
      

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="group bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              <div 
                className="h-48 w-full relative overflow-hidden"
                style={{ background: `linear-gradient(45deg, ${item.color}22, #000)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-700">
                   <div className="w-24 h-24 rounded-full blur-3xl" style={{ backgroundColor: item.color }}></div>
                </div>
                <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  {item.level}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#B23DEB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 mb-6 flex items-center gap-2">
                  by <span className="text-gray-300 font-medium">{item.author}</span>
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <span className="text-red-500">♥</span> {item.likes}
                  </div>
                  <button className="text-white font-semibold flex items-center gap-2 group/btn">
                    Explore <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="mt-20 text-center">
          <button className="px-12 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold tracking-wide">
            View More Content
          </button>
        </div>

      </div>
    </div>
  );
};

export default Explore;