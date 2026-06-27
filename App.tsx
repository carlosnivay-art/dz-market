import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBasket, Search, User, MessageSquare, Store, Home, 
  X, Star, Send, ArrowRight, Plus, Bell, ChevronLeft, ChevronRight, Video, 
  MessageCircle, ShoppingBag, ShieldAlert, AlertTriangle, ShieldCheck, Check, Truck
} from 'lucide-react';
import { Product, User as UserType, Comment, ReturnPolicyType } from './types';
import { WILAYAS, COLORS, TRANSLATIONS, Language } from './constants';
import { db } from './services/db';
import MerchantDashboard from './components/MerchantDashboard';
import ProductCard from './components/ProductCard';
import ChatSystem from './components/ChatSystem';
import WelcomeScreen from './components/WelcomeScreen';
import PaymentScreen from './components/PaymentScreen';
import LiveStreamScreen from './components/LiveStreamScreen';
import BuyerProfileScreen from './components/BuyerProfileScreen';
import NotificationScreen from './components/NotificationScreen';
import MessagesScreen from './components/MessagesScreen';
import InterestsSelectionScreen from './components/InterestsSelectionScreen';
import CreatePostScreen from './components/CreatePostScreen';
import AdminDashboard from './components/AdminDashboard';
import DeliveryOfficesTab from './components/DeliveryOfficesTab';
import DeliveryOfficeDashboard from './components/DeliveryOfficeDashboard';
import PartnerStoreDashboard from './components/PartnerStoreDashboard';
import PartnerStoreDetail from './components/PartnerStoreDetail';

const ProductGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        className="relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 border-4 border-dz-border dark:border-gray-700 shadow-inner group cursor-zoom-in animate-in fade-in duration-300"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={images[activeIndex]} 
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        />
        
        {!isZoomed && images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
              className="bg-white/90 dark:bg-black/50 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
              className="bg-white/90 dark:bg-black/50 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx ? 'border-dz-orange shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'interests-selection' | 'home' | 'dashboard' | 'product-detail' | 'payment' | 'live-stream' | 'profile' | 'notifications' | 'messages' | 'create-post' | 'admin-dashboard' | 'delivery-office-dashboard' | 'partner-store-dashboard' | 'partner-store-detail'>('welcome');
  const [activePartnerStore, setActivePartnerStore] = useState<UserType | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
     return (localStorage.getItem('dz-lang') as Language) || 'ar';
  });

  const [homeSubTab, setHomeSubTab] = useState<'products' | 'delivery'>('products');

  // Database Products state
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  // Deep link to open specific user chat
  const [chatPartnerId, setChatPartnerId] = useState<string | undefined>(undefined);

  // Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<'fake_product' | 'inappropriate' | 'scam' | 'other'>('fake_product');
  const [reportText, setReportText] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  // Seller review states
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [sellerReviews, setSellerReviews] = useState<any[]>([]);

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    // Default logged in user is u2 (Mohamed) who has 'buyer' role, but we sync with DB users
    const dbUser = db.getUser('u2');
    if (dbUser) return dbUser;
    
    return {
      id: 'u2',
      name: 'محمد بلقاسم',
      role: 'buyer',
      phone: '0661998877',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
      email: 'mohamed@gmail.com',
      wilaya: 'Oran',
      bio: 'محب للتسوق والسلع الفريدة 🛍️',
      joinedDate: '2025-03-12',
      isVerified: false,
      lastActive: new Date().toISOString()
    };
  });

  // Sync products and active product ratings when view shifts or ratings are submitted
  const reloadProducts = () => {
    const prods = db.getProducts();
    setDbProducts(prods);

    // If viewing product detail, reload activeProduct reference
    if (activeProduct) {
      const refreshed = db.getProduct(activeProduct.id);
      if (refreshed) {
        setActiveProduct(refreshed);
        setSellerReviews(db.getReviewsForSeller(refreshed.sellerId));
      }
    }
  };

  useEffect(() => {
    reloadProducts();
  }, [view, activeProduct?.id]);

  const handleUpdateUser = (updatedInfo: any) => {
    if (currentUser) {
      const updated = db.updateUser(currentUser.id, updatedInfo);
      if (updated) setCurrentUser(updated);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  
  const productsSectionRef = useRef<HTMLElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const savedTheme = localStorage.getItem('dz-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleOpenProduct = (p: Product, scrollToComments = false) => {
    setActiveProduct(p);
    setSellerReviews(db.getReviewsForSeller(p.sellerId));
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (scrollToComments) {
      setTimeout(() => {
        commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const handleSelectRole = (role: 'buyer' | 'seller' | 'delivery_office' | 'partner_store', isNewUser: boolean = false) => {
    if (!currentUser) return;

    if (role === 'partner_store') {
      const partnerUsers = db.getUsers().filter(u => u.role === 'partner_store');
      let partnerUser = partnerUsers[partnerUsers.length - 1]; // Latest registered partner store
      if (!partnerUser) {
        partnerUser = {
          id: 'store_official_1',
          name: 'شركة سيفيتال الجزائر Cevital',
          role: 'partner_store',
          phone: '0550112233',
          email: 'contact@cevital.dz',
          avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
          wilaya: 'Bejaia',
          bio: 'المجموعة الصناعية الأكبر في الجزائر لإنتاج وتوزيع المواد الاستهلاكية والغذائية بجودة وطنية معتمدة.',
          partnerSubscription: 'enterprise',
          isOfficialStore: true,
          isVerified: true,
          followersCount: 1250,
          joinedDate: '2025-01-15',
          approvalStatus: 'approved',
          lastActive: new Date().toISOString()
        };
        db.registerPartnerStore(partnerUser as any);
      }
      setCurrentUser(partnerUser);
      setView('partner-store-dashboard');
      return;
    }

    if (role === 'delivery_office') {
      const doUsers = db.getUsers().filter(u => u.role === 'delivery_office');
      let deliveryUser = doUsers[doUsers.length - 1]; // Latest registered office
      if (!deliveryUser) {
        deliveryUser = {
          id: 'do1',
          name: 'سريع ديزاد للتوصيل',
          role: 'delivery_office',
          phone: '0560123456',
          email: 'contact@delivery.dz',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sari3',
          wilaya: 'Alger',
          coveredWilayas: ['Alger', 'Oran', 'Blida', 'Boumerdès'],
          deliveryPrices: 'العاصمة للمنزل: 500 دج، للمكتب: 350 دج | الولايات الأخرى: 700 دج',
          bio: 'توصيل سريع وموثوق لكافة الولايات مع ضمان تحويل الأموال وتتبع الطرود.',
          subscriptionPlan: 'free',
          isRecommended: false,
          ordersCount: 45,
          rating: 4.8,
          reviewsCount: 15,
          approvalStatus: 'approved',
          isVerified: true,
          joinedDate: '2025-05-10',
          lastActive: new Date().toISOString()
        };
        db.registerDeliveryOffice(deliveryUser);
      }
      setCurrentUser(deliveryUser);
      setView('delivery-office-dashboard');
      return;
    }

    if (role === 'buyer') {
      const updated = db.updateUser(currentUser.id, { role: 'buyer' });
      if (updated) setCurrentUser(updated);
      
      const hasInterests = localStorage.getItem('dz-has-interests');
      if (isNewUser && !hasInterests) {
        setView('interests-selection');
      } else {
        setView('home');
      }
    } else {
      const updated = db.updateUser(currentUser.id, { role: 'seller' });
      if (updated) setCurrentUser(updated);
      setView('dashboard');
    }
  };

  const handleInterestsComplete = (interests: string[]) => {
    localStorage.setItem('dz-has-interests', 'true');
    setView('home');
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('dz-lang', lang);
  };

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBuyNow = (p: Product) => {
    setActiveProduct(p);
    setView('payment');
  };

  const handleToggleAdminMode = () => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
      // Switch back to buyer
      const updated = db.updateUser(currentUser.id, { role: 'buyer' });
      if (updated) setCurrentUser(updated);
      setView('home');
      alert('تم الخروج من وضع المسؤول والعودة كمشتري 🛍️');
    } else {
      // Switch to admin account
      const adminUser = db.getUser('admin_id');
      if (adminUser) {
        setCurrentUser(adminUser);
        setView('admin-dashboard');
        alert('مرحباً بك! تم تسجيل الدخول كمسؤول للنظام 🛡️');
      }
    }
  };

  // Submit ad report
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !currentUser) return;

    db.createReport(activeProduct.id, currentUser.id, reportReason, reportText.trim());
    setReportSuccess('تم رفع البلاغ بنجاح! سيقوم فريق المشرفين بمراجعته فوراً لحماية أمان المنصة 🛡️');
    setReportText('');

    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess('');
    }, 3500);
  };

  // Submit seller rating review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !currentUser || !reviewComment.trim()) return;

    db.addReview({
      sellerId: activeProduct.sellerId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating: reviewStars,
      comment: reviewComment.trim()
    });

    setReviewSuccess('شكرًا لك! تم تسجيل تقييمك ودعم موثوقية البائع بنجاح 🌟');
    setReviewComment('');
    
    // Reload reviews list
    reloadProducts();

    setTimeout(() => {
      setReviewSuccess('');
    }, 3500);
  };

  // Switch to direct chat with product seller
  const handleMessageSeller = (sellerId: string) => {
    setChatPartnerId(sellerId);
    setView('messages');
  };

  const handleOpenSellerProfile = (sellerId: string) => {
    const seller = db.getUser(sellerId);
    if (seller && seller.role === 'partner_store') {
      setActivePartnerStore(seller);
      setView('partner-store-detail');
    } else {
      handleMessageSeller(sellerId);
    }
  };

  const filteredProducts = dbProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active user unread messages count
  const unreadMessagesCount = currentUser ? db.getUnreadCountTotal(currentUser.id) : 0;

  // View switch render checks
  if (view === 'partner-store-dashboard' && currentUser) {
    return <PartnerStoreDashboard store={currentUser} onLogout={() => setView('welcome')} />;
  }

  if (view === 'partner-store-detail' && activePartnerStore) {
    return (
      <PartnerStoreDetail 
        store={activePartnerStore} 
        currentUser={currentUser}
        onBack={() => setView('home')}
        onSelectProduct={handleOpenProduct}
        onStartChat={(seller) => {
          setChatPartnerId(seller.id);
          setView('messages');
        }}
      />
    );
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onClose={() => setView('home')} />;
  }

  if (view === 'delivery-office-dashboard' && currentUser) {
    return <DeliveryOfficeDashboard user={currentUser} onLogout={() => setView('welcome')} />;
  }

  if (view === 'welcome') {
    return <WelcomeScreen onSelectRole={handleSelectRole} />;
  }

  if (view === 'interests-selection') {
    return <InterestsSelectionScreen onComplete={handleInterestsComplete} currentLang={language} />;
  }

  if (view === 'create-post') {
    return (
      <CreatePostScreen 
        currentLang={language} 
        onClose={() => setView('home')} 
        onPublish={(post) => {
          // Save post as a real product in DB
          db.createProduct({
            name: post.text.substring(0, 30) + '...',
            price: 5000, // default dummy price for user post
            category: 'fashion',
            image: post.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            images: [post.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
            sellerId: currentUser?.id || 's1',
            sellerName: currentUser?.name || 'مستخدم ديزاد',
            wilaya: currentUser?.wilaya || 'الجزائر',
            isVerified: currentUser?.isVerified || false,
            hasStudentDiscount: false,
            isFastDelivery: true,
            description: post.text,
            returnPolicy: 'none'
          });
          setView('profile');
        }}
      />
    );
  }

  if (view === 'profile' && currentUser) {
    return (
      <BuyerProfileScreen 
        user={currentUser}
        onClose={() => setView('home')} 
        onLogout={() => {
          setView('welcome');
        }} 
        currentLang={language}
        onLangChange={changeLanguage}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  if (view === 'notifications') {
    return <NotificationScreen onClose={() => setView('home')} />;
  }

  if (view === 'messages' && currentUser) {
    return (
      <MessagesScreen 
        currentUser={currentUser} 
        openChatWithUserId={chatPartnerId}
        onClose={() => {
          setChatPartnerId(undefined); // clear partner deep link
          setView('home');
        }} 
      />
    );
  }

  if (view === 'live-stream' && activeProduct) {
    return (
      <LiveStreamScreen 
        product={activeProduct} 
        onClose={() => setView('home')} 
        onBuyNow={(price) => {
          setDiscountedPrice(price);
          setView('payment');
        }}
      />
    );
  }

  if (view === 'payment' && activeProduct) {
    return (
      <PaymentScreen 
        product={discountedPrice ? { ...activeProduct, price: discountedPrice } : activeProduct} 
        currentUser={currentUser}
        onBack={() => setView('product-detail')} 
        onSuccess={() => {
          setDiscountedPrice(null);
          setView('home');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-dz-bg dark:bg-gray-950 flex flex-col transition-colors duration-300 font-['Cairo']" dir={t.dir}>
      {/* AppBar: Green Background */}
      <nav className="bg-dz-green text-white sticky top-0 z-50 py-3 shadow-xl">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-dz-orange p-1 rounded-lg rotate-12">
              <ShoppingBasket size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">{t.brand}</h1>
          </div>

          <div className="flex-1 max-w-md relative hidden md:block">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full bg-white/10 border-none rounded-xl py-2 px-10 text-xs placeholder:text-white/50 focus:bg-white focus:text-gray-800 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className={`absolute ${t.dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/50`} size={16} />
          </div>

          <div className="flex items-center gap-2">
            {/* Admin toggle test button */}
            <button 
              onClick={handleToggleAdminMode}
              className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                currentUser?.role === 'admin' 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={currentUser?.role === 'admin' ? 'الخروج من وضع المسؤول' : 'دخول كمسؤول النظام'}
            >
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">{currentUser?.role === 'admin' ? 'وضع المشرف' : 'تجربة الأدمن'}</span>
            </button>

            <button onClick={() => setView('messages')} className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <MessageSquare size={20} />
              {unreadMessagesCount > 0 ? (
                <div className="absolute -top-1 -right-1 bg-dz-orange text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border border-dz-green">
                  {unreadMessagesCount}
                </div>
              ) : (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-dz-orange rounded-full border border-dz-green"></div>
              )}
            </button>

            <button onClick={() => setView('notifications')} className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <Bell size={20} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-dz-green"></div>
            </button>

            <div className="flex items-center gap-2 cursor-pointer bg-white/10 p-0.5 pr-1.5 rounded-full hover:bg-white/20 transition-all" onClick={() => setView('profile')}>
              <img src={currentUser?.avatar} className="w-7 h-7 rounded-full border-2 border-dz-orange shadow-lg" alt="User" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-2 py-4">
        {view === 'dashboard' ? (
          <MerchantDashboard />
        ) : view === 'product-detail' && activeProduct ? (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-dz-green dark:text-gray-300 font-bold hover:translate-x-1 transition-transform bg-white dark:bg-gray-800 px-4 py-2 rounded-xl card-shadow border border-dz-border dark:border-gray-700">
                <ArrowRight size={20} className={t.dir === 'rtl' ? 'rotate-180' : ''} /> {t.backToShopping}
              </button>
              
              <div className="flex items-center gap-3">
                <button onClick={() => setView('live-stream')} className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse border border-red-100 dark:border-red-950">
                   <Video size={18} /> {t.liveStream}
                </button>
                
                <button 
                  onClick={() => handleOpenSellerProfile(activeProduct.sellerId)}
                  className="bg-dz-green/10 text-dz-green hover:bg-dz-green/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-dz-green/20 transition-all"
                  title="عرض ملف البائع / المتجر"
                >
                   <Store size={18} /> {activeProduct.sellerName}
                   {activeProduct.isVerified && (
                     <ShieldCheck size={16} fill="currentColor" className="text-dz-green" title="بائع موثوق" />
                   )}
                </button>

                <button 
                  onClick={() => setShowReportModal(true)}
                  className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-rose-100 dark:border-rose-950 hover:bg-rose-100 transition-all text-xs"
                >
                  <AlertTriangle size={15} /> الإبلاغ عن الإعلان
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProductGallery images={activeProduct.images} />
              
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div>
                    <span className="text-xs font-bold text-dz-orange bg-dz-orange/10 px-4 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">
                      {activeProduct.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-dz-text dark:text-white leading-tight">{activeProduct.name}</h2>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-yellow-700 dark:text-yellow-400 font-black shadow-sm flex-shrink-0">
                    <Star size={18} fill="currentColor" /> {activeProduct.rating}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] card-shadow border border-dz-border dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
                     <div>
                       <p className="text-xs font-bold text-gray-400 mb-1">{t.totalPrice}</p>
                       <span className="text-3xl md:text-4xl font-black text-dz-green">{activeProduct.price.toLocaleString()} دج</span>
                     </div>

                     <div className="bg-orange-50 dark:bg-orange-950/40 text-dz-orange border border-orange-100 dark:border-orange-900 px-4 py-2 rounded-2xl flex flex-col items-end">
                       <span className="text-[9px] text-gray-400 font-black">سياسة استرجاع البائع:</span>
                       <span className="text-xs font-black">
                         {activeProduct.returnPolicy === 'none' ? 'لا يقبل الإرجاع ❌' : activeProduct.returnPolicy === '7days' ? 'إرجاع خلال 7 أيام 🔄' : 'إرجاع خلال 14 يوم 🔄'}
                       </span>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] card-shadow border border-dz-border dark:border-gray-700">
                    <h4 className="font-black text-dz-text dark:text-gray-100 mb-4 flex items-center gap-2 underline decoration-dz-orange decoration-4 underline-offset-4">
                       {t.specifications}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">{activeProduct.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button onClick={() => handleBuyNow(activeProduct)} className="flex-1 bg-dz-orange text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-dz-orange/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                    <ShoppingBag size={22} /> {t.buyNow}
                  </button>
                  <button 
                    onClick={() => handleMessageSeller(activeProduct.sellerId)}
                    className="flex-1 bg-dz-green text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-dz-green/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageSquare size={22} /> مراسلة البائع
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Ratings, Reviews and Feedbacks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Reviews List (Left side) */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[3rem] card-shadow border border-dz-border dark:border-gray-700 space-y-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <Star className="text-yellow-500" fill="currentColor" /> تقييمات ومراجعات البائع ({sellerReviews.length})
                </h3>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                  {sellerReviews.length > 0 ? (
                    sellerReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dz-border dark:border-gray-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img src={rev.buyerAvatar} className="w-8 h-8 rounded-lg object-cover bg-white" alt="" />
                            <div>
                              <h5 className="font-black text-xs text-gray-800 dark:text-gray-200">{rev.buyerName}</h5>
                              <p className="text-[8px] text-gray-400">{new Date(rev.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-lg">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-black">{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-bold">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 opacity-60">
                      <MessageCircle size={36} className="mx-auto mb-2 text-dz-green" />
                      <p className="font-black text-xs">لا توجد تقييمات مكتوبة لهذا البائع بعد.</p>
                      <p className="text-[9px] mt-1">كن أول من يكتب تقييماً وتجربة بعد الشراء!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Seller Review Widget (Right side) */}
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[3rem] card-shadow border border-dz-border dark:border-gray-700">
                <h3 className="text-lg font-black text-gray-800 dark:text-white mb-4">تقييم تجربة الشراء مع البائع</h3>
                
                {reviewSuccess ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-xs font-black text-center">
                    {reviewSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500">اختر عدد النجوم (من 1 إلى 5):</label>
                      <div className="flex items-center gap-2 justify-center py-2 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewStars(star)}
                            className="p-1 hover:scale-110 active:scale-95 transition-all"
                          >
                            <Star 
                              size={28} 
                              className={star <= reviewStars ? 'text-yellow-500' : 'text-gray-300'} 
                              fill={star <= reviewStars ? 'currentColor' : 'none'} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500">ملاحظاتك ومراجعتك للسلعة والمعاملة:</label>
                      <textarea
                        rows={3}
                        placeholder="أكتب رأيك بكل أمانة حول مصداقية البائع وجودة السلعة..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-3 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!reviewComment.trim()}
                      className="w-full bg-dz-orange text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-dz-orange/20 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      إرسال التقييم
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Section - Compact for Mobile */}
            <div className="relative rounded-[2rem] overflow-hidden bg-dz-green p-6 text-white shadow-xl min-h-[180px] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative z-10 max-w-md text-right">
                <span className="bg-dz-orange text-white text-[10px] font-black px-3 py-1 rounded-full mb-3 inline-block shadow-lg">
                  {t.heroBadge}
                </span>
                <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">{t.heroTitle}</h2>
                <button onClick={scrollToProducts} className="bg-white text-dz-green px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-dz-orange hover:text-white transition-all">
                  {t.startShopping}
                </button>
              </div>
            </div>

            {/* Elegant Sub-Tab Switcher */}
            <div className="flex items-center gap-2 p-1 bg-white dark:bg-gray-950 border rounded-2xl w-fit mx-auto sm:mx-0">
              <button 
                onClick={() => setHomeSubTab('products')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  homeSubTab === 'products' 
                    ? 'bg-dz-green text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                🛒 المنتجات والسلع
              </button>

              <button 
                onClick={() => setHomeSubTab('delivery')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  homeSubTab === 'delivery' 
                    ? 'bg-dz-green text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Truck size={14} /> مكاتب التوصيل الشريكة
              </button>
            </div>

            {homeSubTab === 'products' ? (
              <section ref={productsSectionRef} className="scroll-mt-24">
                {/* المتاجر الرسمية المعتمدة */}
                {(() => {
                  const stores = db.getPartnerStoresApproved();
                  if (stores.length === 0) return null;
                  return (
                    <div className="mb-8 bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-dz-border dark:border-gray-800 shadow-xs">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
                            <ShieldCheck size={18} fill="currentColor" />
                          </span>
                          <div>
                            <h4 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-1.5">
                              المتاجر الرسمية المعتمدة
                              <span className="bg-blue-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">DZ Partner</span>
                            </h4>
                            <p className="text-[9px] text-gray-400">شركات وماركات جزائرية مسجلة تقدم منتجات أصلية مع ضمان كامل 🇩🇿</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" dir={t.dir}>
                        {stores.map((store) => (
                          <div 
                            key={store.id} 
                            onClick={() => {
                              setActivePartnerStore(store);
                              setView('partner-store-detail');
                            }}
                            className="flex-shrink-0 w-56 bg-gray-50 dark:bg-gray-800/40 hover:bg-blue-50/10 dark:hover:bg-blue-950/10 p-4 rounded-[2rem] border border-dz-border dark:border-gray-800 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-900 text-center space-y-2 group"
                          >
                            <div className="relative w-12 h-12 mx-auto">
                              <img 
                                src={store.avatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&q=80'} 
                                className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-700" 
                                alt={store.name} 
                              />
                              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-white dark:border-gray-900">
                                <ShieldCheck size={10} fill="currentColor" />
                              </span>
                            </div>

                            <div>
                              <h5 className="font-black text-xs text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors truncate">
                                {store.name}
                              </h5>
                              <p className="text-[9px] text-gray-400">{store.wilaya ? `ولاية ${store.wilaya}` : 'الجزائر'}</p>
                            </div>

                            <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-1 h-4 px-1 leading-relaxed">
                              {store.bio || 'شريك تجاري رسمي معتمد'}
                            </p>

                            <div className="pt-1">
                              <span className="inline-block w-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 py-1.5 rounded-lg text-[9px] font-black group-hover:bg-blue-500 group-hover:text-white transition-all">
                                زيارة المتجر 🏛️
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-lg font-black text-dz-text dark:text-white">{t.trending}</h3>
                  <span className="text-[10px] font-bold text-dz-green">عرض الكل</span>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleBuyNow}
                        onOpenDetail={handleOpenProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2rem] shadow-xs p-6">
                    <p className="font-black text-gray-500 dark:text-gray-400">لا توجد نتائج مطابقة لبحثك في المنتجات حالياً</p>
                  </div>
                )}
              </section>
            ) : (
              <DeliveryOfficesTab 
                currentUser={currentUser}
                onStartChat={(officeId) => {
                  setChatPartnerId(officeId);
                  setView('messages');
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* New Add Post Button */}
        {view === 'home' && (
          <button 
            onClick={() => setView('create-post')}
            className="p-4 rounded-full bg-dz-orange text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white dark:border-gray-900 animate-in slide-in-from-bottom-5"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white dark:border-gray-900 ${
            isChatOpen ? 'bg-dz-orange rotate-90' : 'bg-dz-green'
          } text-white`}
        >
          {isChatOpen ? <X size={24} strokeWidth={2.5} /> : <MessageSquare size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {isChatOpen && <ChatSystem onClose={() => setIsChatOpen(false)} activeProduct={activeProduct} />}

      {/* --- Report Ad Submission Modal --- */}
      {showReportModal && activeProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-rose-500 animate-bounce" size={20} /> الإبلاغ عن إعلان مخالف
              </h3>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400">
                <X size={20} />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              تلتزم منصة DZ MARKET بتقديم سوق آمن وقانوني بالكامل. يرجى إعلامنا بالسبب الدقيق لمخالفة هذا الإعلان للمراجعة المباشرة من الإدارة.
            </p>

            {reportSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-xs font-black text-center">
                {reportSuccess}
              </div>
            ) : (
              <form onSubmit={handleAddReport} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-600 dark:text-gray-300">حدد نوع المخالفة:</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 px-3 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green focus:bg-white outline-none"
                  >
                    <option value="fake_product">منتج مزيف أو مقلد غير مطابق</option>
                    <option value="inappropriate">محتوى أو صور غير لائقة</option>
                    <option value="scam">احتيال، نصب أو سعر وهمي</option>
                    <option value="other">سبب آخر يخالف شروط الاستخدام</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-600 dark:text-gray-300">تفاصيل إضافية للمراجعة:</label>
                  <textarea
                    rows={3}
                    placeholder="أدخل أي ملاحظات تساعد المشرف في التحقق من صحة بلاغك..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-3 text-xs text-right text-gray-800 dark:text-white focus:ring-2 focus:ring-dz-green outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-500/20"
                  >
                    إرسال البلاغ
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowReportModal(false)}
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

export default App;
