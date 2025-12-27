
import React from 'react';
import { Star, Truck, ShieldCheck, MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product, scrollToComments?: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenDetail }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl card-shadow border border-dz-border dark:border-gray-800 group flex flex-col h-full transition-all hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer rounded-t-2xl" onClick={() => onOpenDetail(product)}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {product.isVerified && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
            <ShieldCheck size={16} />
          </div>
        )}
        {product.isFastDelivery && (
          <div className="absolute bottom-3 right-3 bg-dz-green text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
            <Truck size={12} /> شحن سريع
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-dz-green bg-dz-green/10 px-2 py-0.5 rounded">
            {product.sellerName}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
        </div>

        <h4 className="font-bold text-dz-text dark:text-gray-100 mb-2 line-clamp-1 cursor-pointer hover:text-dz-green" onClick={() => onOpenDetail(product)}>
          {product.name}
        </h4>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="text-lg font-extrabold text-dz-green">
            {product.price.toLocaleString()} دج
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAddToCart(product)} className="bg-dz-orange text-white p-2.5 rounded-xl shadow-lg transition-all active:scale-90">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
