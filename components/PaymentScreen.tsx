import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Truck, ShieldCheck, CheckCircle2, 
  ArrowRight, Wallet, MapPin, BadgeCheck, CreditCard, Landmark, 
  Loader2, Lock, Star, Info, Award
} from 'lucide-react';
import { Product, User as UserType, Order } from '../types';
import { db } from '../services/db';
import { WILAYAS } from '../constants';

interface PaymentScreenProps {
  product: Product;
  currentUser: UserType | null;
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'cod' | 'baridimob' | 'edahabia';

interface DeliveryCompany {
  id: string;
  name: string;
  price: number;
  duration: string;
  rating: number;
  icon: string;
  covers: (buyerWilaya: string, sellerWilaya: string) => boolean;
}

const DELIVERY_COMPANIES: DeliveryCompany[] = [
  {
    id: 'yalidine',
    name: 'Yalidine Express',
    price: 600,
    duration: '2-4 أيام',
    rating: 4.8,
    icon: '🚚',
    covers: () => true // Yalidine covers all 58 Algerian wilayas
  },
  {
    id: 'zrexpress',
    name: 'ZR Express',
    price: 500,
    duration: '3-5 أيام',
    rating: 4.6,
    icon: '🚚',
    covers: (buyerWilaya: string, sellerWilaya: string) => {
      const activeWilayas = [
        'alger', 'الجزائر', 'oran', 'وهران', 'setif', 'سطيف', 'constantine', 'قسنطينة',
        'blida', 'البليدة', 'bejaia', 'béjaïa', 'bordj bou arreridj', 'برج بوعريريج',
        'tizi ouzou', 'tizi-ouzou', 'تيزي وزو', 'annaba', 'عنابة', 'tlemcen', 'تلمسان', 'ghardaia', 'ghardaïa', 'غرداية'
      ];
      const normB = buyerWilaya.toLowerCase().trim();
      const normS = sellerWilaya.toLowerCase().trim();
      
      const bCovered = activeWilayas.some(w => normB.includes(w) || w.includes(normB));
      const sCovered = activeWilayas.some(w => normS.includes(w) || w.includes(normS));
      return bCovered && sCovered;
    }
  },
  {
    id: 'ecotrans',
    name: 'Ecotrans',
    price: 400,
    duration: '4-6 أيام',
    rating: 4.3,
    icon: '🚚',
    covers: (buyerWilaya: string, sellerWilaya: string) => {
      const ecoWilayas = [
        'alger', 'الجزائر', 'oran', 'وهران', 'setif', 'سطيف', 'blida', 'البليدة', 'boumerdes', 'boumerdès', 'بومرداس', 'tipaza', 'tipasa', 'تيبازة'
      ];
      const normB = buyerWilaya.toLowerCase().trim();
      const normS = sellerWilaya.toLowerCase().trim();
      
      const bCovered = ecoWilayas.some(w => normB.includes(w) || w.includes(normB));
      const sCovered = ecoWilayas.some(w => normS.includes(w) || w.includes(normS));
      return bCovered && sCovered;
    }
  },
  {
    id: 'noest',
    name: 'Noest Delivery',
    price: 350,
    duration: '2-3 أيام',
    rating: 4.5,
    icon: '🚚',
    covers: (buyerWilaya: string, sellerWilaya: string) => {
      const centralWilayas = [
        'alger', 'الجزائر', 'blida', 'البليدة', 'tipaza', 'tipasa', 'تيبازة', 'boumerdes', 'boumerdès', 'بومرداس'
      ];
      const normB = buyerWilaya.toLowerCase().trim();
      const normS = sellerWilaya.toLowerCase().trim();
      
      const bCovered = centralWilayas.some(w => normB.includes(w) || w.includes(normB));
      const sCovered = centralWilayas.some(w => normS.includes(w) || w.includes(normS));
      return bCovered && sCovered;
    }
  }
];

const PaymentScreen: React.FC<PaymentScreenProps> = ({ product, currentUser, onBack, onSuccess }) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [checkoutStep, setCheckoutStep] = useState<'payment_method' | 'delivery_company' | 'order_summary'>('payment_method');
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<DeliveryCompany | null>(null);
  
