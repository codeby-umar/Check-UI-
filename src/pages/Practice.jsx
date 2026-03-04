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
    <div className= "px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-100 h-100 rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-75 h-75  rounded-full"></div>

      <div className="container mx-auto relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Level Up Your <span className="text-[#B23DEB] drop-shadow-[0_0_15px_rgba(178,61,235,0.4)]">Skills</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Choose a track to start practicing. Each module is designed to prepare you for real-world challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, index) => (
            <div 
              key={index} 
              className="group border p-8 rounded-4xl  border-white/5 hover:border-[#B23DEB]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(178,61,235,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B23DEB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  {track.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {track.title}
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed group-hover:text-gray-400 transition-colors">
                  {track.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">{track.count}</span>
                  <Link 
                    to={`/practice/${track.title.toLowerCase()}`}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#B23DEB] group-hover:bg-[#B23DEB] group-hover:text-white transition-all duration-300"
                  >
                    →
                  </Link>
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