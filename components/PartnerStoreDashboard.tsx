import React, { useState } from 'react';
import { 
  Building2, Sparkles, ShoppingBag, Truck, BarChart3, Settings, 
  Plus, Eye, Trash2, CheckCircle, Clock, XCircle, Award, 
  TrendingUp, Wallet, ArrowUpRight, ShieldCheck, Mail, Phone, 
  MapPin, Globe, Facebook, Instagram, Save, HelpCircle, AlertCircle, Star,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { User, Product, Order } from '../types';
import { db } from '../services/db';
import { WILAYAS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PartnerStoreDashboardProps {
  store: User;
  onLogout: () => void;
}

const PartnerStoreDashboard: React.FC<PartnerStoreDashboardProps> = ({ store, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'subscription' | 'profile'>('stats');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  
  // Db products & orders for this seller
  const [products, setProducts] = useState<Product[]>(() => db.getProducts().filter(p => p.sellerId === store.id));
  const [orders, setOrders] = useState<Order[]>(() => db.getOrdersForSeller(store.id));
  
  // Profile settings state
  const [storeName, setStoreName] = useState(store.name);
  const [storeBio, setStoreBio] = useState(store.bio || '');
  const [storePhone, setStorePhone] = useState(store.phone || '');
  const [storeEmail, setStoreEmail] = useState(store.email || '');
  const [storeAvatar, setStoreAvatar] = useState(store.avatar || '');
  const [storeWilaya, setStoreWilaya] = useState(store.wilaya || 'الجزائر');
  const [facebook, setFacebook] = useState(store.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(store.socialLinks?.instagram || '');
  const [website, setWebsite] = useState(store.socialLinks?.website || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Add product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(0);
  const [newProdOldPrice, setNewProdOldPrice] = useState<number>(0);
  const [newProdCategory, setNewProdCategory] = useState('electronics');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdReturnPolicy, setNewProdReturnPolicy] = useState<'none' | '7days' | '14days'>('14days');

  // Stats
  const totalSales = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.productPrice, 0);
  const pendingSalesVal = orders.filter(o => o.status === 'pending' || o.status === 'shipping').reduce((sum, o) => sum + o.productPrice, 0);
  const fulfilledCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // Chart Data
  const chartData = [
    { month: 'جانفي', sales: Math.floor(totalSales * 0.4), orders: Math.max(1, Math.floor(fulfilledCount * 0.4)) },
    { month: 'فيفري', sales: Math.floor(totalSales * 0.6), orders: Math.max(1, Math.floor(fulfilledCount * 0.6)) },
    { month: 'مارس', sales: Math.floor(totalSales * 0.8), orders: Math.max(1, Math.floor(fulfilledCount * 0.8)) },
    { month: 'أفريل', sales: Math.floor(totalSales * 0.9), orders: Math.max(1, Math.floor(fulfilledCount * 0.9)) },
    { month: 'ماي', sales: totalSales, orders: fulfilledCount },
  ];

  // Functions
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...store,
      name: storeName,
      bio: storeBio,
      phone: storePhone,
      email: storeEmail,
      avatar: storeAvatar,
      wilaya: storeWilaya,
      socialLinks: { facebook, instagram, website }
    };
    db.updateUser(store.id, updatedUser);
    setProfileSuccess('تم حفظ معلومات الشركة والفرع بنجاح! سيتم تحديث الصفحة والملف العام للشراكة فورياً ✨');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Omit<Product, 'id' | 'rating' | 'reviewsCount'> = {
      name: newProdName,
      price: newProdPrice,
      oldPrice: newProdOldPrice || undefined,
      category: newProdCategory,
      image: newProdImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      images: [newProdImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      sellerId: store.id,
      sellerName: store.name,
      wilaya: store.wilaya,
      isVerified: true,
      hasStudentDiscount: false,
      isFastDelivery: true,
      description: newProdDesc,
      comments: [],
      returnPolicy: newProdReturnPolicy
    };

    db.createProduct(newProduct as any);
    setProducts(db.getProducts().filter(p => p.sellerId === store.id));
    
    // Reset state
    setNewProdName('');
    setNewProdPrice(0);
    setNewProdOldPrice(0);
    setNewProdCategory('electronics');
    setNewProdDesc('');
    setNewProdImage('');
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟')) {
      db.deleteProduct(id);
      setProducts(db.getProducts().filter(p => p.sellerId === store.id));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    db.updateOrderStatus(orderId, status);
    setOrders(db.getOrdersForSeller(store.id));
  };

  const handleUpgradeSubscription = (plan: 'free' | 'pro' | 'enterprise') => {
    if (confirm(`هل ترغب في ترقية اشتراك شريكك التجاري إلى الخطة ${plan === 'pro' ? 'الاحترافية' : 'المؤسساتية'} للاستفادة من مميزات البيع المتقدمة وعمولات الصفر؟`)) {
      db.updatePartnerStoreSubscription(store.id, plan);
      alert('تم تحديث خطة الاشتراك لمتجرك بنجاح! أهلاً بك في آفاق النمو السريع 🚀');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-['Cairo'] flex" dir="rtl">
      {/* Sidebar Wrapper for collapsing transition & absolute button */}
      <div className={`relative flex shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-0' : 'w-64'
      }`}>
        {/* Sidebar Controls */}
        <aside className={`w-full bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex flex-col justify-between transition-all duration-300 ease-in-out h-screen sticky top-0 ${
          isSidebarCollapsed ? 'p-0 border-l-0 overflow-hidden opacity-0 pointer-events-none' : 'p-6 opacity-100'
        }`}>
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-sm font-black text-dz-text dark:text-white leading-tight">شريك DZ MARKET</h1>
                <span className="text-[10px] text-indigo-600 font-bold">بوابة أعمال الشركات</span>
              </div>
            </div>

            <nav className="space-y-1.5">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-right transition-all flex items-center gap-3 ${
                  activeTab === 'stats' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600'
                }`}
              >
                <BarChart3 size={16} />
                <span>إحصائيات المبيعات</span>
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-right transition-all flex items-center gap-3 ${
                  activeTab === 'products' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600'
                }`}
              >
                <ShoppingBag size={16} />
                <span>كتالوج المنتجات</span>
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-right transition-all flex items-center gap-3 relative ${
                  activeTab === 'orders' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600'
                }`}
              >
                <Truck size={16} />
                <span>طلبات العملاء</span>
                {pendingCount > 0 && (
                  <span className="absolute left-4 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('subscription')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-right transition-all flex items-center gap-3 ${
                  activeTab === 'subscription' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600'
                }`}
              >
                <Award size={16} />
                <span>الاشتراك وعمولات الصفر</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-right transition-all flex items-center gap-3 ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600'
                }`}
              >
                <Settings size={16} />
                <span>إعدادات الشركة</span>
              </button>
            </nav>
          </div>

          <button 
            onClick={onLogout}
            className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-red-600 py-3.5 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>تسجيل خروج</span>
          </button>
        </aside>

        {/* Toggle Button at the top of the sidebar border */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-6 left-0 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 w-8 h-12 rounded-r-none rounded-l-xl border-y border-l border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-lg transition-all hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 focus:outline-none cursor-pointer"
          title={isSidebarCollapsed ? "إظهار القائمة" : "إخفاء القائمة"}
        >
          {isSidebarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Top Header */}
        <div className="flex justify-between items-center border-b pb-6 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-black text-dz-text dark:text-white flex items-center gap-2.5">
              {storeName}
              {store.isOfficialStore && (
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1 font-black">
                  <ShieldCheck size={12} fill="currentColor" /> موثق رسمي
                </span>
              )}
            </h2>
            <p className="text-gray-400 text-xs font-bold mt-1">
              مستوى الاشتراك الحالي: <span className="text-indigo-600 uppercase font-black">{store.partnerSubscription || 'free'}</span>
            </p>
          </div>

          <div className="flex gap-3">
            {activeTab === 'products' && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white py-3.5 px-6 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-all"
              >
                <Plus size={16} /> إضافة منتج جديد
              </button>
            )}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-1.5 rounded-2xl flex items-center gap-3.5 pr-4 card-shadow">
              <div className="text-left">
                <span className="block text-[9px] text-gray-400 font-bold leading-none mb-0.5">مرحباً بك شريكنا</span>
                <span className="text-xs font-black text-dz-text dark:text-white leading-none">{storeName}</span>
              </div>
              <img src={storeAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(storeName)}`} className="w-10 h-10 rounded-xl object-cover bg-white" alt="L" />
            </div>
          </div>
        </div>

        {/* Tab content conditional panels */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 card-shadow flex items-center justify-between">
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold mb-1">إجمالي المبيعات المؤكدة</span>
                  <span className="text-2xl font-black text-indigo-600">{(totalSales).toLocaleString()} دج</span>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-2xl">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 card-shadow flex items-center justify-between">
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold mb-1">المبيعات المعلقة والشحن</span>
                  <span className="text-2xl font-black text-amber-500">{(pendingSalesVal).toLocaleString()} دج</span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
                  <Wallet size={20} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 card-shadow flex items-center justify-between">
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold mb-1">الطلبات المسلمة والناجحة</span>
                  <span className="text-2xl font-black text-emerald-500">{fulfilledCount} طلب</span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-dz-border dark:border-gray-800 card-shadow flex items-center justify-between">
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold mb-1">الطلبات الجديدة قيد التأكيد</span>
                  <span className="text-2xl font-black text-orange-500">{pendingCount} طلب</span>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-2xl">
                  <Clock size={20} />
                </div>
              </div>
            </div>

            {/* Recharts Analytics Panel */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-dz-border dark:border-gray-800 card-shadow">
              <h3 className="font-black text-sm text-dz-text dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-600" /> تحليل نمو المبيعات الشهرية لمتجرك
              </h3>
              
              <div className="h-80 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip formatter={(value) => [`${value} دج`]} labelStyle={{ fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="sales" name="المبيعات" stroke="#4F46E5" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dz-border dark:border-gray-800 card-shadow overflow-hidden">
            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-black text-sm text-dz-text dark:text-white">إدارة كتالوج المنتجات ({products.length})</h3>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h4 className="font-black text-base text-dz-text dark:text-white mb-1">كتالوج المنتجات فارغ</h4>
                <p className="text-gray-400 text-xs font-bold">أضف منتجاتك الرسمية لبدء تلقي الطلبات وتحقيق المبيعات.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] font-black uppercase border-b dark:border-gray-800">
                      <th className="p-4">المنتج</th>
                      <th className="p-4">الفئة</th>
                      <th className="p-4">السعر الأساسي</th>
                      <th className="p-4">التقييم</th>
                      <th className="p-4 text-left">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs font-bold">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover border" alt="P" />
                          <div>
                            <span className="block text-dz-text dark:text-white font-black">{p.name}</span>
                            <span className="block text-[10px] text-gray-400 font-bold">{p.returnPolicy === '14days' ? 'إرجاع خلال 14 يوم' : p.returnPolicy === '7days' ? 'إرجاع خلال 7 أيام' : 'لا يقبل الإرجاع'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-black">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-dz-text dark:text-white">{(p.price).toLocaleString()} دج</td>
                        <td className="p-4 text-amber-500 flex items-center gap-1 mt-3">
                          <Star size={12} fill="currentColor" />
                          <span>{p.rating || '5.0'}</span>
                        </td>
                        <td className="p-4 text-left">
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dz-border dark:border-gray-800 card-shadow overflow-hidden">
            <div className="p-6 border-b dark:border-gray-800">
              <h3 className="font-black text-sm text-dz-text dark:text-white">إدارة ومعالجة طلبات العملاء ({orders.length})</h3>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Truck size={48} className="mx-auto text-gray-300 mb-4" />
                <h4 className="font-black text-base text-dz-text dark:text-white mb-1">لا توجد طلبات واردة بعد</h4>
                <p className="text-gray-400 text-xs font-bold">عند شراء أي مستخدم لمنتجات متجرك، ستظهر معلوماته والطلب هنا فوراً لشحنها.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] font-black uppercase border-b dark:border-gray-800">
                      <th className="p-4">المنتج والطلب</th>
                      <th className="p-4">اسم المشتري وهاتفه</th>
                      <th className="p-4">ولاية التوصيل</th>
                      <th className="p-4">القيمة الاجمالية</th>
                      <th className="p-4">حالة الطلب</th>
                      <th className="p-4 text-left">تحديث الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs font-bold">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={o.productImage} className="w-12 h-12 rounded-xl object-cover border" alt="O" />
                          <div>
                            <span className="block text-dz-text dark:text-white font-black">{o.productName}</span>
                            <span className="block text-[10px] text-gray-400 font-bold">{new Date(o.timestamp).toLocaleDateString('ar-DZ')}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="block text-dz-text dark:text-white font-black">{o.buyerName}</span>
                          <span className="block text-[10px] text-gray-400 font-bold">{o.buyerPhone}</span>
                        </td>
                        <td className="p-4 text-dz-text dark:text-white">{o.buyerWilaya}</td>
                        <td className="p-4 text-dz-text dark:text-white font-black">{(o.productPrice).toLocaleString()} دج</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                            o.status === 'delivered' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : o.status === 'shipping' 
                              ? 'bg-blue-50 text-blue-600 animate-pulse' 
                              : o.status === 'cancelled' 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-orange-50 text-orange-600'
                          }`}>
                            {o.status === 'delivered' ? 'تم التسليم والقبول' : o.status === 'shipping' ? 'جاري الشحن حالياً' : o.status === 'cancelled' ? 'تم الإلغاء' : 'في الانتظار'}
                          </span>
                        </td>
                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(o.id, 'shipping')}
                                className="bg-blue-50 text-blue-600 px-2 py-1.5 rounded-lg text-[10px] font-black hover:bg-blue-100 transition-colors"
                              >
                                شحن الطلب
                              </button>
                            )}
                            {o.status === 'shipping' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                className="bg-emerald-50 text-emerald-600 px-2 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-colors"
                              >
                                تسليم للمشتري
                              </button>
                            )}
                            {o.status !== 'delivered' && o.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}
                                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Subscription Benefits */}
            <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/20">
              <div className="space-y-3 relative z-10 text-center md:text-right">
                <span className="bg-white/10 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  باقة الشراكة التجارية
                </span>
                <h3 className="text-2xl font-black">عمولات صفر وتدفقات مالية فورية 🚀</h3>
                <p className="text-xs text-indigo-100 font-bold max-w-xl leading-relaxed">
                  بصفتك شريكاً معتمداً، يمكنك عرض منتجاتك الرسمية لآلاف المشترين في 58 ولاية دون أي عمولة خفية وبأفضل لوحة تتبع مبيعات تجارية.
                </p>
              </div>
              <Sparkles size={120} className="absolute left-6 opacity-10 rotate-12" />
            </div>

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border flex flex-col justify-between ${
                store.partnerSubscription === 'free' ? 'border-indigo-600 ring-4 ring-indigo-600/5' : 'border-dz-border dark:border-gray-800'
              } card-shadow`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">الخطة الأساسية</span>
                  <h4 className="text-xl font-black text-dz-text dark:text-white">الشريك العادي (Free)</h4>
                  <div className="text-3xl font-black text-dz-text dark:text-white mb-2">0 دج <span className="text-xs font-bold text-gray-400">/ شهرياً</span></div>
                  
                  <ul className="space-y-3.5 text-xs text-gray-500 font-bold border-t pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> عرض حتى 5 منتجات
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> لوحة تحكم وإدارة طلبات
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <XCircle size={14} className="text-gray-300" /> عمولات مخفضة للبيع
                    </li>
                  </ul>
                </div>
                {store.partnerSubscription === 'free' ? (
                  <button disabled className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl font-black text-xs mt-6 cursor-not-allowed">خطة متجرك الحالية</button>
                ) : (
                  <button onClick={() => handleUpgradeSubscription('free')} className="w-full py-3.5 border-2 hover:bg-gray-50 rounded-2xl font-black text-xs mt-6 text-dz-text dark:text-white transition-colors">تحويل للخطة المجانية</button>
                )}
              </div>

              {/* Pro Plan */}
              <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border flex flex-col justify-between relative ${
                store.partnerSubscription === 'pro' ? 'border-indigo-600 ring-4 ring-indigo-600/5' : 'border-dz-border dark:border-gray-800'
              } card-shadow`}>
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full">الأكثر شعبية</div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">النمو والإنتاج</span>
                  <h4 className="text-xl font-black text-dz-text dark:text-white">الشريك المحترف (Pro)</h4>
                  <div className="text-3xl font-black text-dz-text dark:text-white mb-2">4,500 دج <span className="text-xs font-bold text-gray-400">/ شهرياً</span></div>
                  
                  <ul className="space-y-3.5 text-xs text-gray-500 font-bold border-t pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> عرض منتجات غير محدود
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> عمولة مبيعات 0% بالمنصة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> شارة "شريك معتمد" بارزة للمشترين
                    </li>
                  </ul>
                </div>
                {store.partnerSubscription === 'pro' ? (
                  <button disabled className="w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs mt-6 cursor-not-allowed">خطة متجرك الحالية</button>
                ) : (
                  <button onClick={() => handleUpgradeSubscription('pro')} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs mt-6 transition-colors shadow-lg shadow-indigo-500/10">الترقية الآن</button>
                )}
              </div>

              {/* Enterprise Plan */}
              <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border flex flex-col justify-between ${
                store.partnerSubscription === 'enterprise' ? 'border-indigo-600 ring-4 ring-indigo-600/5' : 'border-dz-border dark:border-gray-800'
              } card-shadow`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">المستوى المؤسساتي</span>
                  <h4 className="text-xl font-black text-dz-text dark:text-white">الشريك المؤسساتي</h4>
                  <div className="text-3xl font-black text-dz-text dark:text-white mb-2">9,000 دج <span className="text-xs font-bold text-gray-400">/ شهرياً</span></div>
                  
                  <ul className="space-y-3.5 text-xs text-gray-500 font-bold border-t pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> كافة ميزات الباقة الاحترافية
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> دعم مخصص ذو أولوية فائقة 24/7
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" /> إعلانات ومتاجر معززة بالصفحة الرئيسية
                    </li>
                  </ul>
                </div>
                {store.partnerSubscription === 'enterprise' ? (
                  <button disabled className="w-full py-3.5 bg-purple-50 text-purple-600 rounded-2xl font-black text-xs mt-6 cursor-not-allowed">خطة متجرك الحالية</button>
                ) : (
                  <button onClick={() => handleUpgradeSubscription('enterprise')} className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs mt-6 transition-colors shadow-lg shadow-purple-500/10">الترقية للمؤسساتية</button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-dz-border dark:border-gray-800 card-shadow">
            <h3 className="font-black text-sm text-dz-text dark:text-white mb-6 flex items-center gap-2 border-b pb-4 dark:border-gray-800">
              <Building2 size={18} className="text-indigo-600" /> تعديل وتحديث بيانات ومعلومات شريكنا التجاري
            </h3>

            {profileSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-xs font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <p>{profileSuccess}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">اسم المتجر / الشركة الرسمي:</label>
                  <input 
                    type="text" 
                    required 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">رابط شعار الشركة:</label>
                  <input 
                    type="url" 
                    value={storeAvatar}
                    onChange={(e) => setStoreAvatar(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">رقم الهاتف للتواصل المباشر:</label>
                  <input 
                    type="tel" 
                    required 
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">البريد الإلكتروني للشركة:</label>
                  <input 
                    type="email" 
                    required 
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500">وصف المتجر ونشاط الأعمال بالتفصيل:</label>
                  <textarea 
                    required
                    rows={3}
                    value={storeBio}
                    onChange={(e) => setStoreBio(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white resize-none" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">مقر الشركة (الولاية):</label>
                  <select
                    value={storeWilaya}
                    onChange={(e) => setStoreWilaya(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white"
                  >
                    {WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Social Channels fields */}
              <div className="border-t pt-6 space-y-4">
                <span className="block text-xs font-black text-dz-text dark:text-white">قنوات التسويق الإلكتروني وشبكات التواصل</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500">رابط فيسبوك:</label>
                    <input 
                      type="text" 
                      placeholder="https://facebook.com/yourpage" 
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500">رابط إنستغرام:</label>
                    <input 
                      type="text" 
                      placeholder="https://instagram.com/yourprofile" 
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500">موقع ويب الشريك الرسمي:</label>
                    <input 
                      type="text" 
                      placeholder="https://www.yourcompany.com" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                <Save size={16} /> حفظ كافة التغييرات والبيانات
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Add Product Modal (Exquisite Layout) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-lg p-8 border dark:border-gray-800 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <XCircle size={22} />
            </button>

            <h3 className="text-lg font-black text-dz-text dark:text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" /> إضافة منتج جديد للكتالوج الرسمي
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500">اسم السلعة / المنتج:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="مثال: شاشة كوندور 55 بوصة" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">السعر الفعلي (دج):</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="مثال: 58000" 
                    value={newProdPrice || ''}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">السعر القديم قبل الخصم (اختياري):</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 65000" 
                    value={newProdOldPrice || ''}
                    onChange={(e) => setNewProdOldPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">تصنيف المنتج:</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white"
                  >
                    <option value="electronics">إلكترونيات</option>
                    <option value="phones">هواتف واكسسوارات</option>
                    <option value="fashion">أزياء وملابس</option>
                    <option value="home">مستلزمات منزلية</option>
                    <option value="services">خدمات عامة</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500">سياسة الإرجاع لدى البائع:</label>
                  <select
                    value={newProdReturnPolicy}
                    onChange={(e) => setNewProdReturnPolicy(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white"
                  >
                    <option value="none">لا يقبل الإرجاع</option>
                    <option value="7days">إرجاع خلال 7 أيام</option>
                    <option value="14days">إرجاع خلال 14 يوم</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500">رابط صورة المنتج (Unsplash أو رابط خارجي):</label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://images.unsplash.com/... أو رابط الصورة" 
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white text-left" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500">وصف دقيق للمنتج ومميزاته:</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="اكتب مواصفات السلعة، الملحقات، وحالة الضمان..." 
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-dz-text dark:text-white resize-none" 
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/15 transition-all flex items-center justify-center gap-2 mt-2">
                <Plus size={16} /> إضافة المنتج نهائياً للبيع
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerStoreDashboard;
