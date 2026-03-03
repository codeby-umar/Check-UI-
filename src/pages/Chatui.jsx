import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react'; 

const Chatui = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Assalomu alaykum! Men sizga qanday yordam bera olaman?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Api
    setTimeout(() => {
      const aiResponse = { 
        role: 'ai', 
        content: "Bu namunaviy javob. API bog'langanda haqiqiy javob shu yerda chiqadi." 
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col  max-w-4xl mx-auto">
      <div className="p-4 ">
        <div className="flex items-center gap-2 bg-white p-2 rounded-full transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Xabaringizni yozing..."
            className="flex-1 bg-transparent border-none outline-none px-2 py-1 text-gray-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#B23DEB] rounded-full text-white"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          AI ba'zan noto'g'ri ma'lumot berishi mumkin. Ma'lumotlarni tekshirib ko'ring.
        </p>
      </div>
      <div className="flex-1  p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-[#B23DEB]' : 'bg-[#B23DEB] text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} />}
              </div>
              <div className={`p-3 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                ? 'bg-[#B23DEB] text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Chatui