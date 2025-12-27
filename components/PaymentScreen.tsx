
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Truck, ShieldCheck, CheckCircle2, 
  ArrowRight, Wallet, MapPin, BadgeCheck, CreditCard, Landmark, 
  Loader2, Lock
} from 'lucide-react';
import { Product } from '../types';

interface PaymentScreenProps {
  product: Product;
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'cod' | 'baridimob' | 'edahabia';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ product, onBack, onSuccess }) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmOrder = () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    // محاكاة عملية معالجة الدفع
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500" dir="rtl">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-dz-green rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-3xl font-black text-dz-text dark:text-white mb-2">تم الطلب بنجاح!</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-8 font-bold">رقم الطلب: #DZ-{Math.floor(Math.random() * 10000)}</p>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm mb-8 border border-dz-border dark:border-gray-800">
           <p className="text-xs text-gray-500 mb-2">سيتم التواصل معك هاتفياً لتأكيد الشحن</p>
           <div className="flex items-center justify-center gap-2 text-dz-green font-black">
              <Truck size={18} /> توصيل خلال 24-48 ساعة
           </div>
        </div>
        <button onClick={onSuccess} className="w-full max-w-sm bg-dz-green text-white py-5 rounded-[2rem] font-black shadow-xl shadow-dz-green/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          العودة للتسوق <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    );
  }

  const methods = [
    { 
      id: 'edahabia', 
      title: 'البطاقة الذهبية / CIB', 
      desc: 'دفع آمن وفوري عبر بطاقتك البنكية', 
      icon: <CreditCard size={24} />,
      color: 'blue'
    },
    { 
      id: 'baridimob', 
      title: 'بريد موب (BaridiMob)', 
      desc: 'تحويل مباشر من حسابك الجاري CCP', 
      icon: <Wallet size={24} />,
      color: 'orange'
    },
    { 
      id: 'cod', 
      title: 'الدفع عند الاستلام', 
      desc: 'خلص كتر توصلك السلعة ليدك', 
      icon: <Truck size={24} />,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-['Cairo']" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-6 flex items-center justify-between border-b dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
          <ChevronRight />
        </button>
        <h1 className="text-lg font-black text-dz-green uppercase tracking-tighter">DZ MARKET CHECKOUT</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full pb-40">
        {/* Order Summary Card */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-dz-border dark:border-gray-800 card-shadow">
          <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">ملخص المشتريات</h3>
          <div className="flex gap-5">
            <div className="relative">
              <img src={product.image} className="w-24 h-24 rounded-3xl object-cover border-2 border-dz-border dark:border-gray-800 shadow-sm" alt="P" />
              <div className="absolute -top-2 -right-2 bg-dz-orange text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">1x</div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-black text-dz-text dark:text-white text-lg leading-tight mb-1">{product.name}</h4>
              <p className="text-xs text-gray-400 font-bold mb-2">{product.wilaya} • شحن سريع</p>
              <p className="text-dz-green font-black text-xl">{product.price.toLocaleString()} دج</p>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-dz-text dark:text-gray-200 uppercase">اختر طريقة الدفع</h3>
            <div className="flex items-center gap-1 text-[10px] text-dz-green font-black">
              <ShieldCheck size={12} /> دفع آمن 100%
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                className={`group relative w-full text-right p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between overflow-hidden ${
                  selectedMethod === method.id 
                  ? 'bg-dz-green/[0.03] border-dz-green shadow-lg ring-4 ring-dz-green/5' 
                  : 'bg-white dark:bg-gray-900 border-dz-border dark:border-gray-800 hover:border-dz-green/30'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl transition-all ${
                    selectedMethod === method.id 
                    ? 'bg-dz-green text-white scale-110 shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <h4 className={`font-black text-sm mb-0.5 ${selectedMethod === method.id ? 'text-dz-green' : 'text-dz-text dark:text-gray-200'}`}>
                      {method.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold">{method.desc}</p>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMethod === method.id 
                  ? 'bg-dz-green border-dz-green' 
                  : 'border-gray-200 dark:border-gray-700'
                }`}>
                  {selectedMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Payment Form (Conditional) */}
        {selectedMethod === 'edahabia' && (
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 space-y-4 animate-in slide-in-from-top-4 duration-300">
             <div className="flex items-center gap-2 text-blue-600 mb-2">
               <Lock size={16} /> <span className="text-xs font-black uppercase">بوابة الدفع الآمنة</span>
             </div>
             <input type="text" placeholder="رقم البطاقة الذهبية (16 رقم)" className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
             <div className="grid grid-cols-2 gap-3">
               <input type="text" placeholder="MM/YY" className="bg-white dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
               <input type="text" placeholder="CVV" className="bg-white dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-6 border-t dark:border-gray-800 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40 max-w-2xl mx-auto w-full">
         <div className="flex items-center justify-between mb-6 px-2">
           <div>
             <span className="text-gray-400 text-xs font-bold block mb-1">المجموع الكلي للدفع</span>
             <span className="text-3xl font-black text-dz-green leading-none">{product.price.toLocaleString()} <span className="text-sm font-bold">دج</span></span>
           </div>
           <div className="bg-dz-green/5 text-dz-green px-4 py-2 rounded-2xl flex items-center gap-2">
              <BadgeCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-wider">ضمان استرجاع</span>
           </div>
         </div>
         
         <button 
           onClick={handleConfirmOrder}
           disabled={!selectedMethod || isProcessing}
           className={`w-full py-5 rounded-[2.5rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
             !selectedMethod 
             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
             : 'bg-dz-green text-white hover:opacity-95 active:scale-95 shadow-dz-green/20'
           }`}
         >
           {isProcessing ? (
             <>
               <Loader2 className="animate-spin" size={24} />
               <span>جاري المعالجة...</span>
             </>
           ) : (
             <>
               <CheckCircle2 size={24} />
               <span>تأكيد الطلب الآن</span>
             </>
           )}
           
           {/* Glow effect on hover */}
           <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
         </button>
         
         <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
           بضغطك على تأكيد، أنت توافق على شروط الاستخدام في Dz Market
         </p>
      </div>
    </div>
  );
};

export default PaymentScreen;
