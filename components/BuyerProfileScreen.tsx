
import React, { useState } from 'react';
import { 
  User, Package, Settings, LogOut, 
  ChevronLeft, ChevronRight, Star, ShieldCheck, CreditCard,
  MapPin, Heart, Sparkles, Box, Clock, Copy, Wifi, Grid, Bookmark, 
  Image as ImageIcon, Share2, Edit3, Facebook, Instagram, Twitter, MessageCircle
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../constants';
import { User as UserType } from '../types';
import SettingsScreen from './SettingsScreen';

interface BuyerProfileScreenProps {
  user: UserType;
  onClose: () => void;
  onLogout: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const MOCK_USER_POSTS = [
  { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", likes: 124, comments: 12 },
  { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", likes: 89, comments: 5 },
  { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", likes: 256, comments: 45 },
  { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", likes: 67, comments: 8 },
  { url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80", likes: 312, comments: 22 },
  { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80", likes: 145, comments: 19 },
];

const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({ user, onClose, onLogout, currentLang, onLangChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const t = TRANSLATIONS[currentLang];

  const handleOpenSettings = (section: string | null = null) => {
    setActiveSettingsSection(section);
    setShowSettings(true);
  };

  if (showSettings) {
    return (
      <SettingsScreen 
        onClose={() => setShowSettings(false)} 
        onLogout={onLogout} 
        currentLang={currentLang}
        onLangChange={onLangChange}
        initialSection={activeSettingsSection}
      />
    );
  }

  const roleLabel = user.role === 'seller' ? t.platinumSeller : t.platinumBuyer;
  const userHandle = user.email ? user.email.split('@')[0] : 'dz_user';

  return (
    <div className="fixed inset-0 z-[80] bg-white dark:bg-gray-950 flex flex-col font-['Cairo'] overflow-hidden transition-colors duration-300" dir={t.dir}>
      {/* Top Header Navigation */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
             {t.dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <span className="font-black text-gray-800 dark:text-white">{userHandle}</span>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
             <Share2 size={20} />
           </button>
           <button onClick={() => handleOpenSettings(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
             <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Info Section */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2.5rem] p-1 bg-gradient-to-tr from-dz-orange to-yellow-400">
                <img 
                  src={user.avatar} 
                  className="w-full h-full rounded-[2.3rem] border-4 border-white dark:border-gray-900 object-cover bg-white" 
                  alt="Avatar" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-dz-green p-1.5 rounded-xl border-2 border-white dark:border-gray-900 text-white shadow-lg">
                 <ShieldCheck size={16} />
              </div>
            </div>

            <div className="flex-1 flex justify-around text-center">
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">42</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.posts}</p>
              </div>
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">1.2k</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.followers}</p>
              </div>
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">156</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.following}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h3 className="text-xl font-black text-gray-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{roleLabel} | محب للتكنولوجيا 📱</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
              أبحث دائماً عن أفضل الصفقات في الجزائر 🇩🇿. مهتم بالإلكترونيات والمنتجات المبتكرة.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <MapPin size={14} className="text-dz-green" />
              <span className="text-xs font-bold text-dz-green">الجزائر العاصمة</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 mb-6">
            <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Facebook size={18}/></button>
            <button className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-xl"><Instagram size={18}/></button>
            <button className="p-2 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-xl"><Twitter size={18}/></button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleOpenSettings('account')}
              className="flex-1 bg-dz-green text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-dz-green/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Edit3 size={16} /> تعديل الملف
            </button>
            <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
              إحصائيات
            </button>
          </div>
        </div>

        {/* Tabs Selection */}
        <div className="flex border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[60px] z-10">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === 'posts' ? 'text-dz-green' : 'text-gray-400'
            }`}
          >
            <Grid size={20} className={activeTab === 'posts' ? 'scale-110' : ''} />
            <span className="text-[10px] font-black uppercase tracking-wider">{t.myPosts}</span>
            {activeTab === 'posts' && <div className="absolute bottom-0 w-1/2 h-1 bg-dz-green rounded-t-full"></div>}
          </button>
          
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === 'saved' ? 'text-dz-green' : 'text-gray-400'
            }`}
          >
            <Bookmark size={20} className={activeTab === 'saved' ? 'scale-110' : ''} />
            <span className="text-[10px] font-black uppercase tracking-wider">{t.savedItems}</span>
            {activeTab === 'saved' && <div className="absolute bottom-0 w-1/2 h-1 bg-dz-green rounded-t-full"></div>}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'posts' ? (
          <div className="grid grid-cols-3 gap-0.5 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-900 pb-20">
            {MOCK_USER_POSTS.map((post, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-800">
                 <img 
                   src={post.url} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                   alt={`Post ${i}`} 
                 />
                 {/* Interaction Overlay on Hover */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart size={18} className="fill-current" />
                      <span className="text-xs font-black">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={18} className="fill-current" />
                      <span className="text-xs font-black">{post.comments}</span>
                    </div>
                 </div>
              </div>
            ))}
            {/* Empty placeholders to fill the grid if needed */}
            {[...Array(3)].map((_, i) => (
               <div key={`extra-${i}`} className="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center opacity-30">
                  <ImageIcon size={24} className="text-gray-300" />
               </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in slide-in-from-bottom-5">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700">
               <Bookmark size={40} />
            </div>
            <div>
              <h4 className="font-black text-gray-800 dark:text-gray-200">لا توجد محفوظات</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold max-w-[200px] mx-auto">احفظ المنتجات التي تعجبك لتجدها هنا لاحقاً.</p>
            </div>
            <button 
              onClick={onClose}
              className="bg-dz-orange text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-dz-orange/20"
            >
              استكشف السوق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerProfileScreen;
