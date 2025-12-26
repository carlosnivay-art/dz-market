
import React from 'react';
import { Star, Truck, ShieldCheck, MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenDetail }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isVerified && (
            <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
              <ShieldCheck size={16} />
            </div>
          )}
        </div>
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

        <h4 className="font-bold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-dz-green" onClick={() => onOpenDetail(product)}>
          {product.name}
        </h4>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <div className="text-lg font-extrabold text-dz-green">
              {product.price.toLocaleString()} دج
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onOpenDetail(product)}
              className="text-gray-400 hover:text-dz-green p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <MessageCircle size={20} />
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-dz-orange hover:bg-orange-600 text-white p-2 rounded-xl shadow-lg transition-all active:scale-90"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
