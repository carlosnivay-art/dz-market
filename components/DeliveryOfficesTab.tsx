import React, { useState, useEffect } from 'react';
import { Truck, Search, Star, MessageSquare, Phone, Mail, MapPin, BadgeCheck, Copy, Check, MessageCircle, AlertCircle, Sparkles, ChevronLeft } from 'lucide-react';
import { db } from '../services/db';
import { User, Review } from '../types';
import { WILAYAS } from '../constants';

interface DeliveryOfficesTabProps {
  currentUser: User | null;
  onStartChat: (userId: string) => void;
  onClose?: () => void;
}

const DeliveryOfficesTab: React.FC<DeliveryOfficesTabProps> = ({ currentUser, onStartChat, onClose }) => {
  const [offices, setOffices] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('All');
  const [selectedOffice, setSelectedOffice] = useState<User | null>(null);
  
  // Office Detail Modal / Section states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Reload offices from database
  const loadOffices = () => {
    // Get all approved delivery offices
    const list = db.getUsers().filter(u => u.role === 'delivery_office' && u.approvalStatus === 'approved');
    setOffices(list);

    if (selectedOffice) {
      const refreshed = db.getUser(selectedOffice.id);
      if (refreshed) {
        setSelectedOffice(refreshed);
        setReviews(db.getReviewsForSeller(refreshed.id));
      }
    }
  };

  useEffect(() => {
    loadOffices();
  }, [selectedOffice?.id]);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleAddOfficeReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffice || !currentUser || !reviewComment.trim()) return;

    db.addReview({
      sellerId: selectedOffice.id, // Reusing sellerId for the office Id in Reviews
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating: reviewStars,
      comment: reviewComment.trim()
    });

    setReviewSuccess('تم تسجيل تقييمك للمكتب بنجاح ودعم موثوقيته! 🌟');
    setReviewComment('');
    
    // Reload office data & reviews
    loadOffices();

    setTimeout(() => {
      setReviewSuccess('');
    }, 3000);
  };

  // Filter offices based on search query and selected wilaya coverage
  const filteredOffices = offices.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (o.bio || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWilaya = selectedWilaya === 'All' || (o.coveredWilayas || []).includes(selectedWilaya);
    return matchesSearch && matchesWilaya;
  });

  // Sort offices: Premium / Recommended first, then by rating
  const sortedOffices = [...filteredOffices].sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return (b.rating || 5) - (a.rating || 5);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Cairo']">
      {!selectedOffice ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border shadow-xs">
            <div className="text-right space-y-1">
              <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-dz-green" size={24} /> شركاء الشحن ومكاتب التوصيل المتوفرة 📦
              </h2>
              <p className="text-xs text-gray-400 font-bold">تصفح وتواصل مع أفضل مكاتب التوصيل المرخصة والموثوقة في 58 ولاية</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-gray-900 p-4 rounded-3xl border shadow-xs">
            <div className="md:col-span-2 relative">
              <input 
                type="text"
                placeholder="ابحث عن اسم مكتب التوصيل أو الخدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3 px-4 pr-10 text-xs font-bold transition-all outline-none"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            </div>

            <div>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-dz-green focus:bg-white rounded-2xl py-3 px-4 text-xs font-bold transition-all outline-none"
              >
                <option value="All">كل الولايات المغطاة</option>
                {WILAYAS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Offices List Grid */}
          {sortedOffices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOffices.map((office) => (
                <div 
                  key={office.id}
                  onClick={() => {
                    setSelectedOffice(office);
                    setReviews(db.getReviewsForSeller(office.id));
                  }}
                  className={`bg-white dark:bg-gray-900 p-5 rounded-[2.2rem] border cursor-pointer hover:shadow-lg hover:border-dz-green/30 transition-all duration-300 flex flex-col justify-between h-[250px] relative ${
                    office.isRecommended ? 'ring-2 ring-amber-400 dark:ring-amber-500/40 bg-amber-50/10' : ''
                  }`}
                >
                  {office.isRecommended && (
                    <span className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Sparkles size={10} fill="currentColor" /> شريك موصى به
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={office.avatar} className="w-12 h-12 rounded-2xl object-cover border bg-gray-50" alt="Office Avatar" />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-black text-gray-800 dark:text-white text-xs md:text-sm">{office.name}</h4>
                          <BadgeCheck size={16} className="text-dz-green" fill="currentColor" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold">المقر الرئيسي: {office.wilaya}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                      {office.bio}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                      {office.coveredWilayas?.slice(0, 4).map((w, i) => (
                        <span key={i} className="bg-gray-100 dark:bg-gray-800 text-[9px] font-black px-2 py-0.5 rounded text-gray-500">{w}</span>
                      ))}
                      {(office.coveredWilayas?.length || 0) > 4 && (
                        <span className="bg-dz-green/10 text-[9px] font-black px-2 py-0.5 rounded text-dz-green">+{office.coveredWilayas!.length - 4} ولاية أخرى</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-gray-400">الطلبات: <strong className="text-gray-800 dark:text-white">{office.ordersCount || 0} طرد</strong></span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 flex items-center gap-0.5"><Star size={12} fill="currentColor" /> {office.rating || '5.0'}</span>
                        <span className="text-gray-400">({office.reviewsCount || 0} تقييم)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2rem] border p-6">
              <Truck size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-black text-gray-500">لا توجد مكاتب شحن مطابقة لبحثك حالياً.</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">تأكد من اختيار ولاية أخرى أو كلمة بحث مختلفة.</p>
            </div>
          )}
        </>
      ) : (
        /* ---------------- PUBLIC DETAIL SCREEN FOR INDIVIDUAL OFFICE ---------------- */
        <div className="space-y-6 animate-in slide-in-from-left duration-500 max-w-4xl mx-auto pb-12">
          {/* Back Button */}
          <button 
            onClick={() => setSelectedOffice(null)}
            className="flex items-center gap-2 text-dz-green dark:text-gray-300 font-bold hover:translate-x-1 transition-transform bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border"
          >
            <ChevronLeft size={18} className="rotate-180" /> العودة لقائمة شركاء التوصيل
          </button>

          {/* Main Info Card */}
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[3rem] border shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b">
              <div className="flex items-center gap-4">
                <img src={selectedOffice.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border bg-gray-50" alt="" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white">{selectedOffice.name}</h2>
                    {selectedOffice.isRecommended && (
                      <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={10} fill="currentColor" /> موصى به
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-600 font-bold flex items-center gap-1"><MapPin size={12} /> المقر الرئيسي: {selectedOffice.wilaya}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleCopyPhone(selectedOffice.phone)}
                  className="flex-1 md:flex-none bg-gray-50 hover:bg-gray-100 border text-gray-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedText ? <Check size={14} className="text-dz-green" /> : <Copy size={14} />}
                  {copiedText ? 'تم نسخ الرقم!' : 'نسخ رقم الهاتف'}
                </button>

                <button 
                  onClick={() => onStartChat(selectedOffice.id)}
                  className="flex-1 md:flex-none bg-dz-green text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-dz-green/20 hover:opacity-95 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <MessageSquare size={14} /> دردشة مباشرة
                </button>
              </div>
            </div>

            {/* Description & Prices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-wider">وصف الخدمات والمميزات:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-bold">
                    {selectedOffice.bio}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-wider">الولايات التي نغطيها بالكامل ({selectedOffice.coveredWilayas?.length || 0} ولاية):</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOffice.coveredWilayas?.map(w => (
                      <span key={w} className="bg-gray-100 dark:bg-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-200/40">{w}</span>
                    )) || <span className="text-gray-400 text-xs">لا يوجد ولايات مسجلة.</span>}
                  </div>
                </div>
              </div>

              {/* Price Table / Details Panel */}
              <div className="bg-amber-50/40 dark:bg-amber-950/10 p-5 rounded-[2rem] border border-amber-200/40 text-xs space-y-3">
                <h4 className="font-black text-amber-800 dark:text-amber-400 flex items-center gap-1.5 border-b pb-2 mb-2">
                  <Truck size={14} /> جدول وأسعار التوصيل:
                </h4>
                <p className="text-gray-700 dark:text-gray-300 font-bold leading-relaxed whitespace-pre-line">
                  {selectedOffice.deliveryPrices}
                </p>
                <div className="pt-2 border-t text-[10px] text-amber-700/80 font-semibold space-y-1">
                  <p>✓ ضمان الحفاظ على الطرود ومحتوياتها بالكامل.</p>
                  <p>✓ سرعة فائقة في تسليم مبالغ السلع للمتاجر.</p>
                </div>
              </div>
            </div>

            {/* Stats Summary Line */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4 text-center text-xs">
              <div className="space-y-1 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                <span className="text-gray-400 font-bold block text-[10px]">الطلبات المسلّمة</span>
                <strong className="text-base text-gray-800 dark:text-white font-black">{selectedOffice.ordersCount || 0} طرد</strong>
              </div>
              <div className="space-y-1 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                <span className="text-gray-400 font-bold block text-[10px]">التقييم العام</span>
                <strong className="text-base text-amber-500 font-black flex items-center justify-center gap-1">
                  <Star size={14} fill="currentColor" /> {selectedOffice.rating || '5.0'}
                </strong>
              </div>
              <div className="space-y-1 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                <span className="text-gray-400 font-bold block text-[10px]">عدد المقيمين</span>
                <strong className="text-base text-gray-800 dark:text-white font-black">{selectedOffice.reviewsCount || 0} تعليق</strong>
              </div>
            </div>
          </div>

          {/* Reviews & Submit Review Form Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Reviews List */}
            <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border space-y-4">
              <h3 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-1.5 border-b pb-3">
                <Star className="text-yellow-500" fill="currentColor" size={16} /> آراء وتقييمات العملاء وتجاربهم ({reviews.length})
              </h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={rev.buyerAvatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          <div>
                            <h5 className="font-black text-gray-800 dark:text-gray-200 text-[11px]">{rev.buyerName}</h5>
                            <p className="text-[9px] text-gray-400 font-semibold">{new Date(rev.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-lg text-[10px] font-black">
                          <Star size={10} fill="currentColor" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 opacity-60">
                    <MessageCircle size={32} className="mx-auto mb-2 text-dz-green" />
                    <p className="font-black text-xs">لا توجد تقييمات مكتوبة لهذا المكتب بعد.</p>
                    <p className="text-[10px] mt-1">كن أول من يكتب تجربته لتعميم الفائدة!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Review Form */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border shadow-xs h-fit">
              <h3 className="text-xs font-black text-gray-800 dark:text-white mb-3">تقييم تجربتك مع مكتب الشحن</h3>

              {reviewSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-xs font-bold text-center">
                  {reviewSuccess}
                </div>
              ) : (
                <form onSubmit={handleAddOfficeReview} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500">عدد النجوم:</label>
                    <div className="flex items-center gap-1.5 justify-center py-1.5 bg-gray-50 rounded-2xl border">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewStars(star)}
                          className="hover:scale-110 active:scale-95 transition-all"
                        >
                          <Star 
                            size={20} 
                            className={star <= reviewStars ? 'text-yellow-500' : 'text-gray-300'} 
                            fill={star <= reviewStars ? 'currentColor' : 'none'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500">تعليقك وتقييمك الصادق:</label>
                    <textarea 
                      rows={2.5}
                      required
                      placeholder="صف تجربتك مع سرعة التوصيل وتسليم الأموال وحسن المعاملة..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-gray-50 border rounded-2xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-dz-green resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={!reviewComment.trim()}
                    className="w-full bg-dz-orange text-white py-2.5 rounded-2xl text-xs font-black shadow-md shadow-dz-orange/20 hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    إرسال تقييمك
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOfficesTab;
