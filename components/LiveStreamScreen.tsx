
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Users, Heart, Share2, ShoppingBag, Send, 
  Sparkles, Trophy, Clock, ChevronRight, ChevronLeft,
  Facebook, Instagram, MessageCircle
} from 'lucide-react';
import { Product } from '../types';

interface LiveStreamScreenProps {
  product: Product;
  onClose: () => void;
  onBuyNow: (discountedPrice: number) => void;
}

type Language = 'ar' | 'fr' | 'en';

const i18n = {
  ar: {
    dir: 'rtl',
    header: 'الدفع الآمن ومكافآت المشاهدين',
    watchAndEarn: 'شاهد واكسب خصم',
    currentDiscount: 'خصمك الحالي',
    buyNow: 'اشترِ الآن بخصم',
    share: 'شارك البث',
    live: 'مباشر',
    viewers: 'مشاهد',
    placeholder: 'اكتب تعليقاً...',
    footer: 'دفع آمن | توصيل سريع | دعم 24/7'
  },
  fr: {
    dir: 'ltr',
    header: 'Paiement sécurisé et récompenses',
    watchAndEarn: 'Regardez et gagnez',
    currentDiscount: 'Remise actuelle',
    buyNow: 'Acheter avec remise',
    share: 'Partager le live',
    live: 'EN DIRECT',
    viewers: 'spectateurs',
    placeholder: 'Écrivez un commentaire...',
    footer: 'Paiement sécurisé | Livraison rapide | Support 24/7'
  },
  en: {
    dir: 'ltr',
    header: 'Secure Payment & Rewards',
    watchAndEarn: 'Watch & Earn Discount',
    currentDiscount: 'Your Discount',
    buyNow: 'Buy with Discount',
    share: 'Share Live',
    live: 'LIVE',
    viewers: 'viewers',
    placeholder: 'Write a comment...',
    footer: 'Secure Payment | Fast Delivery | 24/7 Support'
  }
};

const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({ product, onClose, onBuyNow }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [likes, setLikes] = useState(124);
  const [comments, setComments] = useState([
    { user: 'صالح', text: 'ما شاء الله السعر هبال!' },
    { user: 'Amine', text: 'Est-ce qu\'il y a la livraison à Oran?' },
    { user: 'Kamel', text: 'Top quality 🇩🇿' }
  ]);
  const [input, setInput] = useState('');
  const t = i18n[lang];

  // Logic: 10 DA discount for every 10 seconds watched, max 500 DA
  const maxDiscount = 500;
  const currentDiscount = Math.min(maxDiscount, Math.floor(watchedSeconds / 10) * 10);
  const discountedPrice = product.price - currentDiscount;

  useEffect(() => {
    const timer = setInterval(() => {
      setWatchedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendComment = () => {
    if (!input.trim()) return;
    setComments([...comments, { user: 'أنت', text: input }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col font-['Cairo'] overflow-hidden" dir={t.dir}>
      {/* Background Video Simulator */}
      <div className="absolute inset-0 z-0">
        <img 
          src={product.image} 
          className="w-full h-full object-cover opacity-60 blur-sm scale-110" 
          alt="Live BG" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        {/* Animated Visualizer Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <div className="w-64 h-64 border-8 border-dz-green rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div> {t.live}
          </div>
          <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10">
            <Users size={14} /> 1.2k {t.viewers}
          </div>
        </div>
        <button onClick={onClose} className="bg-black/40 p-2 rounded-full text-white border border-white/10">
          <X size={24} />
        </button>
      </div>

      {/* Rewards Progress Bar */}
      <div className="relative z-10 px-6 mt-2">
         <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2 text-white">
                  <Trophy size={18} className="text-yellow-400" />
                  <span className="text-xs font-bold">{t.watchAndEarn}</span>
               </div>
               <span className="text-dz-orange font-black text-sm">+{currentDiscount} دج</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-dz-orange transition-all duration-1000" 
                 style={{ width: `${(currentDiscount / maxDiscount) * 100}%` }}
               ></div>
            </div>
         </div>
      </div>

      {/* Main Content Area (Chat & Interactions) */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 space-y-4">
        
        {/* Chat Messages */}
        <div className="max-h-48 overflow-y-auto space-y-2 flex flex-col justify-end">
           {comments.map((c, i) => (
             <div key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-right-5">
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black text-white">{c.user}</span>
                <p className="text-white text-xs drop-shadow-md">{c.text}</p>
             </div>
           ))}
        </div>

        {/* Input & Quick Buttons */}
        <div className="flex items-center gap-3">
           <div className="flex-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-1 flex items-center">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
               placeholder={t.placeholder}
               className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:ring-0"
             />
             <button onClick={handleSendComment} className="p-2 text-dz-green">
               <Send size={20} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
             </button>
           </div>
           <button onClick={() => setLikes(l => l + 1)} className="bg-red-500 text-white p-3 rounded-full shadow-lg animate-pulse">
             <Heart size={24} fill="currentColor" />
           </button>
        </div>

        {/* Live Product Card */}
        <div className="bg-white rounded-[2.5rem] p-4 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-10">
           <div className="relative">
             <img src={product.image} className="w-20 h-20 rounded-2xl object-cover border-2 border-dz-green" alt="P" />
             <div className="absolute -top-2 -right-2 bg-dz-orange text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-md">
                - {currentDiscount} دج
             </div>
           </div>
           <div className="flex-1">
             <h4 className="font-black text-gray-800 text-sm mb-1">{product.name}</h4>
             <div className="flex items-baseline gap-2">
                <span className="text-dz-green font-black text-lg">{discountedPrice.toLocaleString()} دج</span>
                <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} دج</span>
             </div>
           </div>
           <button 
             onClick={() => onBuyNow(discountedPrice)}
             className="bg-dz-green text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-dz-green/20"
           >
             <ShoppingBag size={18} /> {t.buyNow.split(' ')[0]}
           </button>
        </div>

        {/* Social Share & Footer */}
        <div className="flex items-center justify-between pt-2">
           <div className="flex gap-2">
              <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><Facebook size={14}/></button>
              <button className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white"><Instagram size={14}/></button>
              <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white"><Share2 size={14}/></button>
           </div>
           <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t.footer}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamScreen;
