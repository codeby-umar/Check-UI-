import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, RotateCcw, Terminal, 
  Sparkles, Lightbulb, Code2, BrainCircuit, Zap
} from 'lucide-react';

const Coders = () => {
  const [code, setCode] = useState('# Python kodingizni yozing\nprint("Salom, Code OS!")\n\ndef test():\n    return "AI Engine Active"\n');
  const [output, setOutput] = useState('Terminal tayyor...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [insight, setInsight] = useState(null);

  const processCodeLocally = () => {
    setIsProcessing(true);
    setInsight(null);

    setTimeout(() => {
      try {
        // Sintaksisni tekshirish simulyatsiyasi
        if (code.includes('print ') && !code.includes('print(')) {
          throw new Error("SyntaxError: print() funksiyasida qavslar qolib ketgan.");
        }
        if (code.includes('def') && !code.includes(':')) {
          throw new Error("SyntaxError: Funksiya e'lonida ':' belgisi unutilgan.");
        }

        const match = code.match(/print\((['"])(.*?)\1\)/);
        setOutput(match ? match[2] : "Kod muvaffaqiyatli tekshirildi.");
        
        setInsight({
          type: 'success',
          msg: "Mantiqiy tahlil tugadi. Kod xatosiz.",
          tip: "AI Maslahati: Murakkabroq algoritmlar yozish uchun 'while' yoki 'for' sikllarini qo'shib ko'ring."
        });
      } catch (err) {
        setOutput(err.message);
        setInsight({
          type: 'error',
          msg: "Tizimda uzilish aniqlandi.",
          tip: "AI Yordami: " + err.message + " Qatorni qayta tekshiring."
        });
      }
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="h-screen bg-[#050505] text-slate-300 p-4 md:p-6 flex flex-col font-sans overflow-hidden selection:bg-[#B23DEB]/30">
      
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#B23DEB] p-2.5 rounded-2xl shadow-[0_0_20px_rgba(178,61,235,0.4)]">
            <Code2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter italic">CODE<span className="text-[#B23DEB]">LAB</span> AI</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Premium Python Workspace</p>
          </div>
        </div>

        <button 
          onClick={processCodeLocally}
          disabled={isProcessing}
          className="group relative flex items-center gap-2 px-8 py-3 bg-[#B23DEB] hover:bg-[#9b34cd] text-white rounded-2xl text-xs font-black transition-all shadow-[0_0_20px_rgba(178,61,235,0.2)] active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? <Zap className="animate-spin" size={16} /> : <Play size={16} fill="white" />}
          {isProcessing ? 'TAHLIL...' : 'ISHGA TUSHIRISH'}
        </button>
      </nav>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Editor Area */}
        <div className="lg:col-span-8 bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl relative">
          <div className="flex items-center justify-between px-8 py-4 bg-white/[0.02] border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
            </div>
            <span className="text-[10px] font-black tracking-widest text-[#B23DEB] uppercase opacity-80 underline underline-offset-4">main.py</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language="python"
              value={code}
              onChange={(v) => setCode(v)}
              options={{
                fontSize: 16,
                fontFamily: 'JetBrains Mono',
                minimap: { enabled: false },
                padding: { top: 20 },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                backgroundColor: '#0a0a0a',
                cursorSmoothCaretAnimation: "on",
                fontLigatures: true,
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          
          {/* Terminal */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 flex flex-col h-1/2 shadow-xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#B23DEB]" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Terminal Output</span>
              </div>
              <button onClick={() => setOutput('Terminal tozalandi...')} className="text-white/20 hover:text-[#B23DEB] transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>
            <div className="p-8 font-mono text-sm overflow-y-auto flex-1 custom-scrollbar">
              <pre className={insight?.type === 'error' ? 'text-red-400' : 'text-[#B23DEB]'}>
                {`> ${output}`}
              </pre>
            </div>
          </div>

          {/* AI Tutor Panel */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 flex flex-col h-1/2 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BrainCircuit size={160} className="text-[#B23DEB]" />
            </div>
            
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#B23DEB]" />
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">AI Tutor Insights</span>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
              {insight ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className={`p-4 rounded-2xl border ${insight.type === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-[#B23DEB]/5 border-[#B23DEB]/20'}`}>
                    <p className="text-xs text-white leading-relaxed font-semibold mb-2 italic">"{insight.msg}"</p>
                    <div className="h-1 w-12 bg-[#B23DEB]/40 rounded-full"></div>
                  </div>
                  
                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={14} className="text-[#B23DEB]" />
                      <span className="text-[10px] font-black uppercase text-[#B23DEB]">O'rganish uchun:</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">{insight.tip}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <BrainCircuit size={48} className="mb-4 text-[#B23DEB]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">AI tayyor</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B23DEB33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        .monaco-editor, .overflow-guard { border-radius: 0 0 2rem 2rem; }
      `}</style>
    </div>
  );
};

export default Coders;