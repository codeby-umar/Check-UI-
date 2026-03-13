import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, RotateCcw, Terminal, Sparkles, Lightbulb, 
  Code2, BrainCircuit, Zap, ShieldCheck, Cpu, 
  Layout, Command, ChevronRight, Globe, Layers
} from 'lucide-react';

const Coders = () => {
  const [code, setCode] = useState('# CodeLab AI - Premium Workspace\nimport math\n\ndef analyze_system():\n    status = "AI Engine Active"\n    efficiency = math.pi * 32\n    return f"{status} | Power: {efficiency:.2f}GHz"\n\nprint(analyze_system())');
  const [output, setOutput] = useState(['> System initialized...', '> Ready for neural analysis.']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const simulateExecution = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setOutput(prev => [...prev, `> Executing script...`, `> Output: AI Engine Active | Power: 100.53GHz`]);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="h-screen bg-[#030304] text-slate-400 p-3 flex flex-col font-sans overflow-hidden selection:bg-[#B23DEB]/30">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="max-w-[1700px] mx-auto w-full flex items-center justify-between mb-3 px-4 py-2 bg-[#0a0a0c]/50 backdrop-blur-xl rounded-2xl border border-white/[0.03]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-[#B23DEB] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#B23DEB] to-[#7928CA] p-2.5 rounded-xl shadow-[0_0_15px_rgba(178,61,235,0.3)]">
                <Code2 size={20} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">CODE<span className="text-[#B23DEB]">LAB</span></h1>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Neural Interface</p>
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>
          
          <nav className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span className="text-[#B23DEB] cursor-pointer hover:text-white transition-colors">Editor</span>
            <span className="cursor-pointer hover:text-white transition-colors">Debugger</span>
            <span className="cursor-pointer hover:text-white transition-colors">Packages</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg mr-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Cloud Linked</span>
          </div>
          
          <button 
            onClick={simulateExecution}
            disabled={isAnalyzing}
            className="group relative flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl text-[11px] font-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {isAnalyzing ? <Zap className="animate-spin" size={14} /> : <Play size={14} fill="black" />}
            RUN SYSTEM
          </button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="max-w-[1700px] mx-auto w-full grid grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* EDITOR SECTION */}
        <section className="col-span-12 lg:col-span-8 bg-[#0a0a0c] rounded-[2rem] border border-white/[0.05] flex flex-col shadow-2xl overflow-hidden relative group">
            {/* Window Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.03] bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/30 border border-[#ff5f56]/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/30 border border-[#ffbd2e]/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/30 border border-[#27c93f]/50"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.05] rounded-md border border-white/[0.05]">
                        <Globe size={12} className="text-[#B23DEB]" />
                        <span className="text-[10px] font-bold text-white/60 tracking-wider">main.py</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white/20 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><Layers size={12}/> Layer 1</span>
                    <span className="flex items-center gap-1"><Cpu size={12}/> Python 3.x</span>
                </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 p-2 bg-[#0a0a0c]">
                <Editor
                    height="100%"
                    theme="vs-dark"
                    language="python"
                    value={code}
                    onChange={(v) => setCode(v)}
                    options={{
                        fontSize: 16,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        padding: { top: 20 },
                        cursorSmoothCaretAnimation: "on",
                        smoothScrolling: true,
                        lineNumbers: "on",
                        renderLineHighlight: "all",
                        scrollbar: { verticalSliderSize: 4, horizontalSliderSize: 4 },
                        fontLigatures: true,
                        backgroundColor: '#0a0a0c'
                    }}
                />
            </div>
            
            {/* Status Bar */}
            <div className="px-6 py-2 bg-white/[0.02] border-t border-white/[0.03] flex justify-between items-center">
                <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] flex gap-4">
                    <span>Line: 12</span>
                    <span>Col: 45</span>
                </div>
                <div className="text-[9px] font-black text-[#B23DEB] uppercase italic">System: Optimal</div>
            </div>
        </section>

        {/* SIDEBAR SECTION */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          
          {/* TERMINAL CARTE */}
          <div className="bg-[#0a0a0c] rounded-[2rem] border border-white/[0.05] flex flex-col h-[45%] shadow-xl group">
            <div className="px-6 py-4 border-b border-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#B23DEB]" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">System Output</span>
              </div>
              <button onClick={() => setOutput(['> Console cleared.'])} className="hover:rotate-180 transition-transform duration-500">
                <RotateCcw size={14} className="text-white/20 hover:text-white" />
              </button>
            </div>
            <div className="p-6 font-mono text-[12px] overflow-y-auto flex-1 custom-scrollbar space-y-2">
              {output.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                    <span className="text-[#B23DEB] opacity-50">❯</span>
                    <span className={line.includes('Error') ? 'text-rose-400' : 'text-slate-300'}>{line}</span>
                </div>
              ))}
              {isAnalyzing && <div className="text-[#B23DEB] animate-pulse">❯ Process running...</div>}
            </div>
          </div>

          {/* AI INTELLIGENCE CARD */}
          <div className="bg-[#0a0a0c] rounded-[2.5rem] border border-white/[0.05] flex-1 flex flex-col shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                <BrainCircuit size={200} className="text-[#B23DEB]" />
            </div>

            <div className="px-6 py-4 border-b border-white/[0.03] flex items-center gap-2 bg-white/[0.01]">
                <Sparkles size={14} className="text-[#B23DEB]" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">AI Insights</span>
            </div>

            <div className="p-8 flex flex-col h-full justify-center space-y-6">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#B23DEB] to-transparent opacity-50"></div>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-tighter mb-2">Recommendation:</h3>
                    <p className="text-sm text-slate-400 italic leading-relaxed">
                        Sizning kodingizda murakkab mantiq aniqlanmadi. Algoritmni yanada tezlashtirish uchun kesh-xotira (memoization) usullarini qo'llash tavsiya etiladi.
                    </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-[#B23DEB]/10 rounded-lg shrink-0">
                        <Lightbulb size={16} className="text-[#B23DEB]" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-[#B23DEB] uppercase">Pro Tip</span>
                        <p className="text-[11px] text-white/40 mt-1 leading-snug">
                            `math.pi` dan foydalanish o'rniga, natijani o'zgarmas qilib saqlash (constant) xotira yukini 0.02% ga kamaytirishi mumkin.
                        </p>
                    </div>
                </div>
            </div>
          </div>

        </section>
      </main>

      {/* --- FOOTER INFO --- */}
      <footer className="max-w-[1700px] mx-auto w-full flex items-center justify-between px-6 py-3 text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">
        <div className="flex gap-8">
            <span className="hover:text-white/30 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white/30 cursor-pointer transition-colors">API Status</span>
        </div>
        <div className="flex items-center gap-2">
            <Command size={12} />
            <span>2026 CodeLab Neural OS</span>
        </div>
      </footer>

      {/* --- CUSTOM STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(178, 61, 235, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        .monaco-editor, .overflow-guard { border-radius: 0 0 1.5rem 1.5rem !important; }
        .monaco-editor .margin { background-color: #0a0a0c !important; border-right: 1px solid rgba(255,255,255,0.03) !important; }
        .monaco-editor .monaco-scrollable-element { background-color: #0a0a0c !important; }
      `}</style>
    </div>
  );
};

export default Coders;