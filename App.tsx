
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Search, User, Menu, MessageSquare, Store, Home, 
  X, Star, Send, ArrowRight, Share2, Plus, Bell, ChevronLeft, ChevronRight, ZoomIn, Truck, Video
} from 'lucide-react';
import { Product, User as UserType, Comment } from './types';
import { MOCK_PRODUCTS, WILAYAS, COLORS } from './constants';
import MerchantDashboard from './components/MerchantDashboard';
import ProductCard from './components/ProductCard';
import ChatSystem from './components/ChatSystem';
import WelcomeScreen from './components/WelcomeScreen';
import PaymentScreen from './components/PaymentScreen';
import LiveStreamScreen from './components/LiveStreamScreen';
import BuyerProfileScreen from './components/BuyerProfileScreen';
import NotificationScreen from './components/NotificationScreen';
import MessagesScreen from './components/MessagesScreen';

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
      {/* Main Image Stage */}
      <div 
        className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border-4 border-gray-50 shadow-inner group cursor-zoom-in"
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
              className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
              className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-dz-orange hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm">
          <ZoomIn size={18} className="text-dz-green" />
        </div>
      </div>

      {/* Thumbnails */}
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
  const [view, setView] = useState<'welcome' | 'home' | 'dashboard' | 'product-detail' | 'payment' | 'live-stream' | 'profile' | 'notifications' | 'messages'>('welcome');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAiFabVisible, setIsAiFabVisible] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<UserType | null>({
    id: 'u1',
    name: 'أمين دزيري',
    role: 'buyer',
    phone: '0550112233',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    email: 'amin@dz-market.com'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const products = MOCK_PRODUCTS.map(p => ({
    ...p,
    sellerName: p.sellerId === 's1' ? 'متجر النخلة' : 'DZ Tech',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'محمد', text: 'هل المنتج متوفر في وهران؟', timestamp: new Date() },
      { id: 'c2', userId: 's1', userName: 'البائع', text: 'نعم متوفر وتوصيل سريع!', timestamp: new Date() }
    ]
  }));

  const handleOpenProduct = (p: Product) => {
    setActiveProduct(p);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: 'buyer' | 'seller') => {
    if (role === 'buyer') {
      setCurrentUser(prev => prev ? { ...prev, role: 'buyer' } : null);
      setView('home');
    } else {
      setCurrentUser(prev => prev ? { ...prev, role: 'seller' } : null);
      setView('dashboard');
    }
  };

  if (view === 'welcome') {
    return <WelcomeScreen onSelectRole={handleSelectRole} />;
  }

  if (view === 'profile') {
    return (
      <BuyerProfileScreen 
        onClose={() => setView('home')} 
        onLogout={() => setView('welcome')} 
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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Navbar */}
      <nav className="bg-dz-green text-white sticky top-0 z-50 py-4 shadow-xl">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-dz-orange p-1.5 rounded-lg rotate-12">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">DZ MARKET</h1>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="واش راك تحوس اليوم؟"
              className="w-full bg-white/10 border-none rounded-2xl py-3 px-12 text-sm placeholder:text-white/50 focus:bg-white focus:text-gray-800 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          </div>

          <div className="flex items-center gap-4">
            {/* Dedicated Notifications Button */}
            <button 
              onClick={() => setView('notifications')}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              title="الإشعارات"
            >
              <Bell size={22} />
              <div className="absolute top-1.5 right-1.5 w-2 bg-red-500 rounded-full border-2 border-dz-green"></div>
            </button>

            {/* Dedicated Messages Button */}
            <button 
              onClick={() => setView('messages')}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              title="الرسائل"
            >
              <MessageSquare size={22} />
              <div className="absolute top-1.5 right-1.5 w-2 bg-dz-orange rounded-full border-2 border-dz-green"></div>
            </button>

            <button 
              onClick={() => {
                if(currentUser?.role === 'buyer') {
                  setCurrentUser({...currentUser, role: 'seller'});
                  setView('dashboard');
                } else {
                  setCurrentUser({...currentUser, role: 'buyer'});
                  setView('home');
                }
              }}
              className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all"
            >
              {currentUser?.role === 'buyer' ? <><Store size={18}/> افتح متجرك</> : <><Home size={18}/> وضع الزبون</>}
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
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-dz-green font-bold hover:translate-x-1 transition-transform bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <ArrowRight size={20} /> العودة للتسوق
              </button>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('live-stream')}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse border border-red-100"
                >
                   <Video size={18} /> شاهد البث المباشر
                </button>
                <button className="p-2 bg-white rounded-xl shadow-sm border hover:text-dz-orange transition-all">
                   <Share2 size={20} />
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
                    <h2 className="text-4xl font-black text-gray-800 leading-tight">{activeProduct.name}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-yellow-100 px-4 py-1.5 rounded-full flex items-center gap-2 text-yellow-700 font-black shadow-sm">
                      <Star size={18} fill="currentColor" /> {activeProduct.rating}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{activeProduct.reviewsCount} تقييم</span>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                     <p className="text-sm font-bold text-gray-400 mb-2">السعر الإجمالي</p>
                     <div className="flex items-baseline gap-4">
                       <span className="text-5xl font-black text-dz-green">{activeProduct.price.toLocaleString()} دج</span>
                       {activeProduct.oldPrice && (
                         <span className="text-2xl text-gray-300 line-through font-bold">
                           {activeProduct.oldPrice.toLocaleString()} دج
                         </span>
                       )}
                       {activeProduct.oldPrice && (
                         <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-black">
                           وفر {Math.round(((activeProduct.oldPrice - activeProduct.price) / activeProduct.oldPrice) * 100)}%
                         </span>
                       )}
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2 underline decoration-dz-orange decoration-4 underline-offset-4">
                       المواصفات والوصف
                    </h4>
                    <p className="text-gray-500 leading-relaxed text-lg">
                      {activeProduct.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setView('payment')}
                    className="flex-1 bg-dz-orange text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-dz-orange/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={24} /> اشتري الآن
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-dz-green text-white px-8 rounded-3xl shadow-xl shadow-dz-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
                  >
                    <MessageSquare size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-dz-green p-12 text-white shadow-2xl min-h-[400px] flex flex-col justify-center">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-dz-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block animate-bounce shadow-lg">
                  أكبر سوق ذكي في الجزائر 🇩🇿
                </span>
                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1]">تسوق بأمان، وردود ذكية بـ Gemini AI</h2>
                <p className="text-lg opacity-80 mb-8 max-w-lg leading-relaxed">اكتشف آلاف المنتجات مع مساعد مبيعات آلي يرد على استفساراتك فوراً حول السعر والجودة والتوصيل.</p>
                <button className="bg-white text-dz-green px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-dz-orange hover:text-white transition-all">ابدأ التسوق الآن</button>
              </div>
            </div>

            {/* Products Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-800">🔥 الأكثر طلباً حالياً</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product as any} 
                    onAddToCart={(p) => setCart([...cart, p])}
                    onOpenDetail={handleOpenProduct}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating Chat Bot with Hide Option */}
      {isAiFabVisible && (
        <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center gap-2">
          <button 
            onClick={() => setIsAiFabVisible(false)}
            className="bg-white text-red-500 p-1.5 rounded-full shadow-lg hover:bg-red-50 transition-all border border-red-100"
            title="إخفاء المساعد"
          >
            <X size={14} />
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-dz-green text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-white"
          >
            <MessageSquare size={32} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {isChatOpen && (
        <ChatSystem 
          onClose={() => setIsChatOpen(false)} 
          activeProduct={activeProduct as any} 
        />
      )}
    </div>
  );
};

export default App;
