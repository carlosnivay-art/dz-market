
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Search, User, MessageSquare, Store, Home, 
  X, Star, Send, ArrowRight, Plus, Bell, ChevronLeft, ChevronRight, ZoomIn, Video, MessageCircle
} from 'lucide-react';
import { Product, User as UserType, Comment } from './types';
import { MOCK_PRODUCTS, WILAYAS, COLORS, TRANSLATIONS, Language } from './constants';
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
        className="relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 border-4 border-dz-border dark:border-gray-700 shadow-inner group cursor-zoom-in"
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
        
        {!isZoomed && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
              className="bg-white/90 dark:bg-black/50 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
              className="bg-white/90 dark:bg-black/50 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === idx ? 'border-dz-orange shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'interests-selection' | 'home' | 'dashboard' | 'product-detail' | 'payment' | 'live-stream' | 'profile' | 'notifications' | 'messages'>('welcome');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
     return (localStorage.getItem('dz-lang') as Language) || 'ar';
  });
  
  const [currentUser, setCurrentUser] = useState<UserType | null>({
    id: 'u1',
    name: 'أمين دزيري',
    role: 'buyer',
    phone: '0550112233',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    email: 'amin@tajerly.com'
  });

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

  const products = MOCK_PRODUCTS.map(p => ({
    ...p,
    sellerName: p.sellerId === 's1' ? 'متجر النخلة' : 'DZ Tech',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'محمد', text: 'هل المنتج متوفر في وهران؟', timestamp: new Date() },
      { id: 'c2', userId: 's1', userName: 'البائع', text: 'نعم متوفر وتوصيل سريع!', timestamp: new Date() }
    ]
  }));

  const handleOpenProduct = (p: Product, scrollToComments = false) => {
    setActiveProduct(p);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (scrollToComments) {
      setTimeout(() => {
        commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const handleSelectRole = (role: 'buyer' | 'seller') => {
    if (role === 'buyer') {
      setCurrentUser(prev => prev ? { ...prev, role: 'buyer' } : null);
      const hasInterests = localStorage.getItem('dz-has-interests');
      if (!hasInterests) {
        setView('interests-selection');
      } else {
        setView('home');
      }
    } else {
      setCurrentUser(prev => prev ? { ...prev, role: 'seller' } : null);
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

  if (view === 'welcome') {
    return <WelcomeScreen onSelectRole={handleSelectRole} />;
  }

  if (view === 'interests-selection') {
    return <InterestsSelectionScreen onComplete={handleInterestsComplete} currentLang={language} />;
  }

  if (view === 'profile') {
    return (
      <BuyerProfileScreen 
        user={currentUser!}
        onClose={() => setView('home')} 
        onLogout={() => {
          localStorage.removeItem('dz-has-interests');
          setView('welcome');
        }} 
        currentLang={language}
        onLangChange={changeLanguage}
      />
    );
  }

  if (view === 'notifications') {
    return <NotificationScreen onClose={() => setView('home')} />;
  }

  if (view === 'messages') {
    return <MessagesScreen onClose={() => setView('home')} />;
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
        onBack={() => setView('product-detail')} 
        onSuccess={() => {
          setDiscountedPrice(null);
          setView('home');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-dz-bg dark:bg-gray-950 flex flex-col transition-colors duration-300" dir={t.dir}>
      {/* AppBar: Green Background */}
      <nav className="bg-dz-green text-white sticky top-0 z-50 py-4 shadow-xl">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-dz-orange p-1.5 rounded-lg rotate-12">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">{t.brand}</h1>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full bg-white/10 border-none rounded-2xl py-3 px-12 text-sm placeholder:text-white/50 focus:bg-white focus:text-gray-800 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className={`absolute ${t.dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/50`} size={18} />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setView('notifications')} className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <Bell size={22} />
              <div className="absolute top-1.5 right-1.5 w-2 bg-red-500 rounded-full border-2 border-dz-green"></div>
            </button>
            <button onClick={() => setView('messages')} className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <MessageSquare size={22} />
              <div className="absolute top-1.5 right-1.5 w-2 bg-dz-orange rounded-full border-2 border-dz-green"></div>
            </button>
            <div className="flex items-center gap-2 cursor-pointer bg-white/10 p-1 pr-3 rounded-full hover:bg-white/20 transition-all" onClick={() => setView('profile')}>
              <span className="text-xs font-bold hidden sm:block">{currentUser?.name}</span>
              <img src={currentUser?.avatar} className="w-8 h-8 rounded-full border-2 border-dz-orange shadow-lg" alt="User" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === 'dashboard' ? (
          <MerchantDashboard />
        ) : view === 'product-detail' && activeProduct ? (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-dz-green dark:text-gray-300 font-bold hover:translate-x-1 transition-transform bg-white dark:bg-gray-800 px-4 py-2 rounded-xl card-shadow border border-dz-border dark:border-gray-700">
                <ArrowRight size={20} className={t.dir === 'rtl' ? 'rotate-180' : ''} /> {t.backToShopping}
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => setView('live-stream')} className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse border border-red-100">
                   <Video size={18} /> {t.liveStream}
                </button>
                <div className="bg-dz-green/10 text-dz-green px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                   <Store size={18} /> {activeProduct.sellerName}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProductGallery images={activeProduct.images} />
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-dz-orange bg-dz-orange/10 px-4 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">
                      {activeProduct.category}
                    </span>
                    <h2 className="text-4xl font-black text-dz-text dark:text-white leading-tight">{activeProduct.name}</h2>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-black shadow-sm">
                    <Star size={18} fill="currentColor" /> {activeProduct.rating}
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] card-shadow border border-dz-border dark:border-gray-700">
                     <p className="text-sm font-bold text-gray-400 mb-2">{t.totalPrice}</p>
                     <span className="text-5xl font-black text-dz-green">{activeProduct.price.toLocaleString()} دج</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] card-shadow border border-dz-border dark:border-gray-700">
                    <h4 className="font-black text-dz-text dark:text-gray-100 mb-4 flex items-center gap-2 underline decoration-dz-orange decoration-4 underline-offset-4">
                       {t.specifications}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">{activeProduct.description}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  {/* Buy Button: Orange */}
                  <button onClick={() => handleBuyNow(activeProduct)} className="flex-1 bg-dz-orange text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-dz-orange/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                    <ShoppingBag size={24} /> {t.buyNow}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div ref={commentsSectionRef} className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] card-shadow border border-dz-border dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-dz-text dark:text-white flex items-center gap-3">
                  <MessageCircle className="text-dz-orange" /> التعليقات والمراجعات
                </h3>
              </div>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {activeProduct.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-dz-border dark:border-gray-800 transition-all">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`} className="w-12 h-12 rounded-xl object-cover bg-white" alt="U" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-dz-text dark:text-gray-200 text-sm">{comment.userName}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">{comment.timestamp.toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-dz-green p-12 text-white shadow-2xl min-h-[400px] flex flex-col justify-center">
              <div className="relative z-10 max-w-2xl text-right">
                <span className="bg-dz-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block animate-bounce shadow-lg">
                  {t.heroBadge}
                </span>
                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1]">{t.heroTitle}</h2>
                <button onClick={scrollToProducts} className="bg-white text-dz-green px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-dz-orange hover:text-white transition-all active:scale-95">
                  {t.startShopping}
                </button>
              </div>
            </div>

            <section ref={productsSectionRef} className="scroll-mt-24">
              <h3 className="text-2xl font-black text-dz-text dark:text-white mb-8">{t.trending}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product as any} 
                    onAddToCart={handleBuyNow}
                    onOpenDetail={handleOpenProduct}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating VEX button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-4 border-white dark:border-gray-900 ${
            isChatOpen ? 'bg-dz-orange rotate-90' : 'bg-dz-green'
          } text-white`}
        >
          {isChatOpen ? <X size={32} strokeWidth={2.5} /> : <MessageSquare size={32} strokeWidth={2.5} />}
        </button>
      </div>

      {isChatOpen && <ChatSystem onClose={() => setIsChatOpen(false)} activeProduct={activeProduct as any} />}
    </div>
  );
};

export default App;
