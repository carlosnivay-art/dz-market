
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Plus, Package, TrendingUp, Users, DollarSign, Edit, Trash2, Share2, Camera, Link as LinkIcon 
} from 'lucide-react';
import { SalesData } from '../types';

const mockSalesData: SalesData[] = [
  { month: 'جانفي', sales: 45000, orders: 12 },
  { month: 'فيفري', sales: 52000, orders: 15 },
  { month: 'مارس', sales: 48000, orders: 14 },
  { month: 'أفريل', sales: 61000, orders: 18 },
  { month: 'ماي', sales: 55000, orders: 16 },
  { month: 'جوان', sales: 67000, orders: 20 },
];

const MerchantDashboard: React.FC = () => {
  const sellerId = "dz_market_seller_2024";
  const profileLink = `https://dz-market.dz/shop/${sellerId}`;

  const [newProduct, setNewProduct] = useState({ name: '', price: '', desc: '' });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Welcome & Profile Share */}
      <div className="bg-dz-green p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2">لوحة تحكم المتجر 🏬</h2>
          <p className="opacity-80 mb-6">إدارة المبيعات، المنتجات والرد الآلي في مكان واحد.</p>
          
          <div className="bg-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20">
            <div className="flex items-center gap-3">
              <LinkIcon size={20} className="text-dz-orange" />
              <span className="text-sm font-medium truncate max-w-[200px]">{profileLink}</span>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(profileLink);
                alert("تم نسخ رابط متجرك! شاركه الآن.");
              }}
              className="bg-white text-dz-green px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-dz-orange hover:text-white transition-all shadow-lg"
            >
              <Share2 size={18} /> مشاركة المتجر
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-dz-orange/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-dz-orange" /> إضافة منتج جديد
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-dz-green hover:bg-dz-green/5 transition-all">
                <Camera size={32} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">اسحب صور المنتج هنا</p>
              </div>
              <input 
                type="text" 
                placeholder="اسم المنتج" 
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-dz-green"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="السعر (دج)" 
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-dz-green"
                />
                <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-dz-green">
                  <option>الفئة</option>
                  <option>إلكترونيات</option>
                  <option>أزياء</option>
                </select>
              </div>
              <textarea 
                placeholder="وصف المنتج (المواصفات)" 
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-dz-green h-24"
              ></textarea>
              <button className="w-full bg-dz-green text-white font-bold py-3 rounded-xl hover:bg-dz-green/90 transition-all shadow-lg shadow-dz-green/20">
                حفظ ونشر المنتج
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <DollarSign className="text-dz-green" />
                <span className="text-[10px] text-green-500 font-bold">+5%</span>
              </div>
              <p className="text-xs text-gray-500">مبيعات اليوم</p>
              <p className="text-xl font-black">12,500 دج</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Users className="text-dz-orange" />
                <span className="text-[10px] text-orange-500 font-bold">+12%</span>
              </div>
              <p className="text-xs text-gray-500">زوار المتجر</p>
              <p className="text-xl font-black">842</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm hidden sm:block">
              <div className="flex justify-between items-start mb-2">
                <TrendingUp className="text-blue-500" />
                <span className="text-[10px] text-blue-500 font-bold">مستقر</span>
              </div>
              <p className="text-xs text-gray-500">التقييم العام</p>
              <p className="text-xl font-black">4.8/5</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border h-[300px]">
             <h3 className="font-bold mb-4">إحصائيات المبيعات</h3>
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="sales" fill="#1E6B52" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
