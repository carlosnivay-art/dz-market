import React, { useState, useEffect } from 'react';
import { 
  Truck, Star, ShieldCheck, AlertTriangle, Sparkles, LogOut, Check, Save, MapPin, 
  BarChart3, Settings, Calendar, Award, Package, Clock, Users, ChevronLeft, Send, MessageCircle
} from 'lucide-react';
import { db } from '../services/db';
import { User, Review } from '../types';
import { WILAYAS } from '../constants';

interface DeliveryOfficeDashboardProps {
  user: User;
  onLogout: () => void;
}

const DeliveryOfficeDashboard: React.FC<DeliveryOfficeDashboardProps> = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'subscription'>('profile');
  
  // Form fields
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [wilaya, setWilaya] = useState(user.wilaya);
  const [bio, setBio] = useState(user.bio || '');
  const [deliveryPrices, setDeliveryPrices] = useState(user.deliveryPrices || '');
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>(user.coveredWilayas || []);
  
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Sync state if user changes
    const refreshed = db.getUser(user.id);
    if (refreshed) {
      setUser(refreshed);
      setName(refreshed.name);
      setPhone(refreshed.phone);
      setWilaya(refreshed.wilaya);
      setBio(refreshed.bio || '');
      setDeliveryPrices(refreshed.deliveryPrices || '');
      setSelectedWilayas(refreshed.coveredWilayas || []);
      setReviews(db.getReviewsForSeller(refreshed.id));
    }
  }, [user.id]);

  const handleToggleWilaya = (w: string) => {
    if (selectedWilayas.includes(w)) {
      setSelectedWilayas(prev => prev.filter(item => item !== w));
    } else {
      setSelectedWilayas(prev => [...prev, w]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateUser(user.id, {
      name,
      phone,
      wilaya,
      bio,
      deliveryPrices,
      coveredWilayas: selectedWilayas
    });

    if (updated) {
      setUser(updated);
      setUpdateSuccess('تم تحديث وحفظ معلومات مكتب التوصيل بنجاح! 🎉');
      setTimeout(() => setUpdateSuccess(''), 3000);
    }
  };

  const handleSubscribePremium = () => {
    // Admin or user triggering premium
    const updated = db.updateUser(user.id, {
      subscriptionPlan: 'premium',
      isRecommended: true
    });
    if (updated) {
      setUser(updated);
      alert('مبروك! تم تفعيل الاشتراك المميز بنجاح وتحقيق شارة شريك موصى به 🌟');
    }
  };

  const handleCancelSubscription = () => {
    const updated = db.updateUser(user.id, {
      subscriptionPlan: 'free',
      isRecommended: false
    });
    if (updated) {
      setUser(updated);
      alert('تم إلغاء الاشتراك المميز والعودة للخطة المجانية.');
    }
  };

  return (
    <div className="min-h-screen bg-dz-bg dark:bg-gray-950 font-['Cairo'] text-right pb-20" dir="rtl">
      {/* Top Navbar */}
      <nav className="bg-dz-green text-white sticky top-0 z-50 py-3 shadow-xl">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-dz-orange p-1.5 rounded-xl rotate-12 text-white">
              <Truck size={20} />
            </div>
            <h1 className="text-lg font-black tracking-tight">DZ MARKET - مكاتب التوصيل</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] sm:text-xs font-bold opacity-90">{user.name} | مكتب توصيل شريك</span>
            <button 
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all text-white"
            >
              <LogOut size={14} /> خروج
            </button>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        
        {/* Status Notification */}
        {user.approvalStatus === 'pending' ? (
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-[2rem] p-6 space-y-3 shadow-xs animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle size={24} className="animate-pulse" />
              <h3 className="text-base font-black">طلب انضمامك قيد المراجعة والاعتماد حالياً ⏳</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
              مرحباً بك في مجتمع DZ MARKET لشركاء التوصيل. يقوم فريق الإشراف حالياً بالتحقق من معلومات مكتبك وعنوان المقر وصحة أرقام الاتصال لضمان سلامة التعاملات وجودتها. 
            </p>
            <p className="text-[10px] text-amber-700 font-bold">
              * يمكنك مراجعة واستكمال معلومات مكتبك، وأسعار التوصيل، والولايات التي تغطيها أدناه لتكون جاهزاً فور اعتماد حسابك.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-dz-green">
              <ShieldCheck size={24} fill="currentColor" className="text-dz-green" />
              <div className="text-right">
                <h3 className="text-base font-black">مكتب توصيل شريك ومعتمد رسمياً 🇩🇿</h3>
                <p className="text-xs text-emerald-800 font-semibold leading-tight mt-0.5">ملف مكتبك يظهر حالياً لجميع الباعة والمشترين في DZ MARKET للطلب والدردشة المباشرة.</p>
              </div>
            </div>

            {user.subscriptionPlan === 'premium' && (
              <span className="bg-amber-100 text-amber-700 text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1 shadow-xs border border-amber-200 animate-bounce">
                <Sparkles size={12} fill="currentColor" /> شريك موصى به
              </span>
            )}
          </div>
        )}

        {/* Tab Selection Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Left/Sidebar Navigation */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border shadow-xs space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
                activeTab === 'profile' 
                  ? 'bg-dz-green text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Settings size={16} /> إدارة معلومات المكتب
            </button>

            <button 
              onClick={() => setActiveTab('stats')}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
                activeTab === 'stats' 
                  ? 'bg-dz-green text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <BarChart3 size={16} /> الإحصائيات والأداء
            </button>

            <button 
              onClick={() => setActiveTab('subscription')}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
                activeTab === 'subscription' 
                  ? 'bg-dz-green text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Award size={16} /> خطة الاشتراك وشارة التوصية
            </button>
          </div>

          {/* Right/Content Area */}
          <div className="md:col-span-3 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[3rem] border shadow-sm">
            
            {/* 1. PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-3 mb-4">
                  <h3 className="text-base font-black text-gray-800 dark:text-white">تعديل الملف التعريفي ومكتب الشحن</h3>
                  <p className="text-xs text-gray-400 font-bold">حافظ على معلومات اتصال دقيقة وتغطية شاملة لجذب المزيد من الطلبات</p>
                </div>

                {updateSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-xs font-black text-center">
                    {updateSuccess}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-300">اسم المكتب التعريفي (التجاري):</label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border rounded-xl py-2 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-dz-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-300">رقم الهاتف للتواصل المباشر:</label>
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border rounded-xl py-2 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-dz-green text-left"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-300">الولاية الرئيسية للمقر:</label>
                      <select
                        value={wilaya}
                        onChange={(e) => setWilaya(e.target.value)}
                        className="w-full bg-gray-50 border rounded-xl py-2 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-dz-green"
                      >
                        {WILAYAS.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-600 dark:text-gray-300">وصف الخدمات ومميزات الشحن التي نقدمها:</label>
                    <textarea 
                      rows={3}
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="أدخل تفاصيل الخدمات مثل: شحن طرود سريع، تسليم مبالغ يومي، تغطية ريفية..."
                      className="w-full bg-gray-50 border rounded-2xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-dz-green resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-600 dark:text-gray-300">تفاصيل وأسعار الشحن (للبيت وللمكتب):</label>
                    <textarea 
                      rows={4}
                      required
                      value={deliveryPrices}
                      onChange={(e) => setDeliveryPrices(e.target.value)}
                      placeholder="مثال:&#10;العاصمة: 300 دج للمكتب / 500 دج للمنزل&#10;ولايات الشرق: 400 دج للمكتب / 600 دج للمنزل&#10;ولايات الجنوب: 600 دج للمكتب / 900 دج للمنزل"
                      className="w-full bg-gray-50 border rounded-2xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-dz-green resize-none font-sans"
                    />
                  </div>

                  {/* Covered Wilayas checklist */}
                  <div className="space-y-2 border-t pt-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-700 dark:text-gray-300">الولايات المشمولة بخدمة التوصيل لدينا:</h4>
                      <p className="text-[10px] text-gray-400 font-bold">اختر الولايات التي يستطيع مكتبك توصيل الطرود إليها بنجاح</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-3xl max-h-[220px] overflow-y-auto border">
                      {WILAYAS.map(w => {
                        const isChecked = selectedWilayas.includes(w);
                        return (
                          <label 
                            key={w} 
                            className={`flex items-center gap-2 p-1.5 rounded-xl cursor-pointer transition-all text-[11px] font-bold ${
                              isChecked 
                                ? 'bg-dz-green/10 text-dz-green' 
                                : 'hover:bg-gray-100 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWilaya(w)}
                              className="accent-dz-green rounded"
                            />
                            <span>{w}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-dz-orange text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-dz-orange/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save size={16} /> حفظ وتحديث بيانات المكتب
                  </button>
                </form>
              </div>
            )}

            {/* 2. STATS AND REVIEWS */}
            {activeTab === 'stats' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-3 mb-4">
                  <h3 className="text-base font-black text-gray-800 dark:text-white">لوحة الإحصائيات والأداء العام</h3>
                  <p className="text-xs text-gray-400 font-bold">متابعة تقييمات التجار والمشترين ومستويات الرضا</p>
                </div>

                {/* Key Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border">
                    <Package className="text-dz-green mx-auto mb-1.5" size={20} />
                    <span className="text-[10px] text-gray-400 font-black block leading-none">الطلبات المسلّمة</span>
                    <strong className="text-lg text-gray-800 dark:text-white font-black">{user.ordersCount || 12} طرد</strong>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border">
                    <Star className="text-amber-500 mx-auto mb-1.5" size={20} fill="currentColor" />
                    <span className="text-[10px] text-gray-400 font-black block leading-none">متوسط التقييم</span>
                    <strong className="text-lg text-gray-800 dark:text-white font-black">{user.rating || '5.0'} / 5.0</strong>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border">
                    <MapPin className="text-blue-500 mx-auto mb-1.5" size={20} />
                    <span className="text-[10px] text-gray-400 font-black block leading-none">تغطية الولايات</span>
                    <strong className="text-lg text-gray-800 dark:text-white font-black">{selectedWilayas.length} ولاية</strong>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border">
                    <Clock className="text-purple-500 mx-auto mb-1.5" size={20} />
                    <span className="text-[10px] text-gray-400 font-black block leading-none">التسليم للأموال</span>
                    <strong className="text-lg text-gray-800 dark:text-white font-black">أقل من 24 س</strong>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-black text-xs text-gray-800 dark:text-white">أحدث تعليقات وتقييمات العملاء حول مكتبك:</h4>
                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <img src={rev.buyerAvatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                              <div>
                                <h5 className="font-black text-gray-800 dark:text-gray-200">{rev.buyerName}</h5>
                                <p className="text-[9px] text-gray-400">{new Date(rev.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-lg text-[10px] font-black">
                              <Star size={10} fill="currentColor" />
                              <span>{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 opacity-60">
                      <MessageCircle size={36} className="mx-auto mb-2 text-dz-green" />
                      <p className="font-black text-xs">لا توجد مراجعات أو تقييمات مخصصة لمكتبك حتى الآن.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. SUBSCRIPTION MANAGEMENT */}
            {activeTab === 'subscription' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-3 mb-4">
                  <h3 className="text-base font-black text-gray-800 dark:text-white">خطة اشتراك المكتب وشارة التوصية</h3>
                  <p className="text-xs text-gray-400 font-bold">اختر الخطة التي تناسب متطلبات ترويج مكتبك وزيادة زبائنك</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Free Plan */}
                  <div className={`p-6 rounded-[2rem] border-2 flex flex-col justify-between space-y-4 transition-all ${
                    user.subscriptionPlan !== 'premium' 
                      ? 'border-dz-green bg-emerald-50/10' 
                      : 'border-gray-100 dark:border-gray-800'
                  }`}>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">الخطة الأساسية</span>
                      <h4 className="text-lg font-black text-gray-800 dark:text-white">الخطة المجانية 📄</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        ظهور ملف مكتبك بشكل قياسي في نتائج البحث وإمكانية كتابة الملاحظات ومراسلة العملاء.
                      </p>
                      <ul className="text-[10px] text-gray-500 font-semibold space-y-1 pt-2 list-disc list-inside">
                        <li>عرض تفاصيل الشحن والأسعار.</li>
                        <li>إمكانية استقبال التقييمات والرد عليها.</li>
                        <li>عدد طلبات غير محدود.</li>
                      </ul>
                    </div>

                    {user.subscriptionPlan !== 'premium' ? (
                      <span className="w-full text-center bg-gray-100 text-gray-500 font-black py-2 rounded-xl text-xs">نشطة حالياً ✓</span>
                    ) : (
                      <button 
                        onClick={handleCancelSubscription}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-2 rounded-xl text-xs transition-all"
                      >
                        العودة للخطة المجانية
                      </button>
                    )}
                  </div>

                  {/* Premium Recommended Plan */}
                  <div className={`p-6 rounded-[2rem] border-2 flex flex-col justify-between space-y-4 transition-all ${
                    user.subscriptionPlan === 'premium' 
                      ? 'border-amber-400 bg-amber-50/10 shadow-lg shadow-amber-400/5' 
                      : 'border-gray-100 dark:border-gray-800 hover:border-amber-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">الأعلى طلباً 🔥</span>
                        <span className="text-xs font-black text-amber-600">3000 دج / شهر</span>
                      </div>
                      <h4 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-1">
                        الخطة المميزة 🌟
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        ترقية ظهور مكتبك في أعلى نتائج البحث والحصول على شارة "مكتب توصية" لتعزيز الموثوقية لدى التجار.
                      </p>
                      <ul className="text-[10px] text-amber-700 font-semibold space-y-1 pt-2 list-disc list-inside">
                        <li>أولوية الظهور في قمة نتائج البحث والتصفية.</li>
                        <li>شارة "شريك موصى به" ذهبية جذابة للتجار.</li>
                        <li>دعم فني وأولوية معالجة الشكاوى.</li>
                      </ul>
                    </div>

                    {user.subscriptionPlan === 'premium' ? (
                      <span className="w-full text-center bg-amber-500 text-white font-black py-2 rounded-xl text-xs shadow-md">خطة التوصية نشطة 🌟</span>
                    ) : (
                      <button 
                        onClick={handleSubscribePremium}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2 rounded-xl text-xs shadow-md shadow-amber-500/10 transition-all active:scale-95"
                      >
                        الترقية للخطة المميزة 🌟
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default DeliveryOfficeDashboard;
