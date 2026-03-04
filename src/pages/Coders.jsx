import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const Coders = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('console.log("Salom, JavaScript!");');
  const [output, setOutput] = useState('Terminal tayyor...');
  const [loading, setLoading] = useState(false);

  // Kodni ishga tushirish funksiyasi
  const runCode = async () => {
    setLoading(true);
    setOutput('Kodni ishga tushirmoqdaman...');

    if (language === 'javascript') {
      try {
        // Konsol natijalarini ushlash uchun vaqtinchalik funksiya
        let logs = [];
        const oldLog = console.log;
        console.log = (msg) => logs.push(msg);
        
        eval(code); // JS kodini yurgizish
        
        console.log = oldLog;
        setOutput(logs.length > 0 ? logs.join('\n') : "Kod muvaffaqiyatli bajarildi (lekin natija yo'q).");
      } catch (err) {
        setOutput(`Xatolik: ${err.message}`);
      }
      setLoading(false);
    } else {
      // Python uchun Piston API dan foydalanamiz
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
        setOutput(data.run.output || "Natija yo'q.");
      } catch (err) {
        setOutput("Xatolik: Server bilan aloqa uzildi.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-10 border border-gray-700 rounded-lg overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <select 
            className="bg-gray-800 text-white text-xs rounded px-2 py-1 outline-none border border-gray-600 ml-4"
            value={language}
            onChange={(e) => {
                setLanguage(e.target.value);
                setCode(e.target.value === 'python' ? 'print("Salom, Python!")' : 'console.log("Salom, JS!");');
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        
        <button 
          onClick={runCode}
          disabled={loading}
          className={`${loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'} text-white px-6 py-1 rounded text-sm font-bold transition flex items-center shadow-lg`}
        >
          {loading ? 'Kutilmoqda...' : 'Run ▶'}
        </button>
      </div>

      <div className="h-87.5">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            automaticLayout: true,
            padding: { top: 10 }
          }}
        />
      </div>

      <div className="bg-[#0f0f0f] border-t border-gray-800 flex flex-col">
        <div className="bg-gray-900 px-4 py-1 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Terminal Output
        </div>
        <div className="p-4 h-40 overflow-y-auto font-mono text-sm">
          <div className="flex">
            <span className="text-blue-400 mr-2">➜</span>
            <pre className="text-gray-200 whitespace-pre-wrap break-all">{output}</pre>
          </div>
          {loading && <span className="animate-pulse text-green-500 underline">_</span>}
        </div>
      </div>
    </div>
  );
};

export default Coders;