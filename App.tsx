
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, User, Menu, MessageSquare, Store, Home, 
  X, Star, Send, ArrowRight, Share2, Plus, Bell
} from 'lucide-react';
import { Product, User as UserType, Comment } from './types';
import { MOCK_PRODUCTS, WILAYAS, COLORS } from './constants';
import MerchantDashboard from './components/MerchantDashboard';
import ProductCard from './components/ProductCard';
import ChatSystem from './components/ChatSystem';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'dashboard' | 'product-detail' | 'seller-profile'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  // Simulation of product list with seller names and comments
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
  };

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
            
            <div className="flex items-center gap-2 cursor-pointer bg-white/10 p-1 pr-3 rounded-full hover:bg-white/20 transition-all">
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
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-dz-green font-bold hover:translate-x-1 transition-transform">
              <ArrowRight size={20} /> العودة للتسوق
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border">
              <div className="rounded-3xl overflow-hidden aspect-square border-8 border-gray-50 shadow-inner">
                <img src={activeProduct.image} className="w-full h-full object-cover" alt={activeProduct.name} />
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-dz-orange bg-dz-orange/10 px-3 py-1 rounded-full mb-2 inline-block uppercase tracking-wider">
                      {activeProduct.category}
                    </span>
                    <h2 className="text-3xl font-black text-gray-800">{activeProduct.name}</h2>
                  </div>
                  <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1 text-yellow-700 font-bold">
                    <Star size={16} fill="currentColor" /> {activeProduct.rating}
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                  {activeProduct.description}
                </p>

                <div className="bg-gray-50 p-6 rounded-3xl mb-8">
                   <p className="text-sm text-gray-500 mb-1">السعر الحالي</p>
                   <div className="flex items-baseline gap-3">
                     <span className="text-4xl font-black text-dz-green">{activeProduct.price.toLocaleString()} دج</span>
                     {activeProduct.oldPrice && <span className="text-lg text-gray-400 line-through">{activeProduct.oldPrice.toLocaleString()} دج</span>}
                   </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-dz-orange text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-dz-orange/20 hover:scale-[1.02] active:scale-95 transition-all">
                    اشتري الآن
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-dz-green text-white px-6 rounded-2xl shadow-xl shadow-dz-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageSquare />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
              <h3 className="text-xl font-bold mb-6">الردود والاستفسارات ({activeProduct.comments.length})</h3>
              <div className="space-y-6 mb-8">
                {activeProduct.comments.map(c => (
                  <div key={c.id} className={`flex gap-4 ${c.userName === 'البائع' ? 'bg-dz-green/5 p-4 rounded-2xl border-r-4 border-dz-green' : ''}`}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.userName}`} className="w-10 h-10 rounded-full border shadow-sm" alt="U" />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{c.userName} <span className="text-[10px] text-gray-400 font-normal mr-2">منذ ساعة</span></p>
                      <p className="text-sm text-gray-600 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl border focus-within:ring-2 focus-within:ring-dz-green transition-all">
                <input type="text" placeholder="اكتب ردك هنا..." className="flex-1 bg-transparent border-none py-3 px-4 focus:ring-0 text-sm" />
                <button className="bg-dz-green text-white p-3 rounded-xl">
                  <Send size={18} className="rotate-180" />
                </button>
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
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-dz-green px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-dz-orange hover:text-white transition-all">ابدأ التسوق الآن</button>
                  <button className="bg-transparent border-2 border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">كيف نضمن جودتنا؟</button>
                </div>
              </div>
              {/* Abstract decorative elements */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-20 w-40 h-40 bg-dz-orange/20 rounded-full blur-2xl"></div>
            </div>

            {/* Popular Products Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">🔥 الأكثر طلباً حالياً</h3>
                  <p className="text-sm text-gray-500">تم اختيارها بناءً على تقييمات المشترين الحقيقية</p>
                </div>
                <button className="text-dz-green font-bold flex items-center gap-2 hover:underline">مشاهدة الجميع <ArrowRight size={18} /></button>
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

      {/* Floating Chat Bot */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 left-8 bg-dz-green text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white"
      >
        <MessageSquare size={32} strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-dz-orange rounded-full border-2 border-white"></div>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-dz-green px-4 py-2 rounded-2xl text-xs font-bold shadow-xl border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {activeProduct ? `اسأل عن ${activeProduct.name}` : 'اسأل المساعد الذكي'}
        </span>
      </button>

      {isChatOpen && (
        <ChatSystem 
          onClose={() => setIsChatOpen(false)} 
          activeProduct={activeProduct as any} 
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
          <div className="space-y-4">
            <h4 className="text-xl font-black text-dz-green">DZ MARKET</h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto md:ml-0">أول منصة تجزئة ذكية تجمع بين الخبرة الجزائرية والذكاء الاصطناعي العالمي.</p>
          </div>
          <div>
            <h5 className="font-bold mb-4">روابط سريعة</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-dz-green cursor-pointer transition-colors">عن الشركة</li>
              <li className="hover:text-dz-green cursor-pointer transition-colors">سياسة الخصوصية</li>
              <li className="hover:text-dz-green cursor-pointer transition-colors">مساعدة</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">تابعنا</h5>
            <div className="flex justify-center md:justify-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-dz-orange hover:text-white transition-all cursor-pointer"><Share2 size={20}/></div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-dz-green hover:text-white transition-all cursor-pointer"><Bell size={20}/></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
