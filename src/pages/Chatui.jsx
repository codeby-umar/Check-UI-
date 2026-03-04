import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

const Chatui = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Assalomu alaykum! Men sizning aqlli yordamchingizman. Qanday savollaringiz bor?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Avtomatik scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      /**
       * BU YERGA API INTEGRATSIYA QILINADI:
       * Masalan: Google Gemini yoki OpenAI
       */
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: currentInput })
      // });
      // const data = await response.json();
      
      // Simulyatsiya (AI javob berishi)
      setTimeout(() => {
        const aiResponse = { 
          role: 'ai', 
          content: `Tushunarlilar, "${currentInput}" haqida so'radingiz. Men hozirda o'quv rejimida bo'lsam ham, sizga yordam berishga tayyorman!` 
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Xatolik:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] relative overflow-hidden font-sans">
      
      {/* 1. Chat Header */}
      <div className="flex-none p-6 md:p-8 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#B23DEB]/10 rounded-2xl border border-[#B23DEB]/20">
              <Cpu className="text-[#B23DEB] animate-pulse" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase italic">
                AI <span className="text-[#B23DEB] not-italic">Assistant</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tizim Online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">Turbo Model v3.0</span>
          </div>
        </div>
      </div>

      {/* 2. Messages Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                  msg.role === 'user' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-[#B23DEB] border-[#B23DEB]/50 shadow-[0_0_15px_rgba(178,61,235,0.4)]'
                }`}>
                  {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                </div>

                {/* Bubble */}
                <div className={`p-5 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-2xl transition-all duration-500 ${
                  msg.role === 'user' 
                  ? 'bg-[#B23DEB] text-white rounded-tr-none' 
                  : 'bg-white/[0.03] text-gray-200 border border-white/10 rounded-tl-none backdrop-blur-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] rounded-tl-none flex gap-2 items-center">
                <div className="w-2 h-2 bg-[#B23DEB] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#B23DEB] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#B23DEB] rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* 3. Input Area (Fixed at bottom) */}
      <div className="flex-none p-6 md:p-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-[#B23DEB]/10 blur-3xl opacity-20"></div>
          
          <div className="relative flex items-center gap-3 bg-white/[0.03] border border-white/10 p-2 md:p-3 rounded-[2.5rem] backdrop-blur-2xl focus-within:border-[#B23DEB]/40 transition-all duration-500 shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Savolingizni yuboring..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-2 text-white placeholder:text-gray-600 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-4 rounded-full transition-all duration-500 ${
                input.trim() && !isLoading 
                ? 'bg-[#B23DEB] text-white shadow-[0_0_20px_#B23DEB] hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-gray-700'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
             <ShieldAlert size={12}/>
             <p className="text-[9px] uppercase font-black tracking-[0.2em]">
               Sun'iy intellekt xato qilishi mumkin. Muhim ma'lumotlarni tekshiring.
             </p>
          </div>
        </div>
      </div>

      {/* Global CSS for animations & scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B23DEB; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Chatui;