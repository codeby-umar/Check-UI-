import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Cpu, Code2, Globe } from 'lucide-react';

const Coders = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('console.log("Salom, JavaScript!");');
  const [output, setOutput] = useState('Terminal tayyor. Kodni yozing va Run tugmasini bosing...');
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput('Kodni ishga tushirmoqdaman...');

    if (language === 'javascript') {
      try {
        let logs = [];
        const oldLog = console.log;
        console.log = (msg) => logs.push(msg);
        
        // Xavfsizroq eval uchun scope yaratish
        new Function(code)(); 
        
        console.log = oldLog;
        setOutput(logs.length > 0 ? logs.join('\n') : "Kod muvaffaqiyatli bajarildi (lekin konsolda natija yo'q).");
      } catch (err) {
        setOutput(`Xatolik: ${err.message}`);
      }
      setLoading(false);
    } else {
      try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          body: JSON.stringify({
            language: 'python',
            version: '3.10.0',
            files: [{ content: code }],
          }),
        });
        const data = await response.json();
        setOutput(data.run.output || data.run.stderr || "Natija yo'q.");
      } catch (err) {
        setOutput("Xatolik: API bilan aloqa uzildi.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6 md:p-10 custom-scrollbar flex flex-col">
      
      {/* Header & Title */}
      <div className="max-w-6xl mx-auto w-full mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <Code2 className="text-[#B23DEB]" size={35} />
            CODE <span className="text-[#B23DEB]">LAB</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Onlayn muhitda kod yozing va natijani darhol ko'ring</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Globe size={14} className="text-gray-500" />
            <select 
              className="bg-transparent text-white text-xs font-black uppercase outline-none cursor-pointer"
              value={language}
              onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(e.target.value === 'python' ? 'print("Salom, Python!")' : 'console.log("Salom, JS!");');
              }}
            >
              <option value="javascript" className="bg-[#1a1a1a]">JavaScript</option>
              <option value="python" className="bg-[#1a1a1a]">Python</option>
            </select>
          </div>
          <button 
            onClick={runCode}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all shadow-lg ${
              loading 
              ? 'bg-gray-800 text-gray-500' 
              : 'bg-[#B23DEB] text-white hover:scale-105 active:scale-95 shadow-[#B23DEB]/20'
            }`}
          >
            {loading ? <Cpu className="animate-spin" size={14} /> : <Play size={14} fill="white" />}
            {loading ? 'RUNNING...' : 'EXECUTE'}
          </button>
        </div>
      </div>

      {/* Editor & Terminal Container */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px] mb-10">
        
        {/* Editor Section */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col group">
          <div className="bg-white/[0.03] px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#ff5f56] rounded-full shadow-[0_0_10px_#ff5f56]"></div>
              <div className="w-3 h-3 bg-[#ffbd2e] rounded-full shadow-[0_0_10px_#ffbd2e]"></div>
              <div className="w-3 h-3 bg-[#27c93f] rounded-full shadow-[0_0_10px_#27c93f]"></div>
            </div>
            <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase">main.{language === 'python' ? 'py' : 'js'}</span>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 20 },
                fontFamily: 'JetBrains Mono, monospace',
                lineNumbersMinChars: 3,
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Terminal Section */}
        <div className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col relative">
          <div className="bg-white/[0.03] px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <Terminal size={16} className="text-[#B23DEB]" />
            <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Output Terminal</span>
          </div>

          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-[#B23DEB]/5">
            <div className="flex items-start gap-3">
              <span className="text-[#B23DEB] font-black italic">➜</span>
              <pre className="text-gray-300 whitespace-pre-wrap break-all leading-relaxed font-medium">
                {output}
              </pre>
            </div>
            {loading && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B23DEB] rounded-full animate-ping"></div>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter italic">Process is active...</span>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button 
            onClick={() => setOutput('Terminal tozalandi...')}
            className="absolute bottom-6 right-6 p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
      `}</style>
    </div>
  );
};

export default Coders;