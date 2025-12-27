
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { chatWithProductAI, generalAIChat } from '../services/geminiService';
import { Product } from '../types';

interface ChatSystemProps {
  onClose: () => void;
  activeProduct?: Product | null;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  sources?: any[];
}

const ChatSystem: React.FC<ChatSystemProps> = ({ onClose, activeProduct }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: activeProduct 
        ? `مرحباً! أنا "VEX"، المساعد الذكي لهذا المنتج (${activeProduct.name}). هل لديك أي استفسار حول سعره أو مواصفاته؟ للعلم، هذا التطبيق من تطوير المهندس ضياف أيمن.`
        : 'أهلاً بك في DZ Market! أنا "VEX"، مساعدك التجاري الذكي. كيف يمكنني مساعدتك في استكشاف السوق الجزائري أو العالمي اليوم؟ 🇩🇿' 
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

    let result;
    if (activeProduct) {
      result = await chatWithProductAI(userMsg, activeProduct);
    } else {
      result = await generalAIChat(userMsg);
    }
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: result?.text || 'عذراً، VEX واجه مشكلة تقنية.',
      sources: result?.sources
    }]);
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[550px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-dz-green p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">VEX - المساعد الذكي</p>
            <p className="text-[10px] text-white/70">متصل الآن بـ Google Search 🌐</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-br-none border border-gray-100 dark:border-gray-700' 
                : 'bg-dz-green text-white rounded-bl-none'
            }`}>
              {m.text}
              
              {/* Sources Rendering */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/20">
                  <p className="text-[10px] font-bold mb-1 flex items-center gap-1">
                    <LinkIcon size={10} /> المصادر والمعلومات الإضافية:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {m.sources.map((chunk, i) => (
                      chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                          {chunk.web.title || 'رابط خارجي'} <ExternalLink size={8} />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-dz-green/10 text-dz-green dark:text-dz-green/80 p-3 rounded-2xl rounded-bl-none animate-pulse text-xs flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-dz-green rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-dz-green rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-dz-green rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              VEX يقوم بالبحث والتحليل...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل VEX عن السوق، الموثوقية، أو المطور..."
            className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none focus:ring-0 text-gray-800 dark:text-white placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="text-dz-green hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full transition-all disabled:text-gray-300 dark:disabled:text-gray-600"
          >
            <Send size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
