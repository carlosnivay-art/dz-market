
import React from 'react';
import { Bell, Package, Star, X, Info, ShieldAlert } from 'lucide-react';

interface NotificationScreenProps {
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'تنبيه أمان الحساب 🛡️',
    desc: 'تم تسجيل دخول جديد إلى حسابك من جهاز غير معروف في "وهران".',
    time: 'منذ ساعة',
    type: 'security',
    icon: <ShieldAlert className="text-dz-orange" />
  },
  {
    id: 2,
    title: 'تقييم ممتاز ⭐',
    desc: 'شكراً لك! لقد حصلت على 10 نقاط إضافية مقابل تقييمك لمنتج "سماعات برو".',
    time: 'منذ 3 ساعات',
    type: 'review',
    icon: <Star className="text-yellow-500" />
  },
  {
    id: 3,
    title: 'عرض محدود! 🎁',
    desc: 'احصل على شحن مجاني لأول 3 طلبيات باستخدام كود "DZ_FREE".',
    time: 'منذ 5 ساعات',
    type: 'promo',
    icon: <Info className="text-blue-500" />
  }
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 flex flex-col font-['Cairo'] animate-in slide-in-from-left duration-300">
      <div className="bg-white p-6 flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-dz-orange/10 p-2 rounded-xl text-dz-orange">
            <Bell size={24} />
          </div>
          <h2 className="text-xl font-black text-gray-800">الإشعارات</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MOCK_NOTIFICATIONS.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4 hover:border-dz-green transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-gray-800 text-sm">{n.title}</h3>
                <span className="text-[10px] text-gray-400 font-bold">{n.time}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border-t text-center">
        <button className="text-dz-green font-bold text-sm hover:underline">علامة قراءة الكل</button>
      </div>
    </div>
  );
};

export default NotificationScreen;
