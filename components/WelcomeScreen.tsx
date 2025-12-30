
import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Store, ShieldCheck, Truck, CreditCard, Sparkles, User, ArrowRight, Eye, EyeOff, KeyRound, UserPlus, LogIn, Smartphone, Palette, Loader2 } from 'lucide-react';
import { generateLogo } from '../services/geminiService';

interface WelcomeScreenProps {
  onSelectRole: (role: 'buyer' | 'seller', isNewUser: boolean) => void;
}

type AuthView = 'selection' | 'login' | 'signup';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
  const [view, setView] = useState<AuthView>('selection');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      const logo = await generateLogo("");
      setAppLogo(logo);
      setIsGeneratingLogo(false);
    };
    loadLogo();
  }, []);

  const handleRoleChoice = (role: 'buyer' | 'seller') => {
    setSelectedRole(role);
    setView('login');
  };

  const renderSelection = () => (
    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-dz-text mb-2">مرحباً بك في DZ MARKET</h2>
        <p className="text-gray-400 text-sm font-bold">سوقك الجزائري الذكي والمتطور 🇩🇿</p>
      </div>

      <button 
        onClick={() => handleRoleChoice('buyer')}
        className="w-full bg-dz-green group hover:opacity-95 p-6 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-dz-green/20"
      >
        <div className="bg-white/10 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
          <ShoppingBasket size={28} />
        </div>
        <div className="flex-1 text-white text-right">
          <h3 className="font-black text-lg leading-none mb-2">دخول المشتري</h3>
          <p className="text-xs opacity-70 font-bold">تسوق بذكاء وتوصيل مضمون</p>
        </div>
      </button>

      <button 
        onClick={() => handleRoleChoice('seller')}
        className="w-full bg-white group hover:bg-gray-50 p-6 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-dz-green/10 card-shadow"
      >
        <div className="bg-dz-green/10 p-4 rounded-2xl text-dz-green group-hover:scale-110 transition-transform">
          <Store size={28} />
        </div>
        <div className="flex-1 text-right">
          <h3 className="font-black text-lg text-dz-green leading-none mb-2">دخول البائع</h3>
          <p className="text-xs text-gray-400 font-bold">أكبر تجمع للتجار في الجزائر</p>
        </div>
      </button>
    </div>
  );

  const renderAuthForm = () => {
    const isSignup = view === 'signup';
    
    return (
      <div className="animate-in slide-in-from-left duration-500">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('selection')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-black text-dz-text">{isSignup ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
        </div>
        
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (selectedRole) onSelectRole(selectedRole, isSignup); 
          }} 
          className="space-y-4"
        >
          {isSignup && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input type="text" required placeholder="الاسم" className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3.5 px-10 text-xs font-bold transition-all outline-none" />
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
              <div className="relative">
                <input type="text" required placeholder="اللقب" className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3.5 px-10 text-xs font-bold transition-all outline-none" />
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>
          )}

          <div className="relative">
            <input type="text" required placeholder="رقم الهاتف أو البريد الإلكتروني" className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3.5 px-10 text-xs font-bold transition-all outline-none" />
            <Smartphone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>

          <div className="relative">
            <input type={showPassword ? "text" : "password"} required placeholder="كلمة المرور" className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3.5 px-10 text-xs font-bold transition-all outline-none" />
            <KeyRound size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dz-green transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className={`w-full text-white py-4 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2 mt-2 ${isSignup ? 'bg-dz-orange shadow-dz-orange/20' : 'bg-dz-green shadow-dz-green/20'}`}>
            {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isSignup ? 'تأكيد التسجيل' : 'دخول للمنصة'}
          </button>
          
          <div className="text-center pt-2">
            {isSignup ? (
              <button type="button" onClick={() => setView('login')} className="text-dz-green font-black text-xs hover:underline flex items-center justify-center gap-2 mx-auto">
                لديك حساب؟ سجل دخولك الآن
              </button>
            ) : (
              <button type="button" onClick={() => setView('signup')} className="text-dz-orange font-black text-xs hover:underline flex items-center justify-center gap-2 mx-auto">
                <UserPlus size={16} /> مستخدم جديد؟ انضم إلينا
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 overflow-hidden font-['Cairo']" dir="rtl">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-dz-green rounded-b-[4rem] shadow-2xl z-0"></div>
      <div className="relative z-10 w-full flex flex-col items-center pt-8 text-white text-center">
        <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl mb-4 transition-transform hover:scale-105">
          {isGeneratingLogo ? (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-2xl">
              <Loader2 className="animate-spin text-dz-green" size={32} />
            </div>
          ) : appLogo ? (
            <img src={appLogo} alt="DZ MARKET Logo" className="w-24 h-24 rounded-2xl object-cover" />
          ) : (
            <div className="bg-dz-orange p-4 rounded-[2rem] shadow-2xl rotate-3">
              <ShoppingBasket size={48} className="text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase">DZ MARKET</h1>
        <div className="flex items-center gap-2 bg-dz-orange px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
          <Sparkles size={12} /> الهوية الجزائرية في قلب التجارة 🇩🇿
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 my-8 border border-dz-border flex flex-col justify-center min-h-[480px]">
        {view === 'selection' ? renderSelection() : renderAuthForm()}
      </div>

      <div className="relative z-10 w-full py-6 flex flex-col items-center gap-4 text-center">
        <div className="flex justify-center gap-8 text-dz-green opacity-40">
           <Truck size={20} /> <ShieldCheck size={20} /> <CreditCard size={20} />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
          موثوقية تامة | 58 ولاية | دعم فني جزائري
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
