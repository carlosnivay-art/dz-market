
import React, { useState } from 'react';
import { 
  User, Package, Settings, LogOut, 
  ChevronLeft, ChevronRight, Star, ShieldCheck, CreditCard,
  MapPin, Heart, Sparkles, Box, Clock
} from 'lucide-react';

interface BuyerProfileScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({ onClose, onLogout }) => {
  const [lang, setLang] = useState<'ar' | 'fr' | 'en'>('ar');

  const t = {
    ar: { dir: 'rtl', profile: 'الملف الشخصي', points: 'نقطة مكافأة', orders: 'طلباتي', settings: 'الإعدادات', logout: 'تسجيل الخروج', activeOrders: 'الطلبات النشطة' },
    fr: { dir: 'ltr', profile: 'Profil', points: 'points bonus', orders: 'Mes commandes', settings: 'Paramètres', logout: 'Déconnexion', activeOrders: 'Commandes actives' },
    en: { dir: 'ltr', profile: 'Profile', points: 'reward points', orders: 'My Orders', settings: 'Settings', logout: 'Logout', activeOrders: 'Active Orders' }
  }[lang];

  return (
    <div className="fixed inset-0 z-[80] bg-gray-50 flex flex-col font-['Cairo'] overflow-hidden" dir={t.dir}>
      {/* Header */}
      <div className="bg-dz-green text-white p-6 pb-20 rounded-b-[3rem] shadow-xl relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
             {t.dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <h2 className="text-xl font-black">{t.profile}</h2>
          <div className="w-10"></div>
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
      <div className="flex-1 overflow-y-auto p-6 -mt-10 space-y-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 grid grid-cols-2 gap-4">
           <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Box className="mx-auto mb-2 text-dz-green" />
              <p className="text-xs text-gray-400 font-bold">إجمالي الطلبات</p>
              <p className="text-xl font-black text-gray-800">24</p>
           </div>
           <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <Star className="mx-auto mb-2 text-dz-orange" />
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

        {/* Account Settings */}
        <section className="space-y-3 pb-10">
           <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t.settings}</h5>
           
           <button className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><MapPin size={20} /></div>
                 <span className="font-bold text-sm text-gray-700">عناوين التوصيل</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-dz-green transition-all" />
           </button>

           <button className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all"><Heart size={20} /></div>
                 <span className="font-bold text-sm text-gray-700">المفضلة</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-dz-green transition-all" />
           </button>

           <button className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-dz-orange group-hover:text-white transition-all"><CreditCard size={20} /></div>
                 <span className="font-bold text-sm text-gray-700">طرق الدفع</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-dz-green transition-all" />
           </button>

           <button 
             onClick={onLogout}
             className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group shadow-sm border border-gray-100 hover:bg-red-50 transition-all mt-4"
           >
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-gray-100 text-gray-400 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <LogOut size={20} />
                 </div>
                 <span className="font-bold text-sm text-gray-500 group-hover:text-red-600 transition-colors">{t.logout}</span>
              </div>
              <ChevronLeft size={18} className="text-gray-200 group-hover:text-red-600 transition-all" />
           </button>
        </section>
      </div>
    </div>
  );
};

export default BuyerProfileScreen;
