import React from "react";
import ProductCard from "./ProductCard";
import { useStore } from "../contexts/StoreContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProductGrid() {
  const { state } = useStore();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white pt-28 pb-8">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-pink-600 mb-4 font-arabic">
            {t("products.title")}
          </h2>
        </div>

        {/* Product Grid */}
        {state.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-pink-600 text-xl font-arabic">لا توجد منتجات حالياً</p>
            <p className="text-pink-400 text-sm font-arabic mt-2">يمكن للمدير إضافة منتجات من لوحة الإدارة</p>
          </div>
        )}
      </div>
    </div>
  );
}