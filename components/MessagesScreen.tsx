import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, ChevronRight, Sparkles, Search, Ghost, Send, 
  Clock, ShieldCheck, Phone, Check, CheckCheck, MessageCircle 
} from 'lucide-react';
import { db } from '../services/db';
import { User, ChatThread, ChatMessage } from '../types';

interface MessagesScreenProps {
  currentUser: User;
  onClose: () => void;
  openChatWithUserId?: string; // Optional deep link to open a chat immediately
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ currentUser, onClose, openChatWithUserId }) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(openChatWithUserId || null);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat threads
  const loadThreads = () => {
    const userThreads = db.getChatThreads(currentUser.id);
    setThreads(userThreads);
  };

  useEffect(() => {
    loadThreads();
    // Setup interval to simulate real-time updates / check for new messages
    const interval = setInterval(() => {
      loadThreads();
      if (activePartnerId) {
        const history = db.getChatHistory(currentUser.id, activePartnerId);
        setChatMessages(history);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentUser.id, activePartnerId]);

  // Load active partner info and chat history when active partner changes
  useEffect(() => {
    if (activePartnerId) {
      const partner = db.getUser(activePartnerId);
      if (partner) {
        setActivePartner(partner);
        const history = db.getChatHistory(currentUser.id, activePartnerId);
        setChatMessages(history);
        // Mark messages as read in backend, then reload threads
        loadThreads();
      }
    } else {
      setActivePartner(null);
      setChatMessages([]);
    }
  }, [activePartnerId, currentUser.id]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    // Send via db
    db.sendMessage(currentUser.id, activePartnerId, inputText.trim());
    setInputText('');

    // Reload history and threads
    const history = db.getChatHistory(currentUser.id, activePartnerId);
    setChatMessages(history);
    loadThreads();
  };

  const getRelativeActiveTime = (isoString: string) => {
    if (!isoString) return 'غير متصل';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 5) return 'متصل الآن 🟢';
    if (diffMins < 60) return `نشط منذ ${diffMins} د`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `نشط منذ ${diffHours} س`;
    return `نشط منذ ${Math.floor(diffHours / 24)} يوم`;
  };

  const filteredThreads = threads.filter(t => 
    t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 dark:bg-gray-950 flex flex-col font-['Cairo'] animate-in slide-in-from-left duration-300" dir="rtl">
      
      {/* 1. Main Threads View */}
      {!activePartnerId ? (
        <>
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 p-4 md:p-6 flex items-center justify-between border-b dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-dz-green/10 p-2.5 rounded-2xl text-dz-green">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-800 dark:text-white">رسائلي ومحادثاتي</h2>
                <p className="text-[10px] text-gray-400 font-bold">تواصل مباشر وآمن مع الباعة والمشترين 🇩🇿</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-500 dark:text-gray-400">
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="البحث في المحادثات بالاسم أو المحتوى..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 pr-12 pl-4 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green focus:bg-white transition-all outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((t) => (
                <div 
                  key={t.chatId} 
                  onClick={() => setActivePartnerId(t.participantId)}
                  className="bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-dz-green dark:hover:border-dz-green transition-all cursor-pointer group relative"
                >
                  <div className="relative flex-shrink-0">
                    <img src={t.participantAvatar} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover bg-gray-50 dark:bg-gray-800 group-hover:scale-105 transition-transform" alt="Avatar" />
                    {t.participantRole === 'seller' && (
                      <div className="absolute -top-1 -right-1 bg-dz-green text-white p-0.5 rounded-full border border-white dark:border-gray-900" title="بائع موثوق">
                        <ShieldCheck size={10} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-gray-800 dark:text-white text-xs md:text-sm truncate">{t.participantName}</h4>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          t.participantRole === 'seller' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' 
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                        }`}>
                          {t.participantRole === 'seller' ? 'بائع' : 'مشتري'}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{t.lastMessageTime}</span>
                    </div>
                    <p className={`text-xs truncate ${t.unreadCount > 0 ? 'text-dz-text dark:text-gray-200 font-black' : 'text-gray-500 dark:text-gray-400'}`}>
                      {t.lastMessage}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.unreadCount > 0 && (
                      <div className="bg-dz-orange text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-lg">
                        {t.unreadCount}
                      </div>
                    )}
                    <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 rotate-180" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                <Ghost size={48} className="mb-4 text-dz-green animate-bounce" />
                <p className="font-black text-sm text-gray-500 dark:text-gray-400">لا توجد رسائل نشطة</p>
                <p className="text-[10px] text-gray-400 mt-1">تصفح المنتجات واضغط على زر "مراسلة البائع" لبدء دردشة!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        
        /* 2. Chat Conversation View */
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
          
          {/* Conversation Header */}
          <div className="bg-white dark:bg-gray-900 p-4 flex items-center justify-between border-b dark:border-gray-800 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setActivePartnerId(null)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-500 dark:text-gray-400"
              >
                <ChevronRight size={22} />
              </button>
              
              <div className="relative flex-shrink-0">
                <img src={activePartner?.avatar} className="w-10 h-10 rounded-xl object-cover bg-gray-50 dark:bg-gray-800" alt="Avatar" />
                {activePartner?.isVerified && (
                  <div className="absolute -top-1 -right-1 bg-dz-green text-white p-0.5 rounded-full border border-white dark:border-gray-900" title="بائع موثوق">
                    <ShieldCheck size={10} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-gray-800 dark:text-white text-xs md:text-sm truncate flex items-center gap-1.5">
                  {activePartner?.name}
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                    activePartner?.role === 'seller' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                  }`}>
                    {activePartner?.role === 'seller' ? 'بائع' : 'مشتري'}
                  </span>
                </h3>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">
                  {activePartner ? getRelativeActiveTime(activePartner.lastActive) : 'تحميل...'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {activePartner?.phone && (
                <a 
                  href={`tel:${activePartner.phone}`} 
                  className="p-2 hover:bg-dz-green/10 text-dz-green rounded-xl transition-all"
                  title="اتصال هاتي"
                >
                  <Phone size={18} />
                </a>
              )}
              <button 
                onClick={() => setActivePartnerId(null)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] ${isMe ? 'self-start items-start' : 'self-end items-end'}`}
                  >
                    <div className={`p-3.5 rounded-3xl text-xs md:text-sm ${
                      isMe 
                        ? 'bg-dz-green text-white rounded-br-none shadow-sm' 
                        : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-800 rounded-bl-none shadow-xs'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1.5">
                      <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <span className="text-gray-400 dark:text-gray-500">
                          {msg.isRead ? <CheckCheck size={10} className="text-dz-green" /> : <Check size={10} />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                <MessageCircle size={40} className="text-dz-green mb-3" />
                <p className="font-black text-xs text-gray-500">ابدأ المحادثة الآن!</p>
                <p className="text-[9px] text-gray-400 text-center max-w-[180px] mt-1">تكلم بأدب واحترام. تذكر أن DZ MARKET يضمن بيئة تسوق آمنة للجميع.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Message Input form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="اكتب رسالتك هنا..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green focus:bg-white outline-none"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-dz-green text-white p-3 rounded-2xl shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Send size={16} className="rotate-180" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default MessagesScreen;
