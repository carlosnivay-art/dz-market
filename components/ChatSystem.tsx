
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { chatWithProductAI, generalAIChat } from '../services/geminiService';
import { Product } from '../types';

interface ChatSystemProps {
  onClose: () => void;
  activeProduct?: Product | null;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ onClose, activeProduct }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { 
      role: 'ai', 
      text: activeProduct 
        ? `مرحباً! أنا المساعد الذكي لهذا المنتج (${activeProduct.name}). هل لديك أي استفسار حول سعره أو مواصفاته؟`
        : 'أهلاً بك في DZ Market! كيف يمكنني مساعدتك اليوم؟ 🇩🇿' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    let aiResponse;
    if (activeProduct) {
      aiResponse = await chatWithProductAI(userMsg, activeProduct);
    } else {
      aiResponse = await generalAIChat(userMsg);
    }
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'عذراً، حدث خطأ ما.' }]);
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-dz-green p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">مساعد مبيعات DZ</p>
            <p className="text-[10px] text-white/70">يرد فوراً 🟢</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-white text-gray-800 rounded-br-none border border-gray-100' 
                : 'bg-dz-green text-white rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-dz-green/20 text-dz-green p-3 rounded-2xl rounded-bl-none animate-pulse text-xs">
              جاري كتابة الرد...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-1">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن المنتج..."
            className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none focus:ring-0 text-gray-800"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="text-dz-green hover:bg-white p-2 rounded-full transition-all disabled:text-gray-300"
          >
            <Send size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
