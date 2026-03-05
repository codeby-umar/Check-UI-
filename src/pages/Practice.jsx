import React from 'react';
import { Link } from 'react-router-dom';

const Practice = () => {
  const tracks = [
    { title: "Algorithms", desc: "Focus on problem solving and logic.", count: "150+ tasks", icon: "🧩" },
    { title: "Data Structures", desc: "Master Arrays, Linked Lists, and Trees.", count: "80+ tasks", icon: "📊" },
    { title: "React JS", desc: "Build modern UIs with components.", count: "45+ projects", icon: "⚛️" },
    { title: "System Design", desc: "Learn to design scalable systems.", count: "20+ cases", icon: "🏗️" },
  ];

  return (
    <div className="min-h-screen py-25 px-6 relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#B23DEB]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] right-[-5%] w-100 h-100 bg-[#B23DEB]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-tight">
            Level Up Your <br />
            <span className="bg-gradient-to-r from-[#B23DEB] via-[#d484f5] to-[#B23DEB] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(178,61,235,0.3)]">
              Skills
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Choose a track to start practicing. Each module is designed to prepare you for real-world challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tracks.map((track, index) => (
            <div 
              key={index} 
              className="group relative p-0.5 rounded-sm  bg-gradient-to-b from-white/10 to-transparent hover:from-[#B23DEB]/50 transition-all duration-500 shadow-2xl"
            >
             
              <div className="relative h-full bg-[#111] rounded-lg p-8 overflow-hidden flex flex-col">
                
                {/* Hover gradient effekti */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#B23DEB]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon qismi */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl flex items-center justify-center text-3xl mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                    {track.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-[#B23DEB] transition-colors duration-300">
                    {track.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-10 leading-relaxed font-light flex-grow">
                    {track.desc}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Darslar soni</span>
                      <span className="text-sm font-mono font-bold text-gray-300">{track.count}</span>
                    </div>

                    <Link 
                      to={`/practice/${track.title.toLowerCase().replace(' ', '-')}`}
                      className="group/btn w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/10 text-white overflow-hidden relative transition-all duration-300 hover:w-28"
                    >
                      <span className="absolute left-4 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 text-sm font-bold">Start</span>
                      <span className="absolute right-4 text-xl group-hover/btn:text-[#B23DEB]">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;