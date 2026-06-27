import React, { useState, useEffect } from 'react';
import { 
  User, Package, Settings, LogOut, 
  ChevronLeft, ChevronRight, Star, ShieldCheck, CreditCard,
  MapPin, Heart, Sparkles, Box, Clock, Copy, Wifi, Grid, Bookmark, 
  Image as ImageIcon, Share2, Edit3, Facebook, Instagram, Twitter, MessageCircle,
  CheckCircle, Shield, Phone, Store, HelpCircle, AlertCircle, X
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../constants';
import { User as UserType, Review, ReturnPolicyType } from '../types';
import { db } from '../services/db';
import SettingsScreen from './SettingsScreen';

interface BuyerProfileScreenProps {
  user: UserType;
  onClose: () => void;
  onLogout: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  onUpdateUser: (user: any) => void;
}

const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({ 
  user, onClose, onLogout, currentLang, onLangChange, onUpdateUser 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reviews'>('posts');
  
  // Verification Request dialog states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  const [verifyStatusMessage, setVerifyStatusMessage] = useState('');
  
  // Local active user, and dynamic statistics
  const [localUser, setLocalUser] = useState<UserType>(user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProductsCount, setUserProductsCount] = useState(0);

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    // Sync local user info with database
    const dbUser = db.getUser(user.id);
    if (dbUser) {
      setLocalUser(dbUser);
    }
    // Fetch products count
    const pCount = db.getProducts().filter(p => p.sellerId === user.id).length;
    setUserProductsCount(pCount);

    // Fetch seller reviews
    const revs = db.getReviewsForSeller(user.id);
    setReviews(revs);
  }, [user.id]);

  const handleOpenSettings = (section: string | null = null) => {
    setActiveSettingsSection(section);
    setShowSettings(true);
  };

  const handleRequestVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPhone.trim()) return;

    // Send to database
    db.createVerificationRequest(localUser.id, businessName.trim(), contactPhone.trim());
    setVerifyStatusMessage('تم إرسال طلب التوثيق للمشرف بنجاح! سيتم مراجعته قريباً ⏳');
    
    // Clear form after a delay
    setTimeout(() => {
      setShowVerifyModal(false);
      setVerifyStatusMessage('');
      setBusinessName('');
    }, 3000);
  };

  const handleUpdateReturnPolicy = (policy: ReturnPolicyType) => {
    // Update user inside DB
    db.updateUser(localUser.id, { isStudent: policy === '7days' }); // map student discount/attribute for local state, but actually update products
    
    // Update all products of this seller with the chosen policy in the database
    db.getProducts().forEach(p => {
      if (p.sellerId === localUser.id) {
        db.updateProduct(p.id, { returnPolicy: policy });
      }
    });

    alert(`تم تحديث سياسة الإرجاع في متجرك بنجاح لتكون: ${
      policy === 'none' ? 'لا يقبل الإرجاع' : policy === '7days' ? 'إرجاع خلال 7 أيام' : 'إرجاع خلال 14 يوم'
    }`);

    // Update parent state
    const updated = db.getUser(localUser.id);
    if (updated) {
      setLocalUser(updated);
      onUpdateUser(updated);
    }
  };

  if (showSettings) {
    return (
      <SettingsScreen 
        onClose={() => {
          setShowSettings(false);
          const updated = db.getUser(localUser.id);
          if (updated) setLocalUser(updated);
        }} 
        onLogout={onLogout} 
        currentLang={currentLang}
        onLangChange={onLangChange}
        initialSection={activeSettingsSection}
        user={localUser}
        onUpdateUser={(updated) => {
          db.updateUser(localUser.id, updated);
          setLocalUser({ ...localUser, ...updated });
          onUpdateUser(updated);
        }}
      />
    );
  }

  const averageRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)) 
    : 5.0;

  // Check if seller has a pending verification request
  const hasPendingRequest = db.getVerificationRequests().some(v => v.sellerId === localUser.id && v.status === 'pending');

  const userHandle = localUser.email ? localUser.email.split('@')[0] : 'dz_user';

  // Find products of this seller
  const sellerProducts = db.getProducts().filter(p => p.sellerId === localUser.id);

  // Return policy of this seller (just get from the first product or fallback)
  const currentReturnPolicy: ReturnPolicyType = sellerProducts[0]?.returnPolicy || 'none';

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
           <button onClick={() => handleOpenSettings(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
             <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        {/* Profile Info Section */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2.5rem] p-1 bg-gradient-to-tr from-dz-orange to-yellow-400">
                <img 
                  src={localUser.avatar} 
                  className="w-full h-full rounded-[2.3rem] border-4 border-white dark:border-gray-900 object-cover bg-white" 
                  alt="Avatar" 
                />
              </div>
              {localUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-dz-green p-1.5 rounded-xl border-2 border-white dark:border-gray-900 text-white shadow-lg" title="بائع موثوق">
                   <ShieldCheck size={16} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex-1 flex justify-around text-center">
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{userProductsCount}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">المنتجات</p>
              </div>
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{averageRating}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">التقييم العام</p>
              </div>
              <div>
                <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{reviews.length}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">المراجعات</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-800 dark:text-white">{localUser.name}</h3>
              {localUser.isVerified && (
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-200">
                  <ShieldCheck size={10} fill="currentColor" /> بائع موثوق
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              {localUser.role === 'admin' ? 'مدير عام ديزاد ماركت 🛡️' : localUser.role === 'seller' ? 'حساب تاجر / بائع 💎' : 'مشتري معتمد لدى DZ Market 🛍️'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-sm">
              {localUser.bio || 'أبحث دائماً عن أفضل الصفقات في الجزائر 🇩🇿. مهتم بالإلكترونيات والمنتجات المبتكرة.'}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-dz-green" />
                <span className="text-xs font-bold text-dz-green">{localUser.wilaya || 'الجزائر العاصمة'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock size={13} />
                <span className="text-xs">تاريخ الانضمام: {localUser.joinedDate || '2025-01-01'}</span>
              </div>
            </div>
          </div>

          {/* Verification Request Action & Return Policy Controls (Only for Sellers) */}
          {localUser.role === 'seller' && (
            <div className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 mb-6 space-y-4">
              <h4 className="font-black text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Store size={15} className="text-dz-green" /> تسيير متجر التاجر
              </h4>

              {/* Verify seller request */}
              {!localUser.isVerified ? (
                hasPendingRequest ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 text-amber-700 p-3.5 rounded-2xl text-xs font-black flex items-center gap-2">
                    <Clock size={16} className="animate-pulse" /> طلب توثيق حسابك قيد المراجعة حالياً من الإدارة ⏳
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500">حسابك غير موثق بعد. وثق متجرك لتحصل على شارة بائع موثوق الزرقاء وتضاعف مبيعاتك.</p>
                    <button 
                      onClick={() => setShowVerifyModal(true)}
                      className="bg-dz-green text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Shield size={14} /> طلب تفعيل شارة "بائع موثوق"
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 text-emerald-700 p-3.5 rounded-2xl text-xs font-black flex items-center gap-2">
                  <CheckCircle size={16} fill="currentColor" className="text-dz-green" /> تهانينا! حسابك موثق كلياً وتحمل شارة الأمان 💎
                </div>
              )}

              {/* Seller return policy selection */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                <p className="text-[10px] text-gray-500 font-bold">حدد سياسة الإرجاع لجميع معروضاتك وسلعك:</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', '7days', '14days'] as ReturnPolicyType[]).map((policy) => (
                    <button
                      key={policy}
                      onClick={() => handleUpdateReturnPolicy(policy)}
                      className={`py-2 px-1.5 rounded-xl text-[10px] font-black transition-all ${
                        currentReturnPolicy === policy
                          ? 'bg-dz-orange text-white shadow-md shadow-dz-orange/20'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {policy === 'none' ? 'لا يقبل الإرجاع' : policy === '7days' ? 'إرجاع 7 أيام' : 'إرجاع 14 يوم'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => handleOpenSettings('account')}
              className="flex-1 bg-dz-green text-white py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-dz-green/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Edit3 size={15} /> تعديل الحساب والبيانات
            </button>
            <button 
              onClick={onLogout}
              className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-5 py-3.5 rounded-2xl font-black text-xs flex items-center gap-1.5 hover:bg-rose-100 transition-all"
            >
              <LogOut size={15} /> خروج
            </button>
          </div>
        </div>

        {/* Tabs Selection */}
        <div className="flex border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === 'posts' ? 'text-dz-green' : 'text-gray-400'
            }`}
          >
            <Grid size={18} className={activeTab === 'posts' ? 'scale-110 text-dz-green' : ''} />
            <span className="text-[10px] font-black uppercase tracking-wider">سلعي ومعروضاتي ({userProductsCount})</span>
            {activeTab === 'posts' && <div className="absolute bottom-0 w-1/2 h-0.5 bg-dz-green rounded-t-full"></div>}
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === 'reviews' ? 'text-dz-green' : 'text-gray-400'
            }`}
          >
            <Star size={18} className={activeTab === 'reviews' ? 'scale-110 text-dz-green' : ''} />
            <span className="text-[10px] font-black uppercase tracking-wider">تقييمات المشترين ({reviews.length})</span>
            {activeTab === 'reviews' && <div className="absolute bottom-0 w-1/2 h-0.5 bg-dz-green rounded-t-full"></div>}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'posts' ? (
          sellerProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900 pb-20">
              {sellerProducts.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border dark:border-gray-700 shadow-sm flex flex-col">
                  <div className="relative aspect-square">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                    <span className="absolute top-2 right-2 bg-dz-green text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-md">
                      {p.price.toLocaleString()} دج
                    </span>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h5 className="font-black text-xs text-gray-800 dark:text-gray-100 line-clamp-2 h-8 leading-snug">{p.name}</h5>
                    <div className="flex items-center gap-1 mt-2 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black">{p.rating} ({p.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-gray-50 dark:bg-gray-900">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300">
                <Box size={28} />
              </div>
              <p className="font-black text-xs text-gray-600 dark:text-gray-300">لم تقم بإضافة أي سلعة حتى الآن</p>
            </div>
          )
        ) : (
          <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900 pb-20">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={r.buyerAvatar} className="w-8 h-8 rounded-lg object-cover bg-gray-100" alt="B" />
                      <div>
                        <h5 className="font-black text-xs text-gray-800 dark:text-gray-100">{r.buyerName}</h5>
                        <p className="text-[8px] text-gray-400">{new Date(r.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-black">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-bold">{r.comment}</p>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300">
                  <Star size={28} />
                </div>
                <p className="font-black text-xs text-gray-600 dark:text-gray-300">لا توجد تقييمات مكتوبة لهذا الحساب بعد</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Verification Submission Modal --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-dz-green" size={20} fill="currentColor" /> تقديم طلب توثيق البائع
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400">
                <X size={20} />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              يرجى ملء البيانات التالية بدقة. سيقوم فريق مشرفي ديزاد ماركت بمراجعة طلبك وتفعيل شارة "بائع موثوق" لتعزيز ثقة الزبائن ومضاعفة تصفح منتجاتك.
            </p>

            {verifyStatusMessage ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-xs font-black text-center">
                {verifyStatusMessage}
              </div>
            ) : (
              <form onSubmit={handleRequestVerification} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-600 dark:text-gray-300">اسم النشاط أو المتجر التجاري:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: ديزاد تيك للأجهزة الذكية"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 px-3 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-600 dark:text-gray-300">رقم هاتف التواصل والتحقق:</label>
                  <input 
                    type="tel" 
                    placeholder="مثال: 0555334411"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 px-3 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green focus:bg-white outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-dz-green text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-dz-green/20"
                  >
                    إرسال الطلب للمشرف
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-4 py-2.5 rounded-xl text-xs font-black"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerProfileScreen;
