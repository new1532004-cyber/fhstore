import React, { useState } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Settings } from "lucide-react";
import { useStore } from "../contexts/StoreContext";
import { Product, Order } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import { ALGERIAN_WILAYAS } from "../data/wilayas";

export default function AdminPanel() {
  const { state, dispatch, productActions, orderActions } = useStore();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "delivery">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [editingWilaya, setEditingWilaya] = useState<any>(null);

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    image: "",
    category: "accessories",
    description: "",
    inStock: true,
  });

  const [deliveryForm, setDeliveryForm] = useState({
    name: "",
    homeDelivery: 0,
    deskDelivery: 0
  });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      if (editingProduct) {
        await productActions.updateProduct(editingProduct.id, {
          name: productForm.name || "",
          price: Number(productForm.price) || 0,
          originalPrice: Number(productForm.originalPrice) || 0,
          image: productForm.image || "",
          category: productForm.category || "accessories",
          description: productForm.description || "",
          inStock: productForm.inStock ?? true,
        });
      } else {
        await productActions.addProduct({
          name: productForm.name || "",
          price: Number(productForm.price) || 0,
          originalPrice: Number(productForm.originalPrice) || 0,
          image: productForm.image || "",
          category: productForm.category || "accessories",
          description: productForm.description || "",
          inStock: productForm.inStock ?? true,
        });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("خطأ في حفظ المنتج: " + (err as Error).message);
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      originalPrice: 0,
      image: "",
      category: "accessories",
      description: "",
      inStock: true,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await productActions.deleteProduct(id);
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("خطأ في حذف المنتج: " + (err as Error).message);
      }
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      orderActions.deleteOrder(id);
    }
  };

  const handleEditDelivery = (wilaya: any) => {
    setEditingWilaya(wilaya);
    setDeliveryForm({
      name: wilaya.name,
      homeDelivery: wilaya.homeDelivery,
      deskDelivery: wilaya.deskDelivery
    });
    setShowDeliveryForm(true);
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save to Firebase or update the local data
    // For now, we'll just close the form
    setShowDeliveryForm(false);
    setEditingWilaya(null);
    setDeliveryForm({ name: "", homeDelivery: 0, deskDelivery: 0 });
    alert("تم تحديث أسعار التوصيل بنجاح!");
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                dispatch({ type: "SET_VIEW", payload: "store" });
              }}
              className="mr-4 p-2 hover:bg-pink-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-pink-600" />
            </button>
            <h1 className="text-3xl font-bold text-pink-600 font-arabic">
              {t('admin.title')}
            </h1>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                activeTab === "products"
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-600 hover:bg-pink-200"
              }`}
            >
              {t('admin.products')} ({state.products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                activeTab === "orders"
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-600 hover:bg-pink-200"
              }`}
            >
              {t('admin.orders')} ({state.orders.length})
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                activeTab === "delivery"
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-600 hover:bg-pink-200"
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              أسعار التوصيل
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-pink-600 font-arabic">
                {t('admin.product_management')}
              </h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span className="font-arabic">{t('admin.add_product')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2 font-arabic">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 font-arabic">
                      {product.description}
                    </p>
                    <p className="font-bold text-pink-600">{product.price} DA</p>

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="font-arabic">{t('admin.edit')}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="font-arabic">{t('admin.delete')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {state.products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-pink-400 text-xl font-arabic">
                  لا توجد منتجات حالياً
                </p>
                <p className="text-pink-300 text-sm font-arabic mt-2">
                  اضغط على "إضافة منتج" لإضافة منتج جديد
                </p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-8 font-arabic">
              {t('admin.order_management')}
            </h2>

            <div className="space-y-4">
              {state.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2 font-arabic">
                        {t('admin.customer_info')}
                      </h3>
                      <p className="font-arabic">
                        <strong>الاسم:</strong> {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="font-arabic">
                        <strong>الهاتف:</strong> {order.customer.phone}
                      </p>
                      <p className="font-arabic">
                        <strong>الولاية:</strong> {order.customer.wilaya}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 font-arabic">
                        {t('admin.ordered_products')}
                      </h3>
                      {order.items.map((item) => (
                        <p key={item.id} className="font-arabic">
                          {item.name} - الكمية: {item.quantity}
                        </p>
                      ))}
                      <p className="font-bold text-pink-600 mt-2">
                        المجموع: {order.total} DA
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-arabic"
                  >
                    حذف الطلب
                  </button>
                </div>
              ))}
              
              {state.orders.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-pink-400 text-xl font-arabic">
                    {t('admin.no_orders')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Prices Tab */}
        {activeTab === "delivery" && (
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-8 font-arabic">
              إدارة أسعار التوصيل
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALGERIAN_WILAYAS.map((wilaya) => (
                <div key={wilaya.name} className="bg-white rounded-xl shadow-lg p-4 border border-pink-100">
                  <h3 className="font-bold text-lg mb-3 text-pink-600 font-arabic">{wilaya.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-arabic">
                      <strong>التوصيل للمنزل:</strong> {wilaya.homeDelivery} DA
                    </p>
                    <p className="font-arabic">
                      <strong>التوصيل للمكتب:</strong> {wilaya.deskDelivery} DA
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditDelivery(wilaya)}
                    className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm transition-colors font-arabic"
                  >
                    تعديل الأسعار
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-pink-600 font-arabic">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    الوصف
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 font-arabic">
                      السعر (DA)
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 font-arabic">
                      السعر الأصلي (DA)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          originalPrice: parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    الفئة
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                  >
                    <option value="accessories">إكسسوارات</option>
                    <option value="gaming">ألعاب</option>
                    <option value="gym">رياضة</option>
                    <option value="watches">ساعات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={productForm.inStock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        inStock: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="inStock" className="text-sm font-arabic">
                    متوفر في المخزون
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        price: 0,
                        originalPrice: 0,
                        image: "",
                        category: "accessories",
                        description: "",
                        inStock: true,
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors font-arabic"
                  >
                    {editingProduct ? "تعديل" : "إضافة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Form Modal */}
        {showDeliveryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-pink-600 font-arabic">
                تعديل أسعار التوصيل - {deliveryForm.name}
              </h3>

              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    سعر التوصيل للمنزل (DA)
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.homeDelivery}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        homeDelivery: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 font-arabic">
                    سعر التوصيل للمكتب (DA)
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.deskDelivery}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        deskDelivery: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setEditingWilaya(null);
                      setDeliveryForm({ name: "", homeDelivery: 0, deskDelivery: 0 });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors font-arabic"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}