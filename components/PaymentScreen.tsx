
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Truck, ShieldCheck, CheckCircle2, ArrowRight, Wallet, MapPin, BadgeCheck } from 'lucide-react';
import { Product } from '../types';

interface PaymentScreenProps {
  product: Product;
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ product, onBack, onSuccess }) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-24 h-24 bg-green-100 text-dz-green rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-3xl font-black text-dz-text mb-2">تم الطلب بنجاح!</h2>
        <p className="text-gray-400 mb-8 font-bold">شكراً لثقتك في متجرنا</p>
        <button onClick={onSuccess} className="w-full max-w-sm bg-dz-green text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">
          العودة للتسوق <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Cairo']" dir="rtl">
      <div className="bg-white px-6 py-6 flex items-center justify-between border-b sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight /></button>
        <h1 className="text-lg font-black text-dz-green uppercase">DZ MARKET PAYMENT</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-md mx-auto w-full pb-32">
        <section className="bg-white p-6 rounded-[2rem] border border-dz-border card-shadow">
          <h3 className="text-sm font-black text-gray-400 mb-4 uppercase">ملخص الطلب</h3>
          <div className="flex gap-4">
            <img src={product.image} className="w-20 h-20 rounded-2xl object-cover border" alt="P" />
            <div className="flex-1">
              <h4 className="font-bold text-dz-text leading-tight mb-1">{product.name}</h4>
              <p className="text-dz-green font-black">{product.price.toLocaleString()} دج</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-dz-green text-white p-6 rounded-[2rem] shadow-xl flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
            <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-2xl"><Wallet size={24} /></div>
               <span className="font-black text-lg">ادفع عبر بريد موب</span>
            </div>
            {isProcessing ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ChevronLeft />}
          </button>
          <button onClick={handlePayment} className="w-full bg-white text-dz-text p-6 rounded-[2rem] border-2 border-dz-border flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-4">
               <div className="bg-gray-100 p-3 rounded-2xl text-gray-400"><Truck size={24} /></div>
               <span className="font-bold">الدفع عند الاستلام</span>
            </div>
            <ChevronLeft />
          </button>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t rounded-t-[2.5rem] shadow-2xl z-40 max-w-md mx-auto">
         <div className="flex items-center justify-between mb-4">
           <span className="text-gray-400 font-bold">المجموع الإجمالي</span>
           <span className="text-2xl font-black text-dz-green">{product.price.toLocaleString()} دج</span>
         </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
