
import React, { useState } from 'react';
import { MessageSquare, X, ChevronRight, Sparkles, Search, Ghost } from 'lucide-react';

interface MessagesScreenProps {
  onClose: () => void;
}

const INITIAL_MESSAGES = [
  { id: 1, sender: 'متجر النخلة', lastMsg: 'هل تريد اللون الأسود أم الأبيض؟', time: '10:30 ص', unread: 2, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Nakhla', type: 'merchant' },
  { id: 2, sender: 'DZ Tech', lastMsg: 'نعم، التوصيل متوفر لولاية تلمسان.', time: 'أمس', unread: 0, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tech', type: 'merchant' },
  { id: 3, sender: 'المساعد الذكي', lastMsg: 'كيف يمكنني مساعدتك في العثور على منتج اليوم؟', time: 'أمس', unread: 0, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gemini', type: 'ai' },
];

const MessagesScreen: React.FC<MessagesScreenProps> = ({ onClose }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const hideMessage = (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 flex flex-col font-['Cairo'] animate-in slide-in-from-left duration-300" dir="rtl">
      <div className="bg-white p-6 flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-dz-green/10 p-2 rounded-xl text-dz-green">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-xl font-black text-gray-800">رسائلي</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 bg-white border-b">
        <div className="relative">
          <input 
            type="text" 
            placeholder="بحث في المحادثات..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-12 text-sm focus:ring-2 focus:ring-dz-green transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? messages.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-dz-green transition-all cursor-pointer group relative">
             <div className="relative">
                <img src={m.avatar} className="w-14 h-14 rounded-2xl object-cover bg-gray-50 group-hover:scale-110 transition-transform" alt="S" />
                {m.type === 'ai' && (
                  <div className="absolute -top-1 -right-1 bg-dz-green text-white p-1 rounded-full border-2 border-white">
                    <Sparkles size={8} />
                  </div>
                )}
             </div>
             <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                   <h4 className="font-black text-gray-800 text-sm truncate">{m.sender}</h4>
                   <span className="text-[10px] text-gray-400 font-bold">{m.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.lastMsg}</p>
             </div>
             
             <div className="flex items-center gap-2">
                {m.unread > 0 && (
                  <div className="bg-dz-orange text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                    {m.unread}
                  </div>
                )}
                
                {/* Hide Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    hideMessage(m.id);
                  }}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="إخفاء المحادثة"
                >
                  <X size={16} />
                </button>

                <ChevronRight size={18} className="text-gray-200 rotate-180" />
             </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
             <Ghost size={48} className="mb-4" />
             <p className="font-bold">لا توجد رسائل حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesScreen;
