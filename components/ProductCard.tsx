
import React from 'react';
import { Star, Truck, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product, scrollToComments?: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenDetail }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-dz-border dark:border-gray-800 group flex flex-col h-full transition-all active:scale-95 hover:shadow-md">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        
        {/* Badges - Smaller & Minimal */}
        {product.isFastDelivery && (
          <div className="absolute bottom-1 right-1 bg-dz-green/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-lg text-[8px] font-black flex items-center gap-0.5 shadow-sm">
            <Truck size={8} /> 24h
          </div>
        )}
        
        {product.isVerified && (
          <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm">
            <ShieldCheck size={10} />
          </div>
        )}
      </div>

      {/* Content Area - Compact Padding */}
      <div className="p-2 flex-1 flex flex-col">
        <h4 className="text-[11px] font-bold text-dz-text dark:text-gray-100 mb-1 line-clamp-2 leading-tight h-8 cursor-pointer" onClick={() => onOpenDetail(product)}>
          {product.name}
        </h4>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 text-yellow-500">
            <Star size={10} fill="currentColor" />
            <span className="text-[9px] font-black">{product.rating}</span>
          </div>
          <span className="text-[8px] text-gray-400 font-bold">({product.reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black text-dz-green leading-none">
              {product.price.toLocaleString()} <span className="text-[8px]">دج</span>
            </span>
            {product.oldPrice && (
              <span className="text-[9px] text-gray-400 line-through">
                {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
            className="bg-dz-orange text-white p-1.5 rounded-lg shadow-sm active:scale-90 transition-transform"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
