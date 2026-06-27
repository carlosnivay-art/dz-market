import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, ShieldAlert, BarChart3, Trash2, Check, X, 
  Store, ShoppingBag, Eye, Star, AlertTriangle, RefreshCw, ChevronLeft, Truck, Award
} from 'lucide-react';
import { db } from '../services/db';
import { User, Product, Report, VerificationRequest } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'verifications' | 'reports' | 'delivery_offices' | 'partner_stores'>('stats');
  const [stats, setStats] = useState(db.getStats());
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(db.getVerificationRequests());
  const [reports, setReports] = useState<Report[]>(db.getReports());
  const [products, setProducts] = useState<Product[]>(db.getProducts());

  // Reload all data
  const reloadData = () => {
    setStats(db.getStats());
    setUsers(db.getUsers());
    setVerifications(db.getVerificationRequests());
    setReports(db.getReports());
    setProducts(db.getProducts());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleApproveVerification = (id: string) => {
    db.updateVerificationStatus(id, 'approved');
    reloadData();
  };

  const handleRejectVerification = (id: string) => {
    db.updateVerificationStatus(id, 'rejected');
    reloadData();
  };

  const handleDismissReport = (id: string) => {
    db.updateReportStatus(id, 'dismissed');
    reloadData();
  };

  const handleDeleteOffendingProduct = (reportId: string, productId: string) => {
    db.deleteProduct(productId);
    db.updateReportStatus(reportId, 'resolved');
    reloadData();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم وجميع سلعته نهائياً؟')) {
      db.deleteUser(id);
      reloadData();
    }
  };

  const handleToggleUserRole = (id: string, currentRole: 'buyer' | 'seller' | 'admin') => {
    const newRole = currentRole === 'buyer' ? 'seller' : 'buyer';
    db.updateUser(id, { role: newRole });
    reloadData();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-gray-50 dark:bg-gray-950 flex flex-col font-['Cairo'] overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-700 dark:text-gray-300">
             <ChevronLeft size={24} className="rotate-180" />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              لوحة تحكم المشرف 🛡️ <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-bold">مسؤول النظام</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-bold">تسيير وضبط جودة DZ MARKET بالكامل</p>
          </div>
        </div>
        <button 
          onClick={reloadData} 
          className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-dz-green/10 hover:text-dz-green dark:text-gray-300 rounded-xl transition-all"
          title="تحديث البيانات"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-l dark:border-gray-800 p-4 space-y-2 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:gap-0">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'stats' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <BarChart3 size={18} /> الإحصائيات العامة
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'users' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Users size={18} /> إدارة المستخدمين
            <span className="mr-auto text-[10px] bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{users.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('verifications')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'verifications' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <ShieldCheck size={18} /> طلبات التوثيق
            {stats.pendingVerifications > 0 && (
              <span className="mr-auto text-[10px] bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">{stats.pendingVerifications}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'reports' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <ShieldAlert size={18} /> بلاغات الإعلانات
            {stats.pendingReports > 0 && (
              <span className="mr-auto text-[10px] bg-red-500 text-white px-2.5 py-0.5 rounded-full font-black">{stats.pendingReports}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('delivery_offices')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'delivery_offices' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Truck size={18} /> مكاتب التوصيل
            {stats.pendingDeliveryOffices > 0 && (
              <span className="mr-auto text-[10px] bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">{stats.pendingDeliveryOffices}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('partner_stores')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 transition-all ${
              activeTab === 'partner_stores' 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/25' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Store size={18} /> المتاجر والشركاء الرسميين
            {(stats.pendingPartnerStores || 0) > 0 && (
              <span className="mr-auto text-[10px] bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">{stats.pendingPartnerStores}</span>
            )}
          </button>
        </div>

        {/* Workspace Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* A. Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 p-2.5 rounded-2xl w-fit">
                    <Users size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold">إجمالي الأعضاء</p>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{stats.totalUsers}</h3>
                  <p className="text-[9px] text-gray-400 font-bold">{stats.totalSellers} بائع | {stats.totalBuyers} مشتري</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 p-2.5 rounded-2xl w-fit">
                    <ShoppingBag size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold">السلع النشطة</p>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{stats.totalProducts}</h3>
                  <p className="text-[9px] text-gray-400 font-bold">إعلانات تسويقية</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-500 p-2.5 rounded-2xl w-fit">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold">باعة موثوقون</p>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{stats.verifiedSellersCount}</h3>
                  <p className="text-[9px] text-amber-500 font-bold">{stats.pendingVerifications} في الانتظار</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 p-2.5 rounded-2xl w-fit">
                    <Truck size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold">مكاتب التوصيل</p>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{stats.totalDeliveryOffices || 0}</h3>
                  <p className="text-[9px] text-purple-500 font-bold">{stats.pendingDeliveryOffices || 0} معلقة للموافقة</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-2.5 rounded-2xl w-fit">
                    <ShieldAlert size={18} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-extrabold">بلاغات مرفوعة</p>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{stats.totalReports}</h3>
                  <p className="text-[9px] text-rose-500 font-bold">{stats.pendingReports} غير معالجة</p>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-dz-green/5 dark:bg-dz-green/10 p-6 rounded-[2rem] border border-dz-green/10 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-dz-green text-white p-4 rounded-3xl">
                  <ShieldCheck size={32} />
                </div>
                <div className="text-right flex-1 space-y-1">
                  <h4 className="font-black text-gray-800 dark:text-gray-100">نظام فحص الباعة والأمان الفعّال</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                    بصفتك مسؤول النظام، يمكنك الحفاظ على بيئة DZ MARKET آمنة وموثوقة. قم بمراجعة وتوثيق البائعين الجدد لتمكين شارة "بائع موثوق" لزيادة مصداقيتهم، وتدخل سريعاً لحذف أي إعلان تم التبليغ عنه ويخالف قوانين البيع في الجزائر.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* B. Users Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-base font-black text-gray-800 dark:text-white mb-4">إدارة أعضاء DZ MARKET ({users.length})</h3>
              
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-11 h-11 rounded-xl object-cover bg-gray-50 dark:bg-gray-800 border" alt="U" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-gray-800 dark:text-white text-xs md:text-sm">{u.name}</h4>
                          {u.isVerified && (
                            <span className="bg-dz-green/10 text-dz-green p-0.5 rounded-full" title="موثق">
                              <ShieldCheck size={12} fill="currentColor" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold leading-none">{u.email || 'لا يوجد بريد'} | {u.phone}</p>
                        <p className="text-[9px] text-gray-400 font-bold">تاريخ الانضمام: {u.joinedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <div className="flex flex-col items-end mr-4">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-rose-100 text-rose-700' 
                            : u.role === 'seller' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? 'مدير' : u.role === 'seller' ? 'بائع' : 'مشتري'}
                        </span>
                      </div>

                      {u.role !== 'admin' && (
                        <>
                          <button 
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            className="text-[10px] font-bold px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-dz-green hover:text-white rounded-xl transition-all"
                          >
                            تحويل إلى {u.role === 'buyer' ? 'بائع' : 'مشتري'}
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                            title="حذف الحساب نهائياً"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. Verification Requests Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-base font-black text-gray-800 dark:text-white mb-4">طلبات توثيق حسابات البائعين</h3>

              {verifications.length > 0 ? (
                <div className="space-y-3">
                  {verifications.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-800 dark:text-white text-sm">{req.sellerName}</h4>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                            req.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : req.status === 'rejected' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}>
                            {req.status === 'approved' ? 'مقبول وموثق' : req.status === 'rejected' ? 'مرفوض' : 'في الانتظار'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                          <p className="text-gray-500"><span className="font-black text-gray-700 dark:text-gray-300">الاسم التجاري:</span> {req.businessName}</p>
                          <p className="text-gray-500"><span className="font-black text-gray-700 dark:text-gray-300">رقم الهاتف:</span> {req.phone}</p>
                          <p className="text-gray-400 text-[10px] mt-1">تاريخ الطلب: {new Date(req.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                          <button 
                            onClick={() => handleApproveVerification(req.id)}
                            className="bg-dz-green text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                          >
                            <Check size={14} /> قبول التوثيق
                          </button>
                          <button 
                            onClick={() => handleRejectVerification(req.id)}
                            className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <X size={14} /> رفض
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 opacity-60">
                  <ShieldCheck size={48} className="mx-auto mb-3 text-dz-green" />
                  <p className="font-black text-sm">لا توجد طلبات توثيق حالياً</p>
                </div>
              )}
            </div>
          )}

          {/* D. Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-base font-black text-gray-800 dark:text-white mb-4">مراجعة بلاغات الإعلانات والسلع</h3>

              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div key={rep.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                              <AlertTriangle size={16} />
                            </span>
                            <h4 className="font-black text-gray-800 dark:text-white text-xs md:text-sm">بلاغ عن: {rep.productName}</h4>
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold">المبلغ: {rep.reporterName} | حالة البلاغ: 
                            <span className={`mr-1 font-extrabold ${rep.status === 'pending' ? 'text-amber-500 animate-pulse' : rep.status === 'resolved' ? 'text-dz-green' : 'text-gray-400'}`}>
                              {rep.status === 'pending' ? ' قيد الانتظار' : rep.status === 'resolved' ? ' تم حظر المنتج' : ' تم تجاهل البلاغ'}
                            </span>
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{new Date(rep.timestamp).toLocaleDateString()}</span>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p className="font-black text-gray-700 dark:text-gray-200 mb-1">سبب البلاغ: 
                          <span className="text-red-500 mr-1">
                            {rep.reason === 'fake_product' ? 'منتج مزيف/مقلد' : rep.reason === 'inappropriate' ? 'محتوى غير لائق' : rep.reason === 'scam' ? 'احتيال/نصب' : 'سبب آخر'}
                          </span>
                        </p>
                        <p>{rep.reasonText || 'لا يوجد تفصيل إضافي.'}</p>
                      </div>

                      {rep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <button 
                            onClick={() => handleDeleteOffendingProduct(rep.id, rep.productId)}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 hover:bg-red-600 transition-all"
                          >
                            <Trash2 size={14} /> حذف الإعلان المخالف
                          </button>
                          <button 
                            onClick={() => handleDismissReport(rep.id)}
                            className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 hover:bg-gray-200 transition-all"
                          >
                            <Check size={14} /> تجاهل وتصفية البلاغ
                          </button>
                        </div>
                      ) : (
                        <div className="text-left text-[10px] text-gray-400 font-bold">
                          تمت معالجة البلاغ بنجاح.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 opacity-60">
                  <ShieldAlert size={48} className="mx-auto mb-3 text-dz-green" />
                  <p className="font-black text-sm">سجل البلاغات فارغ وسليم 🌴</p>
                </div>
              )}
            </div>
          )}

          {/* E. Delivery Offices Tab */}
          {activeTab === 'delivery_offices' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-gray-800 dark:text-white">إدارة مكاتب التوصيل المعتمدة وطلبات الانضمام</h3>
                  <p className="text-xs text-gray-400 font-bold">قبول أو رفض مكاتب التوصيل وإدارة خطط الاشتراكات</p>
                </div>
              </div>

              {/* 1. Pending Offices */}
              <div className="space-y-4">
                <h4 className="font-black text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-4 py-2 rounded-xl w-fit flex items-center gap-1.5">
                  <AlertTriangle size={14} /> طلبات التسجيل الجديدة قيد المراجعة ({users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'pending').length})
                </h4>

                {users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'pending').length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'pending').map((office) => (
                      <div key={office.id} className="bg-amber-50/40 dark:bg-amber-950/10 p-5 rounded-[2rem] border border-amber-200/50 dark:border-amber-900/30 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={office.avatar} className="w-12 h-12 rounded-2xl object-cover bg-white border border-amber-200 animate-pulse" alt="Office Avatar" />
                            <div>
                              <h4 className="font-black text-gray-800 dark:text-white text-sm">{office.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold leading-none mt-1">الرقم: {office.phone} | البريد: {office.email || 'لا يوجد'}</p>
                              <p className="text-[10px] text-amber-600 font-bold mt-1">الولاية الرئيسية: {office.wilaya}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button 
                              onClick={() => {
                                db.approveDeliveryOffice(office.id);
                                reloadData();
                              }}
                              className="bg-dz-green text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <Check size={14} /> قبول واعتماد المكتب
                            </button>
                            <button 
                              onClick={() => {
                                db.rejectDeliveryOffice(office.id);
                                reloadData();
                              }}
                              className="bg-white hover:bg-red-50 hover:text-red-500 border border-red-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <X size={14} /> رفض الطلب
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white dark:bg-gray-900 p-4 rounded-2xl border">
                          <div>
                            <span className="font-black text-gray-700 dark:text-gray-300 block mb-1">الولايات المغطاة بالتوصيل:</span>
                            <div className="flex flex-wrap gap-1">
                              {office.coveredWilayas?.map(w => (
                                <span key={w} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300">{w}</span>
                              )) || <span className="text-gray-400">لا يوجد</span>}
                            </div>
                          </div>
                          <div>
                            <span className="font-black text-gray-700 dark:text-gray-300 block mb-1">أسعار التوصيل المقترحة:</span>
                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{office.deliveryPrices || 'لم يتم تسجيل أسعار.'}</p>
                          </div>
                          <div className="md:col-span-2 border-t pt-2 mt-1">
                            <span className="font-black text-gray-700 dark:text-gray-300 block mb-1">وصف الخدمة والمميزات:</span>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">"{office.bio}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic bg-white dark:bg-gray-900 p-4 rounded-2xl text-center">لا توجد طلبات انضمام جديدة معلقة حالياً.</p>
                )}
              </div>

              {/* 2. Active Offices and Subscriptions */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-black text-xs text-dz-green bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl w-fit flex items-center gap-1.5">
                  <ShieldCheck size={14} /> مكاتب التوصيل النشطة والمعتمدة ({users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'approved').length})
                </h4>

                {users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'approved').length > 0 ? (
                  <div className="space-y-3">
                    {users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'approved').map((office) => (
                      <div key={office.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={office.avatar} className="w-11 h-11 rounded-xl object-cover bg-gray-50 border" alt="Office" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-black text-gray-800 dark:text-white text-sm">{office.name}</h4>
                                {office.subscriptionPlan === 'premium' && (
                                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> موصى به / مميز
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold leading-none mt-1">{office.phone} | المقر: {office.wilaya}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="text-[10px] text-gray-400 font-black ml-2">إدارة خطة الاشتراك:</span>
                            {office.subscriptionPlan === 'premium' ? (
                              <button 
                                onClick={() => {
                                  db.updateDeliveryOfficeSubscription(office.id, 'free');
                                  reloadData();
                                }}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-xl text-[10px] font-black active:scale-95 transition-all"
                              >
                                تحويل للخطة المجانية
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  db.updateDeliveryOfficeSubscription(office.id, 'premium');
                                  reloadData();
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-md shadow-amber-500/10 active:scale-95 transition-all"
                              >
                                ترقية إلى بريميوم 🌟
                              </button>
                            )}

                            <button 
                              onClick={() => handleDeleteUser(office.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                              title="حذف هذا المكتب"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] pt-2 border-t text-gray-500 font-semibold">
                          <p><span className="font-bold text-gray-700 dark:text-gray-300">الخطة الحالية:</span> {office.subscriptionPlan === 'premium' ? 'مميز (شهري)' : 'مجاني'}</p>
                          <p><span className="font-bold text-gray-700 dark:text-gray-300">الولايات المغطاة:</span> {office.coveredWilayas?.length || 0} ولاية</p>
                          <p><span className="font-bold text-gray-700 dark:text-gray-300">عدد الطلبات المنجزة:</span> {office.ordersCount || 0}</p>
                          <p className="flex items-center gap-1"><span className="font-bold text-gray-700 dark:text-gray-300">التقييم:</span> <span className="text-amber-500 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {office.rating || '5.0'}</span> ({office.reviewsCount || 0} تعليق)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic bg-white dark:bg-gray-900 p-4 rounded-2xl text-center">لا توجد مكاتب توصيل نشطة حالياً.</p>
                )}
              </div>
            </div>
          )}

          {/* F. Commercial Partner Stores Tab */}
          {activeTab === 'partner_stores' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-black text-gray-800 dark:text-white">إدارة الشركاء التجاريين والمتاجر الرسمية</h3>
                <p className="text-xs text-gray-400 font-bold">مراجعة طلبات الشركات والمتاجر والتحكم بشارة التحقق الرسمية</p>
              </div>

              {/* 1. Pending Stores */}
              <div className="space-y-4">
                <h4 className="font-black text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-4 py-2 rounded-xl w-fit flex items-center gap-1.5">
                  <AlertTriangle size={14} /> طلبات انضمام الشركات قيد المراجعة ({users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'pending').length})
                </h4>

                {users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'pending').length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'pending').map((store) => (
                      <div key={store.id} className="bg-indigo-50/20 dark:bg-indigo-950/10 p-5 rounded-[2rem] border border-indigo-200/50 dark:border-indigo-900/30 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={store.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(store.name)}`} className="w-12 h-12 rounded-2xl object-cover bg-white border border-indigo-200" alt="S" />
                            <div>
                              <h4 className="font-black text-gray-800 dark:text-white text-sm">{store.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold leading-none mt-1">الرقم: {store.phone} | البريد: {store.email}</p>
                              <p className="text-[10px] text-indigo-600 font-bold mt-1">المقر: {store.wilaya} | الباقة المطلوبة: <span className="uppercase font-black">{store.partnerSubscription}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button 
                              onClick={() => {
                                db.approvePartnerStore(store.id);
                                reloadData();
                              }}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <Check size={14} /> اعتماد الشريك التجاري
                            </button>
                            <button 
                              onClick={() => {
                                db.rejectPartnerStore(store.id);
                                reloadData();
                              }}
                              className="bg-white hover:bg-red-50 hover:text-red-500 border border-red-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <X size={14} /> رفض الطلب
                            </button>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border text-xs text-gray-500 space-y-2">
                          <p><span className="font-black text-gray-700 dark:text-gray-300">وصف المتجر:</span> "{store.bio}"</p>
                          <div className="flex items-center gap-4 text-[10px] text-gray-400">
                            {store.socialLinks?.website && <span>موقع الويب: {store.socialLinks.website}</span>}
                            {store.socialLinks?.facebook && <span>فيسبوك: {store.socialLinks.facebook}</span>}
                            {store.socialLinks?.instagram && <span>إنستغرام: {store.socialLinks.instagram}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic bg-white dark:bg-gray-900 p-4 rounded-2xl text-center">لا توجد طلبات انضمام معلقة حالياً.</p>
                )}
              </div>

              {/* 2. Approved Stores */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-black text-xs text-dz-green bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl w-fit flex items-center gap-1.5">
                  <ShieldCheck size={14} /> الشركاء التجاريون المعتمدون ({users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'approved').length})
                </h4>

                {users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'approved').length > 0 ? (
                  <div className="space-y-3">
                    {users.filter(u => u.role === 'partner_store' && u.approvalStatus === 'approved').map((store) => (
                      <div key={store.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={store.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(store.name)}`} className="w-11 h-11 rounded-xl object-cover bg-gray-50" alt="S" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-black text-gray-800 dark:text-white text-sm">{store.name}</h4>
                                {store.isOfficialStore && (
                                  <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Award size={10} fill="currentColor" /> متجر رسمي معتمد
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold leading-none mt-1">{store.phone} | المقر: {store.wilaya} | الباقة: <span className="uppercase font-black text-indigo-600">{store.partnerSubscription}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button 
                              onClick={() => {
                                db.toggleOfficialStoreBadge(store.id);
                                reloadData();
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black active:scale-95 transition-all ${
                                store.isOfficialStore 
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              }`}
                            >
                              {store.isOfficialStore ? 'إزالة شارة التحقق' : 'منح شارة متجر رسمي 🛡️'}
                            </button>

                            <select
                              value={store.partnerSubscription || 'free'}
                              onChange={(e) => {
                                db.updatePartnerStoreSubscription(store.id, e.target.value as any);
                                reloadData();
                              }}
                              className="bg-gray-50 dark:bg-gray-800 text-dz-text dark:text-white border-none py-1.5 px-3 rounded-xl text-[10px] font-black outline-none"
                            >
                              <option value="free">باقة مجانية</option>
                              <option value="pro">باقة احترافية</option>
                              <option value="enterprise">باقة مؤسساتية</option>
                            </select>

                            <button 
                              onClick={() => handleDeleteUser(store.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                              title="حذف حساب الشريك"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic bg-white dark:bg-gray-900 p-4 rounded-2xl text-center">لا توجد متاجر رسمية نشطة حالياً.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