  // Buyer's shipping info
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'محمد بلقاسم');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '0661998877');
  const [buyerWilaya, setBuyerWilaya] = useState(currentUser?.wilaya || 'وهران');
  const [buyerAddress, setBuyerAddress] = useState(currentUser?.address || 'حي 500 مسكن، الطابق الثاني');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Filter companies based on current buyer and seller wilayas
  const availableCompanies = DELIVERY_COMPANIES.filter(company => 
    company.covers(buyerWilaya, product.wilaya)
  );

  const handleConfirmOrder = () => {
    if (!selectedMethod || !selectedCompany) return;
    
    setIsProcessing(true);
    
    // Simulate payment/order registration
    setTimeout(() => {
      const orderData = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        buyerId: currentUser?.id || 'u2',
        buyerName: buyerName,
        buyerPhone: buyerPhone,
        buyerWilaya: buyerWilaya,
        buyerAddress: buyerAddress,
        sellerId: product.sellerId,
        paymentMethod: selectedMethod === 'edahabia' ? 'البطاقة الذهبية' : selectedMethod === 'baridimob' ? 'بريد موب' : 'الدفع عند الاستلام',
        deliveryCompany: selectedCompany.name,
        deliveryPrice: selectedCompany.price
      };

      const newOrder = db.createOrder(orderData);
      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  // Safe navigation backward
  const handleBackSubStep = () => {
    if (checkoutStep === 'order_summary') {
      setCheckoutStep('delivery_company');
    } else if (checkoutStep === 'delivery_company') {
      setCheckoutStep('payment_method');
    } else {
      onBack();
    }
  };

  if (step === 'success') {
    const totalWithDelivery = product.price + (createdOrder?.deliveryPrice || 0);
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500" dir="rtl">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-dz-green rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-black text-dz-text dark:text-white mb-2">تم تسجيل طلبك بنجاح! 🎉</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-6 font-bold text-sm">رقم الطلب المرجعي: <span className="text-dz-green font-mono text-base font-black">#{createdOrder?.id || 'DZ-7281'}</span></p>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] w-full max-w-md mb-8 border border-dz-border dark:border-gray-800 space-y-4 text-right">
          <h4 className="font-black text-xs text-gray-400 mb-2 uppercase tracking-wider border-b pb-2 dark:border-gray-800">تفاصيل الفاتورة والشحن</h4>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">اسم المنتج:</span>
            <span className="font-black text-gray-800 dark:text-gray-200">{product.name}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">شركة التوصيل:</span>
            <span className="font-black text-blue-600 flex items-center gap-1">🚚 {createdOrder?.deliveryCompany}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">مدة التوصيل المتوقعة:</span>
            <span className="font-black text-gray-700 dark:text-gray-300">{selectedCompany?.duration}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">طريقة الدفع:</span>
            <span className="font-black text-gray-700 dark:text-gray-300">{createdOrder?.paymentMethod}</span>
          </div>

          <div className="border-t border-dashed my-3 dark:border-gray-800"></div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">سعر المنتج:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">{product.price.toLocaleString()} دج</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">سعر التوصيل:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">{(createdOrder?.deliveryPrice || 0).toLocaleString()} دج</span>
          </div>

          <div className="flex justify-between items-center text-sm font-black border-t pt-3 dark:border-gray-800">
            <span className="text-dz-text dark:text-white">المبلغ الإجمالي الكلي:</span>
            <span className="text-dz-green text-lg">{totalWithDelivery.toLocaleString()} دج</span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-4 rounded-2xl w-full max-w-md mb-8 text-xs font-bold border border-amber-200/40 flex gap-2.5 items-start">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p className="text-right leading-relaxed">
            مرحباً {buyerName}! لقد تم إرسال طلبك بنجاح إلى البائع. سيقوم البائع بالتواصل معك هاتفياً على الرقم <span className="font-mono">{buyerPhone}</span> لتأكيد العنوان وشحن الطرد فوراً عبر {createdOrder?.deliveryCompany}.
          </p>
        </div>

        <button onClick={onSuccess} className="w-full max-w-md bg-dz-green text-white py-5 rounded-[2rem] font-black shadow-xl shadow-dz-green/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          العودة للتسوق <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    );
  }

  const paymentMethods = [
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
      title: 'الدفع عند الاستلام (COD)', 
      desc: 'خلص كتر توصلك السلعة ليدك وهران/الجزائر', 
      icon: <Truck size={24} />,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-['Cairo'] pb-36" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-6 flex items-center justify-between border-b dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <button onClick={handleBackSubStep} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all dark:text-white">
          <ChevronRight />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-dz-green uppercase tracking-tighter">مسار الشراء الذكي</h1>
          <p className="text-[10px] text-gray-400 font-bold">DZ MARKET CHECKOUT</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-4 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-gray-800 z-0">
            <div 
              className="h-full bg-dz-green transition-all duration-300"
              style={{
                width: checkoutStep === 'payment_method' ? '0%' : checkoutStep === 'delivery_company' ? '50%' : '100%'
              }}
            ></div>
          </div>

          {/* Step 1: Payment Method */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
              checkoutStep === 'payment_method' 
              ? 'bg-dz-green text-white border-dz-green shadow-md shadow-dz-green/20 scale-110'
              : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800'
            }`}>
              1
            </div>
            <span className={`text-[10px] font-black mt-1.5 ${checkoutStep === 'payment_method' ? 'text-dz-green' : 'text-gray-400'}`}>طريقة الدفع</span>
          </div>

          {/* Step 2: Delivery Company */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
              checkoutStep === 'delivery_company' 
              ? 'bg-dz-green text-white border-dz-green shadow-md shadow-dz-green/20 scale-110'
              : (checkoutStep === 'order_summary' ? 'bg-dz-green text-white border-dz-green' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800')
            }`}>
              2
            </div>
            <span className={`text-[10px] font-black mt-1.5 ${checkoutStep === 'delivery_company' ? 'text-dz-green' : (checkoutStep === 'order_summary' ? 'text-dz-green' : 'text-gray-400')}`}>شركة التوصيل</span>
          </div>

          {/* Step 3: Order Summary */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
              checkoutStep === 'order_summary' 
              ? 'bg-dz-green text-white border-dz-green shadow-md shadow-dz-green/20 scale-110'
              : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800'
            }`}>
              3
            </div>
            <span className={`text-[10px] font-black mt-1.5 ${checkoutStep === 'order_summary' ? 'text-dz-green' : 'text-gray-400'}`}>تأكيد الطلب</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Progress description */}
        <div className="text-center md:text-right px-2">
          {checkoutStep === 'payment_method' && (
            <div>
              <h2 className="text-xl font-black text-dz-text dark:text-white">اختر طريقة الدفع المناسبة لك</h2>
              <p className="text-xs text-gray-400 font-bold mt-1">نوفر لك طرق دفع متعددة وآمنة بالكامل 💳</p>
            </div>
          )}
          {checkoutStep === 'delivery_company' && (
            <div>
              <h2 className="text-xl font-black text-dz-text dark:text-white">اختر شركة التوصيل المناسبة</h2>
              <p className="text-xs text-gray-400 font-bold mt-1">تختلف أسعار التوصيل ومدة وصول الشحنة بحسب الولاية 🚚</p>
            </div>
          )}
          {checkoutStep === 'order_summary' && (
            <div>
              <h2 className="text-xl font-black text-dz-text dark:text-white">مراجعة وتأكيد طلب الشراء</h2>
              <p className="text-xs text-gray-400 font-bold mt-1">الخطوة الأخيرة! يرجى مراجعة تفاصيل الشحن والأسعار قبل التأكيد 📝</p>
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* STEP 1: PAYMENT METHODS */}
        {/* ========================================================== */}
        {checkoutStep === 'payment_method' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Purchase Item Card */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-dz-border dark:border-gray-800 flex gap-4 shadow-xs">
              <img src={product.image} className="w-16 h-16 rounded-2xl object-cover border dark:border-gray-800" alt={product.name} />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-black text-sm text-gray-800 dark:text-white truncate">{product.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">البائع: {product.sellerName} • ولاية {product.wilaya}</p>
                <p className="text-dz-green font-black text-sm mt-1">{product.price.toLocaleString()} دج</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id as PaymentMethod);
                  }}
                  className={`group relative w-full text-right p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between overflow-hidden ${
                    selectedMethod === method.id 
                    ? 'bg-dz-green/[0.03] border-dz-green shadow-md' 
                    : 'bg-white dark:bg-gray-900 border-dz-border dark:border-gray-800 hover:border-dz-green/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all ${
                      selectedMethod === method.id 
                      ? 'bg-dz-green text-white scale-105 shadow-md shadow-dz-green/15' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <h4 className={`font-black text-xs md:text-sm mb-0.5 ${selectedMethod === method.id ? 'text-dz-green' : 'text-dz-text dark:text-gray-200'}`}>
                        {method.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold">{method.desc}</p>
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedMethod === method.id 
                    ? 'bg-dz-green border-dz-green' 
                    : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    {selectedMethod === method.id && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Credit Card Gate */}
            {selectedMethod === 'edahabia' && (
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 text-blue-600">
                  <Lock size={14} /> <span className="text-[10px] font-black uppercase">بوابة الدفع الآمنة بريد الجزائر</span>
                </div>
                <input type="text" placeholder="رقم البطاقة الذهبية (16 رقم)" className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl py-3.5 px-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-wider" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="الشهر / السنة (MM/YY)" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl py-3.5 px-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                  <input type="password" placeholder="الرمز السري (CVV)" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl py-3.5 px-5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 2: CHOOSE DELIVERY COMPANY */}
        {/* ========================================================== */}
        {checkoutStep === 'delivery_company' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Shipping Wilaya Simulator / Interactive selector */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-dz-border dark:border-gray-800 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2 dark:border-gray-800">
                <span className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-1.5">
                  <MapPin size={16} className="text-dz-green" /> عنوان الشحن والولاية
                </span>
                <span className="text-[10px] bg-dz-green/10 text-dz-green py-0.5 px-2.5 rounded-full font-black">قابل للتعديل للمحاكاة</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-right">
                  <label className="text-[10px] text-gray-400 font-bold block">ولاية الشحن والتوصيل 🇩🇿</label>
                  <select 
                    value={buyerWilaya} 
                    onChange={(e) => {
                      setBuyerWilaya(e.target.value);
                      // Clear selected company if it does not cover the newly selected wilaya
                      const matched = DELIVERY_COMPANIES.find(c => c.id === selectedCompany?.id);
                      if (matched && !matched.covers(e.target.value, product.wilaya)) {
                        setSelectedCompany(null);
                      }
                    }}
                    className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-black text-gray-800 dark:text-white outline-none focus:border-dz-green"
                  >
                    {WILAYAS.map((w, index) => (
                      <option key={index} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-[10px] text-gray-400 font-bold block">العنوان الدقيق بالتفصيل</label>
                  <input 
                    type="text" 
                    value={buyerAddress} 
                    onChange={(e) => setBuyerAddress(e.target.value)} 
                    placeholder="رقم الشارع، اسم الحي، رقم العمارة" 
                    className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-dz-green"
                  />
                </div>
              </div>

              {/* Display seller location as static badge */}
              <div className="flex items-center justify-between text-[11px] bg-blue-50/40 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100/30">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="font-black text-blue-600">المتجر يقع في:</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">ولاية {product.wilaya}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span>تأثير التغطية نشط</span>
                </div>
              </div>
            </div>

            {/* Companies List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-dz-text dark:text-gray-300 px-1">الشركات المتوفرة للشحن إلى ولاية ({buyerWilaya}):</h3>
              
              {availableCompanies.length === 0 ? (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-8 rounded-[2rem] text-center space-y-3">
                  <span className="text-3xl block">⚠️</span>
                  <h4 className="font-black text-sm text-amber-800 dark:text-amber-400">لا توجد شركات توصيل متاحة حالياً لهذه الولاية.</h4>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold max-w-sm mx-auto leading-relaxed">
                    شركات ZR Express أو Ecotrans أو Noest لا تغطي مسار التوصيل بين ولاية البائع ({product.wilaya}) وولاية المشتري ({buyerWilaya}) حالياً. يرجى اختيار ولاية أخرى للاختبار والمحاكاة.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {availableCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className={`group w-full text-right p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between overflow-hidden ${
                        selectedCompany?.id === company.id 
                        ? 'bg-dz-green/[0.03] border-dz-green shadow-md ring-4 ring-dz-green/5' 
                        : 'bg-white dark:bg-gray-900 border-dz-border dark:border-gray-800 hover:border-dz-green/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                          selectedCompany?.id === company.id 
                          ? 'bg-dz-green text-white scale-105 shadow-md shadow-dz-green/15' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {company.icon}
                        </div>

                        <div>
                          <h4 className={`font-black text-xs md:text-sm mb-0.5 ${selectedCompany?.id === company.id ? 'text-dz-green' : 'text-dz-text dark:text-gray-200'}`}>
                            {company.name}
                          </h4>
                          
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                            <span className="flex items-center gap-0.5 text-amber-500">
                              <Star size={10} fill="currentColor" /> {company.rating}
                            </span>
                            <span>•</span>
                            <span className="text-gray-500">توصيل خلال: {company.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <span className="block text-xs font-black text-dz-green">{company.price.toLocaleString()} دج</span>
                          <span className="block text-[8px] text-gray-400 font-bold">سعر الشحن للولاية</span>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedCompany?.id === company.id 
                          ? 'bg-dz-green border-dz-green' 
                          : 'border-gray-200 dark:border-gray-700'
                        }`}>
                          {selectedCompany?.id === company.id && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 3: ORDER SUMMARY & CONFIRM */}
        {/* ========================================================== */}
        {checkoutStep === 'order_summary' && selectedCompany && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Buyer shipping information details */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-[2.5rem] border border-dz-border dark:border-gray-800 space-y-3 shadow-xs text-right">
              <h4 className="text-xs font-black text-gray-400 border-b pb-2 dark:border-gray-800">بيانات المستلم والتوصيل</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">اسم العميل:</span>
                  <input 
                    type="text" 
                    value={buyerName} 
                    onChange={(e) => setBuyerName(e.target.value)} 
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 font-bold outline-none border dark:border-gray-700"
                  />
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">رقم الهاتف:</span>
                  <input 
                    type="text" 
                    value={buyerPhone} 
                    onChange={(e) => setBuyerPhone(e.target.value)} 
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 font-mono font-bold outline-none border dark:border-gray-700 text-left"
                  />
                </div>
              </div>

              <div className="pt-2 text-xs">
                <span className="text-gray-400 block mb-1">عنوان التسليم والولاية:</span>
                <p className="font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border dark:border-gray-800">
                  ولاية {buyerWilaya} - {buyerAddress}
                </p>
              </div>
            </div>

            {/* Product & Courier Card Combined */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dz-border dark:border-gray-800 shadow-xs overflow-hidden">
              <div className="p-5 flex gap-4 border-b dark:border-gray-800">
                <img src={product.image} className="w-16 h-16 rounded-2xl object-cover border dark:border-gray-800" alt={product.name} />
                <div className="flex-1 min-w-0 flex flex-col justify-center text-right">
                  <h4 className="font-black text-sm text-gray-800 dark:text-white truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">سعر السلعة: {product.price.toLocaleString()} دج</p>
                  <p className="text-[10px] text-dz-orange font-bold mt-0.5">البائع: {product.sellerName}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center px-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚚</span>
                  <div className="text-right">
                    <span className="block text-xs font-black text-gray-800 dark:text-gray-200">{selectedCompany.name}</span>
                    <span className="block text-[9px] text-gray-400">توصيل خلال {selectedCompany.duration}</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-black text-dz-green">{selectedCompany.price} دج</span>
                </div>
              </div>
            </div>

            {/* Financial Invoice Details */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-dz-border dark:border-gray-800 shadow-xs space-y-3.5 text-right">
              <h4 className="text-xs font-black text-gray-400 border-b pb-2 dark:border-gray-800">تفاصيل الفاتورة النهائية</h4>
              
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">سعر المنتج الأساسي:</span>
                <span className="text-gray-800 dark:text-gray-200">{product.price.toLocaleString()} دج</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">سعر شحن الطرد (توصيل):</span>
                <span className="text-gray-800 dark:text-gray-200">+{selectedCompany.price.toLocaleString()} دج</span>
              </div>

              <div className="border-t border-dashed my-2 dark:border-gray-800"></div>

              <div className="flex justify-between items-center font-black text-sm">
                <span className="text-dz-text dark:text-white">المجموع الإجمالي الكلي:</span>
                <span className="text-dz-green text-lg">{(product.price + selectedCompany.price).toLocaleString()} دج</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-5 border-t dark:border-gray-800 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-40 max-w-2xl mx-auto w-full">
         <div className="flex items-center justify-between mb-4 px-2">
           <div>
             <span className="text-gray-400 text-[10px] font-bold block mb-0.5">المجموع الكلي التقريبي</span>
             <span className="text-2xl font-black text-dz-green leading-none">
               {(product.price + (selectedCompany ? selectedCompany.price : 0)).toLocaleString()}{' '}
               <span className="text-xs font-bold">دج</span>
             </span>
           </div>
           
           <div className="flex items-center gap-1.5 text-[10px] font-black bg-blue-50 dark:bg-blue-950/20 text-blue-600 px-3.5 py-1.5 rounded-xl border border-blue-100/30">
              <BadgeCheck size={14} />
              <span>ضمان حماية المشتري</span>
           </div>
         </div>
         
         {/* Dynamic Wizard Action Buttons */}
         {checkoutStep === 'payment_method' && (
           <button 
             onClick={() => setCheckoutStep('delivery_company')}
             disabled={!selectedMethod}
             className={`w-full py-4.5 rounded-[2rem] font-black text-sm md:text-base shadow-lg transition-all flex items-center justify-center gap-2 group ${
               !selectedMethod 
               ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
               : 'bg-dz-green text-white hover:opacity-95 active:scale-95 shadow-dz-green/15'
             }`}
           >
             <span>متابعة إلى اختيار شركة التوصيل</span>
             <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
           </button>
         )}

         {checkoutStep === 'delivery_company' && (
           <button 
             onClick={() => setCheckoutStep('order_summary')}
             disabled={!selectedCompany}
             className={`w-full py-4.5 rounded-[2rem] font-black text-sm md:text-base shadow-lg transition-all flex items-center justify-center gap-2 group ${
               !selectedCompany 
               ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
               : 'bg-dz-green text-white hover:opacity-95 active:scale-95 shadow-dz-green/15'
             }`}
           >
             <span>متابعة إلى تأكيد الطلب</span>
             <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
           </button>
         )}

         {checkoutStep === 'order_summary' && (
           <button 
             onClick={handleConfirmOrder}
             disabled={isProcessing}
             className="w-full py-4.5 bg-dz-green text-white rounded-[2rem] font-black text-sm md:text-base shadow-lg hover:opacity-95 active:scale-95 shadow-dz-green/15 flex items-center justify-center gap-2"
           >
             {isProcessing ? (
               <>
                 <Loader2 className="animate-spin" size={18} />
                 <span>جاري تسجيل وتأكيد طلبك...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 size={18} />
                 <span>تأكيد الطلب الآن</span>
               </>
             )}
           </button>
         )}
         
         <p className="text-[8px] md:text-[9px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest leading-relaxed">
           جميع المعاملات في DZ MARKET مشفرة ومحمية ببروتوكولات الأمان القياسية الجزائرية 🇩🇿
         </p>
      </div>
    </div>
  );
};

export default PaymentScreen;
