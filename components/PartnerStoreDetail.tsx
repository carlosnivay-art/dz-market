import React, { useState } from 'react';
import { 
  ChevronRight, Sparkles, Star, Users, Award, ShoppingBag, 
  Phone, Mail, MapPin, Globe, Facebook, Instagram, MessageCircle, 
  ShieldCheck, Share2, Check, ExternalLink 
} from 'lucide-react';
import { User, Product } from '../types';
import { db } from '../services/db';
import ProductCard from './ProductCard';

interface PartnerStoreDetailProps {
  store: User;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onStartChat: (seller: User) => void;
  currentUser: User | null;
}

const PartnerStoreDetail: React.FC<PartnerStoreDetailProps> = ({ 
  store, onBack, onSelectProduct, onStartChat, currentUser 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(store.followersCount || 15);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  const [isCopied, setIsCopied] = useState(false);

  // Filter products by this store
  const storeProducts = db.getProducts().filter(p => p.sellerId === store.id);
  const storeReviews = db.getReviewsForSeller(store.id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
    }
  };

  const handleShare = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-['Cairo'] pb-24" dir="rtl">
      {/* Upper Cover */}
      <div className="relative h-48 bg-linear-to-r from-indigo-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <button 
          onClick={onBack} 
          className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-white transition-all z-20"
        >
          <ChevronRight size={20} />
        </button>
        <button 
          onClick={handleShare}
          className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-white transition-all z-20 flex items-center gap-1.5 text-xs font-bold"
        >
          {isCopied ? <Check size={14} /> : <Share2 size={14} />}
          <span>{isCopied ? 'تم النسخ!' : 'مشاركة'}</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-dz-border dark:border-gray-800 card-shadow flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
          {/* Logo / Avatar */}
          <div className="relative">
            <img 
              src={store.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(store.name)}`} 
              alt={store.name} 
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white dark:border-gray-900 shadow-xl bg-white"
            />
            {store.isOfficialStore && (
              <div className="absolute -bottom-2 -left-2 bg-blue-600 text-white p-2 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-900" title="متجر رسمي معتمد">
                <ShieldCheck size={20} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Profile Text */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl font-black text-dz-text dark:text-white flex items-center gap-2">
                {store.name}
              </h1>
              {store.isOfficialStore && (
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/30 flex items-center gap-1">
                  <Award size={12} /> شريك رسمي
                </span>
              )}
              {store.partnerSubscription && store.partnerSubscription !== 'free' && (
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  store.partnerSubscription === 'enterprise' 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                }`}>
                  {store.partnerSubscription === 'enterprise' ? 'مؤسسة' : 'احترافي'}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
              {store.bio || 'شريك تجاري معتمد لدى ديزاد ماركت يقدم أجود المنتجات والخدمات.'}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10">
                <Star size={14} fill="currentColor" />
                <span>{store.rating?.toFixed(1) || '5.0'} ({store.reviewsCount || 0} تقييم)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                <Users size={14} />
                <span>{followerCount.toLocaleString()} متابع</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                <ShoppingBag size={14} />
                <span>{storeProducts.length} منتج</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                <MapPin size={14} />
                <span>{store.wilaya}</span>
              </div>
            </div>
          </div>

          {/* Follow & Chat Actions */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <button 
              onClick={handleFollowToggle}
              className={`flex-1 md:w-40 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                isFollowing 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
              }`}
            >
              {isFollowing ? <Check size={14} /> : <Users size={14} />}
              <span>{isFollowing ? 'متابع' : 'متابعة المتجر'}</span>
            </button>
            <button 
              onClick={() => onStartChat(store)}
              className="flex-1 md:w-40 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-dz-text dark:text-white border border-dz-border dark:border-gray-700 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 card-shadow"
            >
              <MessageCircle size={14} className="text-dz-green" />
              <span>تواصل مباشر</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-dz-border dark:border-gray-800 mt-8 mb-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-4 font-black text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'products' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShoppingBag size={16} />
            <span>منتجات الشريك ({storeProducts.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 font-black text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'reviews' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Star size={16} />
            <span>التقييمات والآراء ({storeReviews.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-4 font-black text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'about' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Sparkles size={16} />
            <span>تفاصيل الشراكة والتواصل</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'products' && (
            <div>
              {storeProducts.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-12 text-center border dark:border-gray-800">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4 animate-pulse" />
                  <h3 className="font-black text-lg text-dz-text dark:text-white mb-1">لا توجد منتجات معروضة حالياً</h3>
                  <p className="text-gray-400 text-xs font-bold">يقوم هذا الشريك بتجهيز باقة منتجاته حالياً.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {storeProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => onSelectProduct(product)} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {storeReviews.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-12 text-center border dark:border-gray-800">
                  <Star size={48} className="mx-auto text-gray-300 mb-4 animate-pulse" />
                  <h3 className="font-black text-lg text-dz-text dark:text-white mb-1">لا توجد مراجعات حتى الآن</h3>
                  <p className="text-gray-400 text-xs font-bold">كن أول من يشتري ويضع تقييمه الرائع لهذا الشريك.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {storeReviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-sm text-dz-text dark:text-white">{review.buyerName}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">{new Date(review.timestamp).toLocaleDateString('ar-DZ')}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 space-y-5">
                <h3 className="font-black text-base text-dz-text dark:text-white flex items-center gap-2 border-b pb-3 dark:border-gray-800">
                  <Phone size={18} className="text-blue-600" /> معلومات الاتصال والفرع
                </h3>
                
                <div className="space-y-4 text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-xl text-gray-500">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 mb-0.5">رقم الهاتف</span>
                      <span className="text-dz-text dark:text-white">{store.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-xl text-gray-500">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 mb-0.5">البريد الإلكتروني للشركة</span>
                      <span className="text-dz-text dark:text-white">{store.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-xl text-gray-500">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 mb-0.5">الولاية والمقر الرئيسي</span>
                      <span className="text-dz-text dark:text-white">{store.wilaya}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital channels & Subscriptions */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 space-y-5">
                <h3 className="font-black text-base text-dz-text dark:text-white flex items-center gap-2 border-b pb-3 dark:border-gray-800">
                  <Globe size={18} className="text-indigo-600" /> القنوات الرقمية ومستوى الشراكة
                </h3>

                <div className="space-y-3">
                  <span className="block text-[10px] text-gray-400 font-bold mb-1">الروابط الرسمية</span>
                  <div className="grid grid-cols-3 gap-2">
                    {store.socialLinks?.website ? (
                      <a href={store.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-white">
                        <Globe size={18} className="text-blue-500" />
                        <span className="text-[10px] font-black">موقع الويب</span>
                      </a>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl opacity-40">
                        <Globe size={18} />
                        <span className="text-[10px] font-bold">موقع الويب</span>
                      </div>
                    )}

                    {store.socialLinks?.facebook ? (
                      <a href={store.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-white">
                        <Facebook size={18} className="text-blue-600" />
                        <span className="text-[10px] font-black">فيسبوك</span>
                      </a>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl opacity-40">
                        <Facebook size={18} />
                        <span className="text-[10px] font-bold">فيسبوك</span>
                      </div>
                    )}

                    {store.socialLinks?.instagram ? (
                      <a href={store.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-white">
                        <Instagram size={18} className="text-pink-600" />
                        <span className="text-[10px] font-black">إنستغرام</span>
                      </a>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl opacity-40">
                        <Instagram size={18} />
                        <span className="text-[10px] font-bold">إنستغرام</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1.5">
                  <span className="block text-[10px] text-gray-400 font-bold">حالة الشراكة والتوثيق</span>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={16} /> متجر رسمي معتمد
                    </span>
                    <span className="text-[10px] px-2.5 py-1 bg-indigo-600 text-white rounded-lg">شريك نشط</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerStoreDetail;
