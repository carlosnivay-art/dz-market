
import React, { useState } from 'react';
import { ShoppingBag, Store, ShieldCheck, Truck, CreditCard, Languages, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectRole: (role: 'buyer' | 'seller') => void;
}

type Language = 'ar' | 'fr' | 'en';

const content = {
  ar: {
    dir: 'rtl',
    slogan: 'سوقك الجزائري الذكي',
    subtitle: 'تجارة محلية مدعومة بالذكاء الاصطناعي',
    welcome: 'مرحباً بك في Dz Market',
    choice: 'اختر طريقة الدخول',
    buyerTitle: 'الدخول كمشتري',
    buyerDesc: 'تصفح المنتجات، اطلب بسهولة، وادفع عند الاستلام',
    sellerTitle: 'الدخول كبائع',
    sellerDesc: 'أنشئ متجرك، أضف منتجاتك، وزد مبيعاتك',
    footer: 'الدفع عند الاستلام | توصيل لـ 58 ولاية | بائعون موثوقون'
  },
  fr: {
    dir: 'ltr',
    slogan: 'Votre marché algérien intelligent',
    subtitle: 'Commerce local soutenu par l\'IA',
    welcome: 'Bienvenue sur Dz Market',
    choice: 'Choisissez votre rôle',
    buyerTitle: 'Connexion en tant qu’acheteur',
    buyerDesc: 'Parcourez les produits, commandez facilement et payez à la livraison',
    sellerTitle: 'Connexion en tant que vendeur',
    sellerDesc: 'Créez votre boutique, ajoutez vos produits et augmentez vos ventes',
    footer: 'Paiement à la livraison | Livraison 58 wilayas | Vendeurs fiables'
  },
  en: {
    dir: 'ltr',
    slogan: 'Your Smart Algerian Market',
    subtitle: 'Local commerce powered by AI',
    welcome: 'Welcome to Dz Market',
    choice: 'Choose your role',
    buyerTitle: 'Login as Buyer',
    buyerDesc: 'Browse products, order easily, and pay on delivery',
    sellerTitle: 'Login as Seller',
    sellerDesc: 'Create your store, add products, and boost your sales',
    footer: 'Cash on delivery | Delivery to 58 provinces | Trusted sellers'
  }
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
  const [lang, setLang] = useState<Language>('ar');
  const t = content[lang];

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col items-center justify-between p-6 overflow-hidden font-['Cairo']`} dir={t.dir}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-dz-green rounded-b-[4rem] shadow-2xl z-0"></div>
      <div className="absolute top-20 -right-20 w-64 h-64 bg-dz-orange/20 rounded-full blur-3xl"></div>

      {/* Header & Language Selection */}
      <div className="relative z-10 w-full flex flex-col items-center pt-8">
        <div className="flex gap-2 mb-8 bg-white/10 p-1 rounded-full border border-white/20 backdrop-blur-md">
          <button onClick={() => setLang('ar')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ar' ? 'bg-dz-orange text-white' : 'text-white hover:bg-white/10'}`}>🇩🇿 العربية</button>
          <button onClick={() => setLang('fr')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'fr' ? 'bg-dz-orange text-white' : 'text-white hover:bg-white/10'}`}>🇫🇷 FR</button>
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-dz-orange text-white' : 'text-white hover:bg-white/10'}`}>🇬🇧 EN</button>
        </div>

        <div className="flex flex-col items-center text-white text-center">
          <div className="bg-white p-4 rounded-[2rem] shadow-2xl mb-4 rotate-3 transform hover:rotate-0 transition-transform">
             <ShoppingBag size={48} className="text-dz-green" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-1">DZ MARKET</h1>
          <p className="text-sm font-bold opacity-90 mb-2">{t.slogan}</p>
          <div className="flex items-center gap-2 bg-dz-orange px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
             <Sparkles size={12} /> {t.subtitle}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 my-8 border border-gray-100">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-black text-gray-800 mb-2">{t.welcome}</h2>
           <p className="text-gray-400 text-sm font-medium">{t.choice}</p>
        </div>

        <div className="space-y-4">
          {/* Buyer Button */}
          <button 
            onClick={() => onSelectRole('buyer')}
            className="w-full bg-dz-green group hover:bg-dz-green/95 p-6 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-dz-green/20"
          >
            <div className="bg-white/10 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
              <ShoppingBag size={28} />
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-black text-lg leading-none mb-2">{t.buyerTitle}</h3>
              <p className="text-xs opacity-70 leading-relaxed">{t.buyerDesc}</p>
            </div>
          </button>

          {/* Seller Button */}
          <button 
            onClick={() => onSelectRole('seller')}
            className="w-full bg-white group hover:bg-gray-50 p-6 rounded-[2.5rem] flex items-center gap-5 text-right transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-dz-green/10"
          >
            <div className="bg-dz-green/10 p-4 rounded-2xl text-dz-green group-hover:scale-110 transition-transform">
              <Store size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-dz-green leading-none mb-2">{t.sellerTitle}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{t.sellerDesc}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Trust Indicators */}
      <div className="relative z-10 w-full py-6 flex flex-col items-center gap-4 text-center">
        <div className="flex justify-center gap-8 text-dz-green opacity-40">
           <Truck size={20} />
           <ShieldCheck size={20} />
           <CreditCard size={20} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-xs leading-relaxed">
          {t.footer}
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
