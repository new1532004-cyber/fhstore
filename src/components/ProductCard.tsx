import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useStore();
  const { t } = useLanguage();
  
  const handleOrderNow = () => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    dispatch({ type: 'SET_VIEW', payload: 'order' });
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 hover:border-pink-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={handleOrderNow}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 text-base line-clamp-2 font-arabic">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-arabic">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-pink-600">
              {product.price} {t('da')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice} {t('da')}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleOrderNow}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold transition-colors font-arabic"
        >
          {t('products.order')}
        </button>
      </div>
    </div>
  );
}