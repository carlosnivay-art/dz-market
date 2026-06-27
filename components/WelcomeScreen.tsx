
import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Store, ShieldCheck, Truck, CreditCard, Sparkles, User, ArrowRight, Eye, EyeOff, KeyRound, UserPlus, LogIn, Smartphone, Palette, Loader2, Check } from 'lucide-react';
import { generateLogo } from '../services/geminiService';
import { db } from '../services/db';
import { WILAYAS } from '../constants';

interface WelcomeScreenProps {
  onSelectRole: (role: 'buyer' | 'seller' | 'delivery_office' | 'partner_store', isNewUser: boolean) => void;
}

type AuthView = 'selection' | 'login' | 'signup';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
  const [view, setView] = useState<AuthView>('selection');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'delivery_office' | 'partner_store' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(true);

  // Delivery Office Signup Specific State
  const [officeName, setOfficeName] = useState('');
  const [officePhone, setOfficePhone] = useState('');
  const [officeEmail, setOfficeEmail] = useState('');
  const [officePrices, setOfficePrices] = useState('');
  const [officeBio, setOfficeBio] = useState('');
  const [officePassword, setOfficePassword] = useState('');
  const [officeWilaya, setOfficeWilaya] = useState('Alger');
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>(['Alger']);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');

  // Partner Store (Company) Signup Specific State
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerBio, setPartnerBio] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');
  const [partnerWilaya, setPartnerWilaya] = useState('الجزائر');
  const [partnerFacebook, setPartnerFacebook] = useState('');
  const [partnerInstagram, setPartnerInstagram] = useState('');
  const [partnerWebsite, setPartnerWebsite] = useState('');
  const [partnerSubscription, setPartnerSubscription] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [partnerPassword, setPartnerPassword] = useState('');

  useEffect(() => {
    const loadLogo = async () => {
      const logo = await generateLogo("");
      setAppLogo(logo);
      setIsGeneratingLogo(false);
    };
    loadLogo();
  }, []);

  const handleRoleChoice = (role: 'buyer' | 'seller' | 'delivery_office' | 'partner_store') => {
    setSelectedRole(role);
    setView('login');
  };

  const toggleWilaya = (wilayaName: string) => {
    if (selectedWilayas.includes(wilayaName)) {
      setSelectedWilayas(prev => prev.filter(w => w !== wilayaName));
    } else {
      setSelectedWilayas(prev => [...prev, wilayaName]);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (selectedRole === 'delivery_office' && view === 'signup') {
      // Create and save delivery office
      db.registerDeliveryOffice({
        name: officeName,
        phone: officePhone,
        email: officeEmail,
        role: 'delivery_office',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(officeName)}`,
        wilaya: officeWilaya,
        coveredWilayas: selectedWilayas,
        deliveryPrices: officePrices,
        bio: officeBio,
        subscriptionPlan: 'free',
        isRecommended: false,
        ordersCount: 0,
        rating: 5.0,
        reviewsCount: 0,
        approvalStatus: 'pending'
      });
      setSignupSuccessMsg('تم تسجيل مكتبك بنجاح! طلبك الآن قيد المراجعة والموافقة من الإدارة لحماية أمان السلع والمشترين في المنصة ⏳');
      setTimeout(() => {
        onSelectRole('delivery_office', true);
      }, 4500);
      return;
    }

    if (selectedRole === 'partner_store' && view === 'signup') {
      db.registerPartnerStore({
        name: partnerName,
        phone: partnerPhone,
        email: partnerEmail,
        role: 'partner_store',
        avatar: partnerLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(partnerName)}`,
        wilaya: partnerWilaya,
        bio: partnerBio,
        socialLinks: {
          facebook: partnerFacebook,
          instagram: partnerInstagram,
          website: partnerWebsite
        },
        partnerSubscription: partnerSubscription,
        isOfficialStore: false,
        followersCount: 15,
        ordersCount: 0,
        rating: 5.0,
        reviewsCount: 0
      });
      setSignupSuccessMsg('تم إنشاء طلب الشراكة وتسجيل متجرك بنجاح! طلبك قيد المراجعة والاعتماد حالياً من فريق الإدارة لمنحك شارة متجر رسمي معتمد ⏳');
      setTimeout(() => {
        onSelectRole('partner_store', true);
      }, 4500);
      return;
    }

    onSelectRole(selectedRole, view === 'signup');
  };

  const renderSelection = () => (
    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-dz-text mb-2">مرحباً بك في DZ MARKET</h2>
        <p className="text-gray-400 text-sm font-bold">سوقك الجزائري الذكي والمتطور 🇩🇿</p>
      </div>

      <button 
        onClick={() => handleRoleChoice('buyer')}
        className="w-full bg-dz-green group hover:opacity-95 p-5 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-dz-green/20"
      >
        <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
          <ShoppingBasket size={24} />
        </div>
        <div className="flex-1 text-white text-right">
          <h3 className="font-black text-base leading-none mb-1">دخول المشتري</h3>
          <p className="text-[10px] opacity-70 font-bold">تسوق بذكاء وتوصيل مضمون لـ 58 ولاية</p>
        </div>
      </button>

      <button 
        onClick={() => handleRoleChoice('seller')}
        className="w-full bg-white group hover:bg-gray-50 p-5 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.01] active:scale-95 border-2 border-dz-green/10 card-shadow"
      >
        <div className="bg-dz-green/10 p-3 rounded-2xl text-dz-green group-hover:scale-110 transition-transform">
          <Store size={24} />
        </div>
        <div className="flex-1 text-right">
          <h3 className="font-black text-base text-dz-green leading-none mb-1">دخول البائع</h3>
          <p className="text-[10px] text-gray-400 font-bold">أكبر تجمع للتجار في الجزائر لزيادة مبيعاتك</p>
        </div>
      </button>

      <button 
        onClick={() => handleRoleChoice('delivery_office')}
        className="w-full bg-amber-500 group hover:bg-amber-600 p-5 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-amber-500/20"
      >
        <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
          <Truck size={24} />
        </div>
        <div className="flex-1 text-white text-right">
          <h3 className="font-black text-base leading-none mb-1">شريك توصيل (مكتب توصيل)</h3>
          <p className="text-[10px] opacity-80 font-bold">إعرض خدماتك للتجار وامتلك لوحة تحكم مخصصة</p>
        </div>
      </button>

      <button 
        onClick={() => handleRoleChoice('partner_store')}
        className="w-full bg-indigo-600 group hover:bg-indigo-700 p-5 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-indigo-600/20 text-white"
      >
        <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div className="flex-1 text-right">
          <h3 className="font-black text-base leading-none mb-1">شريك تجاري (شركة / متجر رسمي)</h3>
          <p className="text-[10px] opacity-80 font-bold">لوحة تحكم احترافية للشركات، المبيعات والاشتراكات</p>
        </div>
      </button>
    </div>
  );

  const renderAuthForm = () => {
    const isSignup = view === 'signup';
    
    if (selectedRole === 'partner_store' && isSignup) {
      return (
        <div className="animate-in slide-in-from-left duration-500 text-right">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setView('selection')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
              <ArrowRight size={18} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-black text-dz-text flex items-center gap-1.5 text-blue-700">
              <Sparkles size={18} fill="currentColor" /> تسجيل شركة / متجر رسمي 💼
            </h2>
          </div>

          {signupSuccessMsg ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-3xl border border-emerald-100 text-xs font-bold leading-relaxed text-center space-y-3">
              <Check className="mx-auto text-emerald-600 bg-emerald-100 p-2 rounded-full" size={40} />
              <p>{signupSuccessMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">اسم الشركة / المتجر الرسمي:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="مثال: Condor Algeria" 
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">رابط الشعار / الصورة الرمزية (اختياري):</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/logo.png" 
                  value={partnerLogo}
                  onChange={(e) => setPartnerLogo(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none text-left" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">وصف نشاط الشركة ورؤيتها:</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="مثال: الصفحة الرسمية لشركة كوندور رائد الأجهزة الإلكترونية..." 
                  value={partnerBio}
                  onChange={(e) => setPartnerBio(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2 px-3 text-xs font-bold transition-all outline-none resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500">رقم الهاتف للاتصال:</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="035001122" 
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none text-left" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500">البريد الإلكتروني:</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="contact@company.dz" 
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none text-left" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">موقع المقر الرئيسي (الولاية):</label>
                <select
                  value={partnerWilaya}
                  onChange={(e) => setPartnerWilaya(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none"
                >
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-2 space-y-1.5">
                <label className="text-[10px] font-black text-gray-500">روابط التواصل الاجتماعي (اختياري):</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input 
                    type="text" 
                    placeholder="فيسبوك" 
                    value={partnerFacebook}
                    onChange={(e) => setPartnerFacebook(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl py-1.5 px-2 text-[10px] font-bold outline-none focus:border-blue-500 text-left" 
                  />
                  <input 
                    type="text" 
                    placeholder="إنستغرام" 
                    value={partnerInstagram}
                    onChange={(e) => setPartnerInstagram(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl py-1.5 px-2 text-[10px] font-bold outline-none focus:border-blue-500 text-left" 
                  />
                  <input 
                    type="text" 
                    placeholder="موقع ويب" 
                    value={partnerWebsite}
                    onChange={(e) => setPartnerWebsite(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl py-1.5 px-2 text-[10px] font-bold outline-none focus:border-blue-500 text-left" 
                  />
                </div>
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-[10px] font-black text-gray-500">خطة الاشتراك الشريك المطلوبة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartnerSubscription('free')}
                    className={`p-2 rounded-xl text-[10px] font-black border transition-all ${
                      partnerSubscription === 'free' 
                        ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    العادية (مجانية)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerSubscription('pro')}
                    className={`p-2 rounded-xl text-[10px] font-black border transition-all ${
                      partnerSubscription === 'pro' 
                        ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    الاحترافية (موصى بها)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerSubscription('enterprise')}
                    className={`p-2 rounded-xl text-[10px] font-black border transition-all ${
                      partnerSubscription === 'enterprise' 
                        ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    المؤسساتية (كامل الميزات)
                  </button>
                </div>
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-[10px] font-black text-gray-500">كلمة المرور للتحكم بحساب الشريك:</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="أدخل كلمة مرور قوية" 
                    value={partnerPassword}
                    onChange={(e) => setPartnerPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-2.5 px-10 text-xs font-bold transition-all outline-none" 
                  />
                  <KeyRound size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full text-white py-3.5 rounded-2xl font-black shadow-xl bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2">
                <UserPlus size={18} /> تقديم طلب شريك تجاري رسمي
              </button>
              
              <div className="text-center pt-1.5">
                <button type="button" onClick={() => setView('login')} className="text-blue-600 font-black text-xs hover:underline flex items-center justify-center gap-2 mx-auto">
                  لديك حساب شريك بالفعل؟ سجل الدخول
                </button>
              </div>
            </form>
          )}
        </div>
      );
    }

    if (selectedRole === 'delivery_office' && isSignup) {
      return (
        <div className="animate-in slide-in-from-left duration-500 text-right">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setView('selection')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
              <ArrowRight size={18} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-black text-dz-text">تسجيل مكتب توصيل جديد 📦</h2>
          </div>

          {signupSuccessMsg ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-3xl border border-emerald-100 text-xs font-bold leading-relaxed text-center space-y-3">
              <Check className="mx-auto text-emerald-600 bg-emerald-100 p-2 rounded-full" size={40} />
              <p>{signupSuccessMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">اسم مكتب التوصيل:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="مثال: سريع ديزاد للتوصيل" 
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">رقم الهاتف للتواصل:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="مثال: 0560123456" 
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">البريد الإلكتروني:</label>
                <input 
                  type="email" 
                  required
                  placeholder="مثال: contact@delivery.dz" 
                  value={officeEmail}
                  onChange={(e) => setOfficeEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">ولاية المقر الرئيسي:</label>
                <select
                  value={officeWilaya}
                  onChange={(e) => setOfficeWilaya(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold transition-all outline-none"
                >
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">الولايات التي تغطيها خدماتكم:</label>
                <div className="bg-gray-50 p-2.5 rounded-2xl border max-h-[100px] overflow-y-auto grid grid-cols-2 gap-1.5 text-[10px]">
                  {WILAYAS.map(w => (
                    <label key={w} className="flex items-center gap-1.5 cursor-pointer hover:bg-white p-1 rounded-lg transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedWilayas.includes(w)} 
                        onChange={() => toggleWilaya(w)}
                        className="rounded border-gray-300 text-dz-green focus:ring-dz-green"
                      />
                      <span className="font-bold text-gray-700">{w}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">أسعار التوصيل بالتفصيل:</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="مثال: العاصمة للمنزل: 500 دج، للمكتب: 350 دج | الولايات الأخرى: 700 دج" 
                  value={officePrices}
                  onChange={(e) => setOfficePrices(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2 px-3 text-xs font-bold transition-all outline-none resize-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">وصف الخدمات ومميزاتها:</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="مثال: توصيل سريع، تتبع، الدفع عند الاستلام وسرعة فائقة في تحويل الأموال للتجار." 
                  value={officeBio}
                  onChange={(e) => setOfficeBio(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2 px-3 text-xs font-bold transition-all outline-none resize-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">تعيين كلمة المرور:</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="كلمة المرور" 
                    value={officePassword}
                    onChange={(e) => setOfficePassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-2.5 px-10 text-xs font-bold transition-all outline-none" 
                  />
                  <KeyRound size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dz-green transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full text-white py-3.5 rounded-2xl font-black shadow-xl bg-dz-orange shadow-dz-orange/20 transition-all flex items-center justify-center gap-2 mt-2">
                <UserPlus size={18} /> تأكيد وإرسال طلب التسجيل
              </button>
              
              <div className="text-center pt-1.5">
                <button type="button" onClick={() => setView('login')} className="text-dz-green font-black text-xs hover:underline flex items-center justify-center gap-2 mx-auto">
                  لديك حساب بالفعل؟ سجل دخولك
                </button>
              </div>
            </form>
          )}
        </div>
      );
    }

    return (
      <div className="animate-in slide-in-from-left duration-500">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('selection')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-black text-dz-text">
            {isSignup ? `تسجيل جديد (${selectedRole === 'seller' ? 'بائع' : selectedRole === 'partner_store' ? 'شركة معتمدة' : 'مشتري'})` : `تسجيل الدخول (${selectedRole === 'delivery_office' ? 'مكتب توصيل' : selectedRole === 'partner_store' ? 'شركة / متجر رسمي' : selectedRole === 'seller' ? 'بائع' : 'مشتري'})`}
          </h2>
        </div>
        
        <form 
          onSubmit={handleAuthSubmit} 
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
