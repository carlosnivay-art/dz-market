
import React, { useState, useEffect } from 'react';
import { 
  X, User, ShieldCheck, Wallet, Bell, Palette, LogOut, 
  ChevronLeft, ArrowRight, CheckCircle2, Loader2,
  Video, Heart, MessageCircle, Share2, Facebook, Instagram, Smartphone,
  Radio, Tag, Zap, Package, Headphones, HelpCircle, FileText, Lock, Star, Info, Mail, Phone, ChevronDown,
  Sparkles, Bot, Brain, Trash2, MessageSquareText, KeyRound, Fingerprint, MonitorSmartphone,
  CreditCard, History, ArrowUpRight, ArrowDownLeft, Plus, Volume2, Globe, BellRing, Ghost
} from 'lucide-react';
import { Language, TRANSLATIONS, WILAYAS } from '../constants';

interface SettingsScreenProps {
  onClose: () => void;
  onLogout: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onLogout, currentLang, onLangChange }) => {
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User Info States
  const [userInfo, setUserInfo] = useState({
    name: 'أمين دزيري',
    phone: '0550112233',
    email: 'amin@dz-market.com',
    wilaya: 'Alger'
  });

  // Notification States
  const [notifs, setNotifs] = useState({
    push: true,
    orders: true,
    offers: true,
    live: true,
    wallet: true
  });

  // Live & Social States
  const [social, setSocial] = useState({
    showLinks: true,
    liveNotif: true,
    soundEffects: true
  });

  // AI Settings States
  const [enableVex, setEnableVex] = useState(true);
  const [customizeSuggestions, setCustomizeSuggestions] = useState(true);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  // Security States
  const [enable2FA, setEnable2FA] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  // Appearance & Language Local States
  const [tempLang, setTempLang] = useState<Language>(currentLang);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dz-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dz-theme', 'light');
    }
  }, [theme]);

  const sections = [
    { 
      id: 'account', 
      title: currentLang === 'ar' ? 'بيانات الحساب' : 'Account Info', 
      subtitle: currentLang === 'ar' ? 'تغيير الاسم، الهاتف والبريد' : 'Personal Info', 
      icon: <User size={22} />, 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      color: 'text-blue-600 dark:text-blue-400' 
    },
    { 
      id: 'security', 
      title: currentLang === 'ar' ? 'قسم الأمان' : 'Security', 
      subtitle: currentLang === 'ar' ? 'كلمة المرور والتحقق والخصوصية' : 'Privacy & 2FA', 
      icon: <ShieldCheck size={22} />, 
      bg: 'bg-orange-50 dark:bg-orange-900/20', 
      color: 'text-orange-600 dark:text-orange-400' 
    },
    { 
      id: 'wallet', 
      title: currentLang === 'ar' ? 'المحفظة والرصيد' : 'Wallet & Balance', 
      subtitle: currentLang === 'ar' ? 'إدارة الأموال والعمليات المالية' : 'Funds & Transactions', 
      icon: <Wallet size={22} />, 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      color: 'text-yellow-600 dark:text-yellow-400' 
    },
    { 
      id: 'live-social', 
      title: currentLang === 'ar' ? 'اللايف والتواصل' : 'Live & Social', 
      subtitle: currentLang === 'ar' ? 'إعدادات البث ووسائل التواصل' : 'Live & Social Settings', 
      icon: <Video size={22} />, 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      color: 'text-red-600 dark:text-red-400' 
    },
    { 
      id: 'ai-settings', 
      title: currentLang === 'ar' ? 'إعدادات الذكاء الاصطناعي' : 'AI Settings', 
      subtitle: currentLang === 'ar' ? 'المساعد VEX واقتراحات ذكية' : 'VEX AI Assistant', 
      icon: <Sparkles size={22} />, 
      bg: 'bg-cyan-50 dark:bg-cyan-900/20', 
      color: 'text-cyan-600 dark:text-cyan-400' 
    },
    { 
      id: 'notifications', 
      title: currentLang === 'ar' ? 'الإشعارات' : 'Notifications', 
      subtitle: currentLang === 'ar' ? 'تخصيص التنبيهات' : 'Manage Alerts', 
      icon: <Bell size={22} />, 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
      color: 'text-emerald-600 dark:text-emerald-400' 
    },
    { 
      id: 'support', 
      title: currentLang === 'ar' ? 'الدعم والمعلومات' : 'Support & Info', 
      subtitle: currentLang === 'ar' ? 'تواصل معنا، الأسئلة والمساعدة' : 'Help & Policies', 
      icon: <Headphones size={22} />, 
      bg: 'bg-dz-orange/10 dark:bg-dz-orange/20', 
      color: 'text-dz-orange' 
    },
    { 
      id: 'appearance', 
      title: currentLang === 'ar' ? 'اللغة والمظهر' : 'Appearance', 
      subtitle: currentLang === 'ar' ? 'تخصيص واجهة التطبيق' : 'Theme & Language', 
      icon: <Palette size={22} />, 
      bg: 'bg-purple-50 dark:bg-purple-900/20', 
      color: 'text-purple-600 dark:text-purple-400' 
    }
  ];

  const handleSaveAction = (type: string) => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      if (type === 'appearance') onLangChange(tempLang);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  const renderAccountSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">تعديل بيانات الحساب</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-5">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">الاسم الكامل</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green dark:text-white"
              value={userInfo.name}
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">رقم الهاتف</label>
            <input 
              type="tel" 
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green dark:text-white"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green dark:text-white"
              value={userInfo.email}
              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">الولاية</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green dark:text-white"
              value={userInfo.wilaya}
              onChange={(e) => setUserInfo({...userInfo, wilaya: e.target.value})}
            >
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button onClick={() => handleSaveAction('account')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">
        {isSaving ? <Loader2 className="animate-spin mx-auto" /> : saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}
      </button>
    </div>
  );

  const renderWalletSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">المحفظة والرصيد</h3>
      </div>

      <div className="bg-dz-green p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold opacity-80 mb-1">الرصيد المتاح</p>
          <h2 className="text-4xl font-black mb-6">12,450.00 <span className="text-xl">دج</span></h2>
          <div className="flex gap-3">
             <button className="flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all">
               <Plus size={16} /> شحن الرصيد
             </button>
             <button className="flex-1 bg-dz-orange py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all">
               <ArrowDownLeft size={16} /> سحب الأموال
             </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-black text-sm text-dz-text dark:text-gray-100 flex items-center gap-2">
             <History size={18} className="text-dz-orange" /> آخر العمليات
          </h4>
          <button className="text-[10px] font-black text-dz-green hover:underline">عرض الكل</button>
        </div>

        <div className="space-y-3">
          {[
            { title: 'شراء سماعات برو', amount: '- 8,500', date: 'منذ يومين', type: 'out', icon: <ArrowUpRight className="text-red-500" /> },
            { title: 'استرجاع مبلغ طلبية', amount: '+ 4,200', date: 'منذ 5 أيام', type: 'in', icon: <ArrowDownLeft className="text-green-500" /> },
            { title: 'شحن المحفظة (بريد موب)', amount: '+ 10,000', date: 'منذ أسبوع', type: 'in', icon: <Plus className="text-dz-green" /> }
          ].map((tx, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-dz-border dark:border-gray-700 card-shadow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tx.type === 'in' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  {tx.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-dz-text dark:text-gray-100">{tx.title}</p>
                  <p className="text-[9px] text-gray-400 font-bold">{tx.date}</p>
                </div>
              </div>
              <p className={`text-xs font-black ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount} دج
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <h4 className="font-black text-sm text-dz-text dark:text-gray-100 flex items-center gap-2">
           <CreditCard size={18} className="text-dz-green" /> الحسابات المرتبطة
        </h4>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-6 bg-dz-orange rounded-md flex items-center justify-center text-[8px] text-white font-black uppercase">EDA HABIA</div>
             <p className="text-[10px] font-black dark:text-white">بطاقة الذهبية (*** 8842)</p>
           </div>
           <CheckCircle2 size={16} className="text-dz-green" />
        </div>
      </div>
    </div>
  );

  const renderSecuritySubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">الأمان والخصوصية</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <KeyRound size={20} className="text-dz-orange" />
           <h4 className="font-black text-sm text-dz-text dark:text-gray-100">تغيير كلمة المرور</h4>
        </div>
        <div className="space-y-3">
          <input 
            type="password" 
            placeholder="كلمة المرور الحالية" 
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green"
            value={passwords.old}
            onChange={(e) => setPasswords({...passwords, old: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="كلمة المرور الجديدة" 
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green"
            value={passwords.new}
            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Fingerprint size={20} className="text-dz-green" />
             <h4 className="font-black text-sm text-dz-text dark:text-gray-100">التحقق بخطوتين (2FA)</h4>
           </div>
           <button 
             onClick={() => setEnable2FA(!enable2FA)}
             className={`w-12 h-6 rounded-full transition-all relative ${enable2FA ? 'bg-dz-green' : 'bg-gray-300'}`}
           >
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enable2FA ? 'right-7' : 'right-1'}`}></div>
           </button>
        </div>
      </div>
      <button onClick={() => handleSaveAction('security')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">
        {isSaving ? <Loader2 className="animate-spin mx-auto" /> : saveSuccess ? 'تم الحفظ!' : 'حفظ إعدادات الأمان'}
      </button>
    </div>
  );

  const renderLiveSocialSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">اللايف والتواصل</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <h4 className="font-black text-sm text-dz-text dark:text-gray-100 flex items-center gap-2 mb-2">
          <Radio size={20} className="text-red-500" /> إعدادات البث المباشر
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <span className="text-xs font-black dark:text-white">تنبيهات البث المباشر</span>
            <button onClick={() => setSocial({...social, liveNotif: !social.liveNotif})} className={`w-10 h-5 rounded-full relative transition-all ${social.liveNotif ? 'bg-dz-green' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${social.liveNotif ? 'right-5' : 'right-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <span className="text-xs font-black dark:text-white">مؤثرات صوتية تفاعلية</span>
            <button onClick={() => setSocial({...social, soundEffects: !social.soundEffects})} className={`w-10 h-5 rounded-full relative transition-all ${social.soundEffects ? 'bg-dz-green' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${social.soundEffects ? 'right-5' : 'right-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <h4 className="font-black text-sm text-dz-text dark:text-gray-100 flex items-center gap-2 mb-2">
          <Share2 size={20} className="text-blue-500" /> الملف الشخصي والتواصل
        </h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <span className="text-xs font-black dark:text-white">إظهار روابط التواصل في ملفي</span>
          <button onClick={() => setSocial({...social, showLinks: !social.showLinks})} className={`w-10 h-5 rounded-full relative transition-all ${social.showLinks ? 'bg-dz-green' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${social.showLinks ? 'right-5' : 'right-1'}`}></div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 font-bold text-[10px]">
            <Facebook size={14} /> ربط فيسبوك
          </button>
          <button className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-600 font-bold text-[10px]">
            <Instagram size={14} /> ربط إنستجرام
          </button>
        </div>
      </div>

      <button onClick={() => handleSaveAction('social')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">
        {isSaving ? <Loader2 className="animate-spin mx-auto" /> : saveSuccess ? 'تم الحفظ!' : 'حفظ التفضيلات'}
      </button>
    </div>
  );

  const renderNotificationsSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">الإشعارات</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-3">
        {[
          { key: 'push', label: 'إشعارات النظام (Push)', icon: <BellRing size={18} className="text-dz-orange" /> },
          { key: 'orders', label: 'تحديثات الطلبات', icon: <Package size={18} className="text-blue-500" /> },
          { key: 'offers', label: 'العروض والخصومات', icon: <Tag size={18} className="text-purple-500" /> },
          { key: 'live', label: 'تنبيهات البث المباشر', icon: <Video size={18} className="text-red-500" /> },
          { key: 'wallet', label: 'حركات المحفظة', icon: <Wallet size={18} className="text-emerald-500" /> }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl transition-all">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-xs font-black dark:text-white">{item.label}</span>
            </div>
            <button 
              onClick={() => setNotifs({...notifs, [item.key]: !notifs[item.key as keyof typeof notifs]})}
              className={`w-10 h-5 rounded-full relative transition-all ${notifs[item.key as keyof typeof notifs] ? 'bg-dz-green' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${notifs[item.key as keyof typeof notifs] ? 'right-5' : 'right-1'}`}></div>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow">
        <h4 className="font-black text-sm dark:text-white mb-4">وقت الإشعارات</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div className="flex items-center gap-3">
            <Volume2 size={18} className="text-gray-400" />
            <span className="text-xs font-black dark:text-white">وضع الهدوء (إخفاء الأصوات ليلاً)</span>
          </div>
          <button className="w-10 h-5 bg-gray-300 rounded-full relative">
            <div className="absolute top-0.5 right-1 w-4 h-4 bg-white rounded-full"></div>
          </button>
        </div>
      </div>

      <button onClick={() => handleSaveAction('notifications')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">
        {isSaving ? <Loader2 className="animate-spin mx-auto" /> : saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
      </button>
    </div>
  );

  const renderAISettingsSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">إعدادات الذكاء الاصطناعي</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-5">
        <div className="flex items-center gap-2 mb-2">
           <Bot size={20} className="text-cyan-600" />
           <h4 className="font-black text-sm text-dz-text dark:text-gray-100">تحكم المساعد VEX</h4>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl">
                 <Bot size={18} />
               </div>
               <div>
                 <span className="text-xs font-black text-dz-text dark:text-gray-300 block">تفعيل المساعد VEX</span>
                 <span className="text-[9px] text-gray-400 font-bold">مساعد ذكي يرافقك في التطبيق</span>
               </div>
             </div>
             <button onClick={() => setEnableVex(!enableVex)} className={`w-12 h-6 rounded-full transition-all relative ${enableVex ? 'bg-dz-green' : 'bg-gray-300'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enableVex ? 'right-7' : 'right-1'}`}></div>
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <Brain size={20} className="text-purple-600" />
           <h4 className="font-black text-sm text-dz-text dark:text-gray-100">تخصيص الاقتراحات</h4>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
               <Sparkles size={18} />
             </div>
             <div>
               <span className="text-xs font-black text-dz-text dark:text-gray-300 block">اقتراحات ذكية</span>
               <span className="text-[9px] text-gray-400 font-bold">بناءً على اهتماماتك السابقة</span>
             </div>
           </div>
           <button onClick={() => setCustomizeSuggestions(!customizeSuggestions)} className={`w-12 h-6 rounded-full transition-all relative ${customizeSuggestions ? 'bg-dz-green' : 'bg-gray-300'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${customizeSuggestions ? 'right-7' : 'right-1'}`}></div>
           </button>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-900/20 space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <Trash2 size={20} className="text-red-600" />
           <h4 className="font-black text-sm text-red-600">منطقة الخصوصية</h4>
        </div>
        <button 
          onClick={() => { setIsClearingHistory(true); setTimeout(() => { setIsClearingHistory(false); alert('تم مسح السجل بنجاح! 🧹'); }, 1500); }}
          className="w-full bg-white dark:bg-gray-800 text-red-600 border border-red-200 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2"
        >
          {isClearingHistory ? <Loader2 size={16} className="animate-spin" /> : 'مسح سجل الأسئلة'}
        </button>
      </div>

      <button onClick={() => handleSaveAction('ai')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90 transition-all">
        {isSaving ? <Loader2 className="animate-spin mx-auto" /> : 'حفظ الإعدادات'}
      </button>
    </div>
  );

  const renderSupportSubSection = () => (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-left duration-300 dark:bg-gray-900 text-right">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
          <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
        </button>
        <h3 className="text-xl font-black text-dz-text dark:text-white">الدعم والمعلومات</h3>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-dz-border dark:border-gray-700 card-shadow">
        <h4 className="font-black text-sm text-dz-text dark:text-gray-100 mb-4 flex items-center gap-2">
          <Headphones size={18} className="text-dz-orange" /> تواصل معنا
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:0550112233" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-dz-green transition-all">
            <Phone size={20} className="text-dz-green" />
            <span className="text-[10px] font-black">اتصال هاتفي</span>
          </a>
          <a href="mailto:support@dz-market.com" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-dz-orange transition-all">
            <Mail size={20} className="text-dz-orange" />
            <span className="text-[10px] font-black">بريد إلكتروني</span>
          </a>
        </div>
      </div>

      <div className="text-center space-y-2 py-4">
        <div className="flex items-center justify-center gap-2 text-dz-green font-black">
          <Info size={18} />
          <h4 className="text-sm">حول Dz Market</h4>
        </div>
        <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-8">
          منصة تجارة إلكترونية ذكية تهدف لربط الباعة والمشترين في الجزائر.
        </p>
        <div className="pt-4">
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full">
            الإصدار v2.5.0 - صنع في الجزائر 🇩🇿
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-dz-bg dark:bg-gray-950 flex flex-col font-['Cairo'] animate-in slide-in-from-bottom duration-500" dir={t.dir}>
      <div className="bg-white dark:bg-gray-800 p-6 flex items-center justify-between border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-black text-dz-text dark:text-white">{t.settings}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      {activeSubSection === 'appearance' ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-in slide-in-from-left duration-300">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => setActiveSubSection(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 text-dz-green transition-all">
              <ArrowRight size={20} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
            </button>
            <h3 className="text-xl font-black text-dz-text dark:text-white">اللغة والمظهر</h3>
          </div>
          <div className="space-y-2">
            {['ar', 'fr', 'en'].map((l) => (
              <button key={l} onClick={() => setTempLang(l as Language)} className={`w-full p-5 rounded-3xl flex items-center justify-between border-2 transition-all ${tempLang === l ? 'bg-dz-green/5 border-dz-green' : 'bg-white dark:bg-gray-800 border-dz-border dark:border-gray-700'}`}>
                <span className="font-black text-sm">{l === 'ar' ? 'العربية' : l === 'fr' ? 'Français' : 'English'}</span>
                {tempLang === l && <CheckCircle2 size={20} className="text-dz-green" />}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setTheme('light')} className={`p-6 rounded-[2.5rem] border-2 transition-all ${theme === 'light' ? 'bg-dz-green/5 border-dz-green' : 'bg-white dark:bg-gray-800'}`}>
              <span className="font-black text-sm">فاتح</span>
            </button>
            <button onClick={() => setTheme('dark')} className={`p-6 rounded-[2.5rem] border-2 transition-all ${theme === 'dark' ? 'bg-gray-900 border-gray-600' : 'bg-white dark:bg-gray-800'}`}>
              <span className="font-black text-sm text-white">داكن</span>
            </button>
          </div>
          <button onClick={() => handleSaveAction('appearance')} className="w-full bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl hover:bg-opacity-90">
             {isSaving ? <Loader2 className="animate-spin mx-auto" /> : 'حفظ التغييرات'}
          </button>
        </div>
      ) : activeSubSection === 'live-social' ? renderLiveSocialSubSection() :
       activeSubSection === 'notifications' ? renderNotificationsSubSection() :
       activeSubSection === 'support' ? renderSupportSubSection() :
       activeSubSection === 'ai-settings' ? renderAISettingsSubSection() :
       activeSubSection === 'security' ? renderSecuritySubSection() :
       activeSubSection === 'account' ? renderAccountSubSection() :
       activeSubSection === 'wallet' ? renderWalletSubSection() :
       <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSubSection(s.id)} className="w-full bg-white dark:bg-gray-800 p-4 rounded-[2rem] flex items-center justify-between group hover:shadow-md border border-dz-border dark:border-gray-700 card-shadow transition-all">
              <div className="flex items-center gap-4 text-right">
                 <div className={`p-3 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>{s.icon}</div>
                 <div className="text-right">
                    <h3 className="font-black text-dz-text dark:text-gray-200 text-sm">{s.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold">{s.subtitle}</p>
                 </div>
              </div>
              <ChevronLeft size={18} className={`text-gray-300 ${t.dir === 'rtl' ? '' : 'rotate-180'}`} />
            </button>
          ))}
          <button onClick={onLogout} className="w-full bg-white dark:bg-gray-800 p-5 rounded-[2rem] flex items-center justify-between border border-red-50 dark:border-red-900/20 mt-6 card-shadow">
            <div className="flex items-center gap-4 text-red-600">
               <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl"><LogOut size={22} /></div>
               <h3 className="font-black text-sm uppercase">{t.logout}</h3>
            </div>
            <ChevronLeft size={18} className={`text-red-200 ${t.dir === 'rtl' ? '' : 'rotate-180'}`} />
          </button>
        </div>}
    </div>
  );
};

export default SettingsScreen;
