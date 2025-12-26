
import React, { useState } from 'react';
import { 
  User, Package, Settings, LogOut, 
  ChevronLeft, ChevronRight, Star, ShieldCheck, CreditCard,
  MapPin, Heart, Sparkles, Box, Clock, Copy, Wifi
} from 'lucide-react';
import SettingsScreen from './SettingsScreen';

interface BuyerProfileScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

const BaridimobCard = () => {
  const [copied, setCopied] = useState(false);
  const ripNumber = "00799999000123456789";

  const handleCopy = () => {
    navigator.clipboard.writeText(ripNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#1E6B52] via-[#2a8a6b] to-[#1E6B52] rounded-[2rem] p-6 text-white shadow-2xl overflow-hidden border border-white/20 group">
      {/* Background Patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-dz-orange/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-dz-orange/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
      
      {/* Card Content */}
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Algerie Poste</span>
            <span className="text-xl font-black italic tracking-tighter">BARIDIMOB</span>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/10">
            <Wifi size={20} className="rotate-90 opacity-80" />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md relative overflow-hidden shadow-inner border border-yellow-200/50">
             <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border border-black/10"></div><div className="border border-black/10"></div><div className="border border-black/10"></div>
                <div className="border border-black/10"></div><div className="border border-black/10"></div><div className="border border-black/10"></div>
                <div className="border border-black/10"></div><div className="border border-black/10"></div><div className="border border-black/10"></div>
             </div>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] font-bold opacity-60">رقم الحساب (RIP)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold tracking-widest">
                  00799 **** **** 6789
                </span>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                  title="نسخ رقم الـ RIP"
                >
                  <Copy size={14} className={copied ? "text-yellow-400" : "text-white"} />
                </button>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <span className="text-[8px] font-bold opacity-60 block uppercase">Card Holder</span>
            <span className="text-sm font-black tracking-wide">AMINE DZIRI</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-1 mb-1">
              <div className="w-6 h-6 rounded-full bg-dz-orange/80 backdrop-blur-sm -mr-2"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500/80 backdrop-blur-sm"></div>
            </div>
            <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full border border-white/10">DZ-PAY READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({ onClose, onLogout }) => {
  const [lang, setLang] = useState<'ar' | 'fr' | 'en'>('ar');
  const [showSettings, setShowSettings] = useState(false);

  const t = {
    ar: { dir: 'rtl', profile: 'الملف الشخصي', points: 'نقطة مكافأة', orders: 'طلباتي', settings: 'الإعدادات', logout: 'تسجيل الخروج', activeOrders: 'الطلبات النشطة', wallet: 'محفظة بريدي موب' },
    fr: { dir: 'ltr', profile: 'Profil', points: 'points bonus', orders: 'Mes commandes', settings: 'Paramètres', logout: 'Déconnexion', activeOrders: 'Commandes actives', wallet: 'Portefeuille Baridimob' },
    en: { dir: 'ltr', profile: 'Profile', points: 'reward points', orders: 'My Orders', settings: 'Settings', logout: 'Logout', activeOrders: 'Active Orders', wallet: 'Baridimob Wallet' }
  }[lang];

  if (showSettings) {
    return <SettingsScreen onClose={() => setShowSettings(false)} onLogout={onLogout} />;
  }

  return (
    <div className="fixed inset-0 z-[80] bg-gray-50 flex flex-col font-['Cairo'] overflow-hidden" dir={t.dir}>
      {/* Header */}
      <div className="bg-dz-green text-white p-6 pb-24 rounded-b-[3.5rem] shadow-xl relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
             {t.dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <h2 className="text-xl font-black">{t.profile}</h2>
          <div className="w-10 flex justify-end">
            <Settings 
              size={24} 
              className="opacity-70 hover:opacity-100 hover:rotate-90 transition-all cursor-pointer" 
              onClick={() => setShowSettings(true)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
           <div className="relative">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                className="w-20 h-20 rounded-3xl border-4 border-white shadow-2xl" 
                alt="Avatar" 
              />
              <div className="absolute -bottom-2 -right-2 bg-dz-orange p-1.5 rounded-lg border-2 border-white text-white">
                 <ShieldCheck size={16} />
              </div>
           </div>
           <div>
              <h3 className="text-2xl font-black">أمين دزيري</h3>
              <p className="text-white/70 text-sm font-medium">مشتري بلاتيني 💎</p>
              <div className="mt-2 bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                 <Sparkles size={12} className="text-yellow-300" /> 1,250 {t.points}
              </div>
           </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="flex-1 overflow-y-auto p-6 -mt-12 space-y-6">
        
        {/* Baridimob Digital Card */}
        <section className="animate-in slide-in-from-bottom-10 duration-500 delay-100">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">{t.wallet}</h3>
            <span className="text-[10px] font-bold text-dz-green flex items-center gap-1 bg-dz-green/10 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-dz-green rounded-full animate-pulse"></div> نشط
            </span>
          </div>
          <BaridimobCard />
        </section>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 grid grid-cols-2 gap-4">
           <div className="text-center p-4 bg-gray-50 rounded-2xl group hover:bg-dz-green/5 transition-colors cursor-pointer">
              <Box className="mx-auto mb-2 text-dz-green group-hover:scale-110 transition-transform" />
              <p className="text-xs text-gray-400 font-bold">إجمالي الطلبات</p>
              <p className="text-xl font-black text-gray-800">24</p>
           </div>
           <div className="text-center p-4 bg-gray-50 rounded-2xl group hover:bg-dz-orange/5 transition-colors cursor-pointer">
              <Star className="mx-auto mb-2 text-dz-orange group-hover:scale-110 transition-transform" />
              <p className="text-xs text-gray-400 font-bold">التقييمات</p>
              <p className="text-xl font-black text-gray-800">12</p>
           </div>
        </div>

        {/* Orders Section */}
        <section>
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 px-2">{t.activeOrders}</h3>
          <div className="bg-white p-8 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Package size={32} />
             </div>
             <p className="text-gray-400 font-bold text-sm">لا توجد طلبات نشطة حالياً</p>
             <button className="mt-4 text-dz-green font-black text-xs underline">تصفح المنتجات</button>
          </div>
        </section>

        {/* Account Quick Settings */}
        <section className="space-y-3 pb-10">
           <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t.settings}</h5>
           
           <button onClick={() => setShowSettings(true)} className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-50 hover:border-dz-green transition-all">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Settings size={20} /></div>
                 <span className="font-bold text-sm text-gray-700">جميع الإعدادات</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-dz-green transition-all" />
           </button>

           <button 
             onClick={onLogout}
             className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-100 hover:bg-red-50 transition-all mt-4"
           >
              <div className="flex items-center gap-4 text-red-600 opacity-60 group-hover:opacity-100">
                 <div className="p-2 bg-gray-100 text-gray-400 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <LogOut size={20} />
                 </div>
                 <span className="font-bold text-sm group-hover:text-red-600 transition-colors">{t.logout}</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-red-600 transition-all" />
           </button>
        </section>
      </div>
    </div>
  );
};

export default BuyerProfileScreen;
