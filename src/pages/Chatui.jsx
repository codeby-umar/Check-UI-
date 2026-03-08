import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Cpu } from 'lucide-react';

const Chatui = () => {
  const [messages, setMessages] = useState([
  { role: "ai", content: "Assalomu alaykum! Savollaringizga javob berishga tayyorman." }
]);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
const scrollRef = useRef(null);

useEffect(() => {
  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, isLoading]);

const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const currentInput = input.trim();
  const userMessage = { role: "user", content: currentInput };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

    if (!HF_TOKEN) {
      throw new Error("HF token topilmadi");
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/Kimi-K2-Instruct-0905",
        messages: [
          {
            role: "system",
            content: "Siz aqlli yordamchisiz. O'zbek tilida qisqa va lo'nda javob bering.",
          },
          {
            role: "user",
            content: currentInput,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP xato: ${response.status}`);
    }

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      const aiResponse = {
        role: "ai",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } else {
      throw new Error("API javobi noto‘g‘ri");
    }
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: "Xatolik yuz berdi. Qaytadan urinib ko‘ring." },
    ]);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="h-screen flex px-10 flex-col bg-[#050505] text-gray-300 font-sans selection:bg-[#B23DEB]/30">
      <header className="flex-none py-4 px-6 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-md z-20">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B23DEB]/10 rounded-lg border border-[#B23DEB]/20">
              <Cpu className="text-[#B23DEB]" size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wider uppercase">
                AI <span className="text-[#B23DEB]">Assistant</span>
              </h1>
              <p className="text-[9px] text-gray-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> KIMI ONLINE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Sparkles size={11} className="text-yellow-500" />
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-tighter">Turbo v1.0</span>
          </div>
        </div>
      </header>

      {/* 2. Messages - Yozuvlar kichraytirildi */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className=" mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-[#B23DEB]/20 border-[#B23DEB]/30'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-[#B23DEB]" />}
                </div>

                <div className={`px-4 py-2.5 rounded-2xl text-[13px] md:text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#B23DEB] text-white rounded-tr-none' 
                  : 'bg-white/[0.04] text-gray-200 border border-white/5 rounded-tl-none'
                } whitespace-pre-wrap`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start pl-11">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#B23DEB] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-[#B23DEB] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-[#B23DEB] rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* 3. Input - Modern va sodda */}
      <footer className="flex-none p-4 md:p-8">
        <div className=" mx-auto">
          <div className="relative flex items-center bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl focus-within:border-[#B23DEB]/40 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Xabar yozing..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-[13px] text-white placeholder:text-gray-600"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all ${
                input.trim() && !isLoading 
                ? 'bg-[#B23DEB] text-white hover:opacity-90 active:scale-95' 
                : 'bg-transparent text-gray-700'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-600 mt-3 tracking-widest uppercase">
            Powered by Kimi AI • 2024
          </p>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Chatui;