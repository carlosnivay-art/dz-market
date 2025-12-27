
import React, { useState } from 'react';
import { 
  Bell, Package, Star, X, ShieldAlert, Tag, Radio, Zap, ChevronRight, Trash2, CheckCheck, Inbox
} from 'lucide-react';

interface NotificationScreenProps {
  onClose: () => void;
}

type NotificationType = 'all' | 'order' | 'offer' | 'live' | 'discount' | 'security' | 'review';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'تحديث حالة الطلب 🚚',
    desc: 'طلبك رقم #DZ-8842 تم شحنه وهو الآن في الطريق إليك (الجزائر العاصمة).',
    time: 'الآن',
    type: 'order' as NotificationType,
    icon: <Package className="text-blue-500" />,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    read: false
  },
  {
    id: 2,
    title: 'بث مباشر مرتقب 🔴',
    desc: 'سيبدأ "متجر النخلة" بثاً مباشراً لعرض تخفيضات الشتاء بعد قليل. لا تفوت الهدايا!',
    time: 'منذ 5 دقائق',
    type: 'live' as NotificationType,
    icon: <Radio className="text-red-500 animate-pulse" />,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    read: false
  },
  {
    id: 3,
    title: 'خصم فلاش! ⚡',
    desc: 'خصم 40% على جميع الأحذية الرياضية ينتهي خلال 3 ساعات فقط!',
    time: 'منذ ساعة',
    type: 'discount' as NotificationType,
    icon: <Zap className="text-yellow-500" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    read: true
  },
  {
    id: 4,
    title: 'قسيمة شراء لك 🏷️',
    desc: 'مبروك! حصلت على قسيمة خصم بقيمة 1500 دج بمناسبة وفائك لـ DZ Market.',
    time: 'منذ 3 ساعات',
    type: 'offer' as NotificationType,
    icon: <Tag className="text-purple-500" />,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    read: false
  },
  {
    id: 5,
    title: 'تنبيه أمان 🛡️',
    desc: 'تم تغيير كلمة مرور حسابك بنجاح. إذا لم تكن أنت من قام بهذا، اتصل بنا فوراً.',
    time: 'منذ 8 ساعات',
    type: 'security' as NotificationType,
    icon: <ShieldAlert className="text-dz-orange" />,
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    read: true
  },
  {
    id: 6,
    title: 'تقييم منتج ⭐',
    desc: 'كيف كانت تجربتك مع "سماعات برو"؟ شاركنا رأيك واكسب نقاط مكافأة.',
    time: 'أمس',
    type: 'review' as NotificationType,
    icon: <Star className="text-yellow-600" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
    read: true
  }
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'order', label: 'الطلبات' },
    { id: 'offer', label: 'العروض' },
    { id: 'live', label: 'Live' },
    { id: 'discount', label: 'الخصومات' }
  ];

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 dark:bg-gray-950 flex flex-col font-['Cairo'] animate-in slide-in-from-left duration-300 transition-colors" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 flex items-center justify-between border-b dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-dz-orange/10 p-2 rounded-xl text-dz-orange">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white">الإشعارات</h2>
            <p className="text-[10px] font-bold text-gray-400">لديك {notifications.filter(n => !n.read).length} إشعارات غير مقروءة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllAsRead}
            className="p-2 text-dz-green hover:bg-dz-green/5 rounded-xl transition-all"
            title="تحديد الكل كمقروء"
          >
            <CheckCheck size={20} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all dark:text-white">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex gap-2 overflow-x-auto border-b dark:border-gray-800 scrollbar-hide">
        {filters.map((filter) => (
          <button 
            key={filter.id} 
            onClick={() => setActiveFilter(filter.id as NotificationType)}
            className={`px-6 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 ${
              activeFilter === filter.id 
                ? 'bg-dz-green text-white shadow-lg shadow-dz-green/20 scale-105' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              className={`bg-white dark:bg-gray-900 p-5 rounded-[2rem] shadow-sm border transition-all group cursor-pointer relative overflow-hidden ${
                n.read ? 'border-gray-100 dark:border-gray-800 opacity-80' : 'border-dz-green/30 dark:border-dz-green/20 bg-dz-green/[0.02]'
              }`}
            >
              {!n.read && <div className="absolute top-0 right-0 w-1.5 h-full bg-dz-green"></div>}
              
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl ${n.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
                  {React.cloneElement(n.icon as React.ReactElement, { size: 28 })}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm truncate">{n.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold whitespace-nowrap">{n.time}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{n.desc}</p>
                  
                  {/* Action Buttons based on type */}
                  <div className="mt-4 flex gap-2">
                    {n.type === 'order' && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Package size={14} /> تتبع الطلبية
                      </button>
                    )}
                    {n.type === 'live' && (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md hover:bg-red-700 transition-all flex items-center gap-2 animate-pulse">
                        <Radio size={14} /> انضم للبث الآن
                      </button>
                    )}
                    {n.type === 'discount' && (
                      <button className="bg-dz-orange text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md hover:bg-orange-600 transition-all flex items-center gap-2">
                        <Zap size={14} /> استغل الخصم
                      </button>
                    )}
                    {n.type === 'offer' && (
                      <button className="border-2 border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-purple-50 transition-all">
                        تفعيل القسيمة
                      </button>
                    )}
                    <button className="text-[10px] font-black text-gray-400 dark:text-gray-500 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                      تجاهل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <Inbox size={48} className="text-gray-400" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 dark:text-gray-200">لا توجد إشعارات</h3>
              <p className="text-xs text-gray-400">الإشعارات من فئة "{filters.find(f => f.id === activeFilter)?.label}" ستظهر هنا فور وصولها.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Settings Link */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex justify-between items-center">
        <button className="text-dz-green dark:text-dz-green/80 font-black text-xs hover:underline transition-all">
          إعدادات الإشعارات
        </button>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-dz-green"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;
