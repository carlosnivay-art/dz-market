
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, CreditCard, Truck, ShieldCheck, 
  CheckCircle2, ArrowRight, Wallet, ShoppingBag, MapPin, BadgeCheck
} from 'lucide-react';
import { Product } from '../types';

interface PaymentScreenProps {
  product: Product;
  onBack: () => void;
  onSuccess: () => void;
}

type Language = 'ar' | 'fr' | 'en';

const i18n = {
  ar: {
    dir: 'rtl',
    header: 'الدفع الآمن مع بريد موب',
    summary: 'ملخص الطلب',
    delivery: 'عنوان التوصيل',
    change: 'تغيير',
    total: 'المجموع الإجمالي',
    payBaridi: 'ادفع عبر بريد موب',
    payCOD: 'الدفع عند الاستلام',
    success: 'تم الدفع بنجاح!',
    receipt: 'رقم المعاملة',
    return: 'العودة للتسوق',
    trust: 'دفع آمن | توصيل سريع | دعم 24/7',
    quantity: 'الكمية'
  },
  fr: {
    dir: 'ltr',
    header: 'Paiement sécurisé avec Baridimob',
    summary: 'Résumé de la commande',
    delivery: 'Adresse de livraison',
    change: 'Modifier',
    total: 'Montant total',
    payBaridi: 'Payer via Baridimob',
    payCOD: 'Paiement à la livraison',
    success: 'Paiement réussi!',
    receipt: 'ID de transaction',
    return: 'Continuer les achats',
    trust: 'Paiement sécurisé | Livraison rapide | Support 24/7',
    quantity: 'Quantité'
  },
  en: {
    dir: 'ltr',
    header: 'Secure payment via Baridimob',
    summary: 'Order Summary',
    delivery: 'Delivery Address',
    change: 'Change',
    total: 'Total Amount',
    payBaridi: 'Pay via Baridimob',
    payCOD: 'Cash on Delivery',
    success: 'Payment Successful!',
    receipt: 'Transaction ID',
    return: 'Continue Shopping',
    trust: 'Secure Payment | Fast Delivery | 24/7 Support',
    quantity: 'Quantity'
  }
};

const PaymentScreen: React.FC<PaymentScreenProps> = ({ product, onBack, onSuccess }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isProcessing, setIsProcessing] = useState(false);
  const t = i18n[lang];

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500" dir={t.dir}>
        <div className="w-24 h-24 bg-green-100 text-dz-green rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">{t.success}</h2>
        <p className="text-gray-400 mb-8">{t.receipt}: <span className="font-mono font-bold text-gray-800">DZ-{Math.floor(Math.random() * 1000000)}</span></p>
        
        <div className="w-full max-w-sm bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 mb-8">
           <div className="flex justify-between mb-2 text-sm">
             <span className="text-gray-400">{product.name}</span>
             <span className="font-bold">{product.price.toLocaleString()} دج</span>
           </div>
           <div className="flex justify-between font-black text-dz-green border-t pt-2 mt-2">
             <span>{t.total}</span>
             <span>{product.price.toLocaleString()} دج</span>
           </div>
        </div>

        <button 
          onClick={onSuccess}
          className="w-full max-w-sm bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl shadow-dz-green/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {t.return} <ArrowRight size={20} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Cairo']" dir={t.dir}>
      {/* Header */}
      <div className="bg-white px-6 py-6 flex items-center justify-between border-b sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
          {t.dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black text-gray-800">DZ MARKET</h1>
          <p className="text-[10px] text-dz-green font-bold tracking-tight uppercase">{t.header}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setLang('ar')} className={`w-8 h-8 rounded-lg text-[10px] font-bold ${lang === 'ar' ? 'bg-dz-orange text-white' : 'bg-gray-100'}`}>AR</button>
          <button onClick={() => setLang('fr')} className={`w-8 h-8 rounded-lg text-[10px] font-bold ${lang === 'fr' ? 'bg-dz-orange text-white' : 'bg-gray-100'}`}>FR</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-md mx-auto w-full pb-32">
        {/* Order Summary */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-gray-400 mb-4 uppercase tracking-wider">{t.summary}</h3>
          <div className="flex gap-4">
            <img src={product.image} className="w-20 h-20 rounded-2xl object-cover border" alt="P" />
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 leading-tight mb-1">{product.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{t.quantity}: 1</p>
              <p className="text-dz-green font-black">{product.price.toLocaleString()} دج</p>
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">{t.delivery}</h3>
             <button className="text-xs font-bold text-dz-orange">{t.change}</button>
           </div>
           <div className="flex items-start gap-3">
             <div className="p-3 bg-gray-50 rounded-xl text-dz-green">
               <MapPin size={20} />
             </div>
             <div>
               <p className="font-bold text-gray-800 text-sm">أمين دزيري</p>
               <p className="text-xs text-gray-400 leading-relaxed">حي 1200 مسكن، عمارة 4، الجزائر العاصمة</p>
               <p className="text-xs text-gray-400">0550 11 22 33</p>
             </div>
           </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-4">
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-dz-green text-white p-6 rounded-[2rem] shadow-xl shadow-dz-green/20 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-2xl">
                 <Wallet size={24} />
               </div>
               <span className="font-black text-lg">{t.payBaridi}</span>
            </div>
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ChevronLeft className={t.dir === 'rtl' ? '' : 'rotate-180'} />
            )}
          </button>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-white text-gray-700 p-6 rounded-[2rem] border-2 border-gray-100 flex items-center justify-between transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
               <div className="bg-gray-100 p-3 rounded-2xl text-gray-400">
                 <Truck size={24} />
               </div>
               <span className="font-bold">{t.payCOD}</span>
            </div>
            <ChevronLeft className={t.dir === 'rtl' ? '' : 'rotate-180'} />
          </button>
        </section>

        {/* Total Sticky bar emulation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t rounded-t-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 max-w-md mx-auto">
           <div className="flex items-center justify-between mb-4">
             <span className="text-gray-400 font-bold">{t.total}</span>
             <span className="text-2xl font-black text-dz-green">{product.price.toLocaleString()} دج</span>
           </div>
           <div className="flex justify-center gap-6 text-gray-300">
              <div className="flex items-center gap-1"><ShieldCheck size={14} /> <span className="text-[10px] font-bold">{t.trust.split('|')[0]}</span></div>
              <div className="flex items-center gap-1"><BadgeCheck size={14} /> <span className="text-[10px] font-bold">{t.trust.split('|')[2]}</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
