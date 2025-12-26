
import React from 'react';
import { 
  X, User, ShieldCheck, Languages, Wallet, Bell, Video, 
  Sparkles, Info, LogOut, ChevronLeft, Palette, Lock, 
  Smartphone, MessageCircle, HelpCircle, CreditCard, Eye
} from 'lucide-react';

interface SettingsScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onLogout }) => {
  const sections = [
    {
      id: 'account',
      title: 'قسم الحساب',
      subtitle: 'إدارة المعلومات الشخصية والملف',
      icon: <User size={22} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 'security',
      title: 'قسم الأمان',
      subtitle: 'كلمة المرور، التحقق الثنائي والخصوصية',
      icon: <ShieldCheck size={22} />,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      id: 'appearance',
      title: 'قسم اللغة والمظهر',
      subtitle: 'تغيير اللغة، الوضع الليلي والألوان',
      icon: <Palette size={22} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 'payments',
      title: 'قسم الدفع والرصيد',
      subtitle: 'إدارة بطاقات الدفع ورصيد بريدي موب',
      icon: <Wallet size={22} />,
      color: 'text-dz-green',
      bg: 'bg-dz-green/10'
    },
    {
      id: 'notifications',
      title: 'قسم الإشعارات',
      subtitle: 'تخصيص التنبيهات والرسائل الإخبارية',
      icon: <Bell size={22} />,
      color: 'text-dz-orange',
      bg: 'bg-dz-orange/10'
    },
    {
      id: 'live_comm',
      title: 'قسم اللايف والتواصل',
      subtitle: 'إعدادات البث المباشر والمحادثات',
      icon: <Video size={22} />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      id: 'ai_settings',
      title: 'قسم الذكاء الاصطناعي',
      subtitle: 'تخصيص مساعد مبيعات Gemini AI',
      icon: <Sparkles size={22} />,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      id: 'support_info',
      title: 'قسم الدعم والمعلومات',
      subtitle: 'مركز المساعدة، الشروط والسياسات',
      icon: <Info size={22} />,
      color: 'text-gray-600',
      bg: 'bg-gray-100'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col font-['Cairo'] animate-in slide-in-from-bottom duration-500" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 flex items-center justify-between border-b sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-black text-gray-800">الإعدادات والتفضيلات</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sections.map((s) => (
          <button 
            key={s.id}
            className="w-full bg-white p-4 rounded-[2rem] flex items-center justify-between group hover:shadow-md border border-gray-100 transition-all text-right"
          >
            <div className="flex items-center gap-4">
               <div className={`p-3 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                  {s.icon}
               </div>
               <div>
                  <h3 className="font-black text-gray-800 text-sm">{s.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{s.subtitle}</p>
               </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:text-dz-green transition-colors">
               <ChevronLeft size={18} />
            </div>
          </button>
        ))}

        {/* Logout Section */}
        <button 
          onClick={onLogout}
          className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between group shadow-sm border border-red-50 hover:bg-red-50 transition-all mt-6"
        >
          <div className="flex items-center gap-4 text-red-600">
             <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                <LogOut size={22} />
             </div>
             <div>
                <h3 className="font-black text-sm uppercase tracking-wider">تسجيل الخروج</h3>
                <p className="text-[10px] font-bold opacity-60">نراك لاحقاً في سوقنا الذكي</p>
             </div>
          </div>
          <ChevronLeft size={18} className="text-red-200 group-hover:text-red-600" />
        </button>
        
        <div className="py-10 text-center space-y-1">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">DZ Market v2.5.0</p>
           <p className="text-[9px] font-bold text-gray-400">صنع بكل ❤️ في الجزائر</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
