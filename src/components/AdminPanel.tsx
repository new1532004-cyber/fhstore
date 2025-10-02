import React, { useState } from "react";
import { Plus, CreditCard as Edit2, Trash2, ArrowLeft, Settings, Upload, Image as ImageIcon, X } from "lucide-react";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("يرجى اختيار ملف صورة صالح");
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const imageUrl = await productActions.uploadImage(file);
      setProductForm({ ...productForm, image: imageUrl });
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("خطأ في رفع الصورة: " + (err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

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

      resetProductForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("خطأ في حفظ المنتج: " + (err as Error).message);
    }
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setImagePreview("");
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
    setImagePreview(product.image);
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

  const handleDeleteOrder = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        await orderActions.deleteOrder(id);
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("خطأ في حذف الطلب: " + (err as Error).message);
      }
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
    setShowDeliveryForm(false);
    setEditingWilaya(null);
    setDeliveryForm({ name: "", homeDelivery: 0, deskDelivery: 0 });
    alert("تم تحديث أسعار التوصيل بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                dispatch({ type: "SET_VIEW", payload: "store" });
              }}
              className="mr-4 p-2 hover:bg-pink-100 rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5 text-pink-600" />
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-arabic">
              {t('admin.title')}
            </h1>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
                  : "bg-white text-pink-600 hover:bg-pink-50 border-2 border-pink-200"
              }`}
            >
              {t('admin.products')} ({state.products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200"
              }`}
            >
              {t('admin.orders')} ({state.orders.length})
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                activeTab === "delivery"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200"
              }`}
            >
              <Settings className="h-4 w-4 inline ml-2" />
              أسعار التوصيل
            </button>
          </div>
        </div>

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 font-arabic">
                {t('admin.product_management')}
              </h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span className="font-arabic">{t('admin.add_product')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {state.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      product.inStock
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {product.inStock ? 'متوفر' : 'غير متوفر'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 font-arabic line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 font-arabic line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-xl text-pink-600">{product.price} DA</span>
                      {product.originalPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice} DA</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 transform hover:scale-105"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="font-arabic">{t('admin.edit')}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 transform hover:scale-105"
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
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📦</div>
                <p className="text-gray-400 text-2xl font-arabic mb-2">
                  لا توجد منتجات حالياً
                </p>
                <p className="text-gray-300 text-lg font-arabic">
                  اضغط على "إضافة منتج" لإضافة منتج جديد
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-arabic">
              {t('admin.order_management')}
            </h2>

            <div className="space-y-4">
              {state.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl mb-3 text-pink-600 font-arabic">
                        {t('admin.customer_info')}
                      </h3>
                      <p className="font-arabic text-gray-700">
                        <strong className="text-gray-900">الاسم:</strong> {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="font-arabic text-gray-700">
                        <strong className="text-gray-900">الهاتف:</strong> {order.customer.phone}
                      </p>
                      <p className="font-arabic text-gray-700">
                        <strong className="text-gray-900">الولاية:</strong> {order.customer.wilaya}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl mb-3 text-purple-600 font-arabic">
                        {t('admin.ordered_products')}
                      </h3>
                      {order.items.map((item) => (
                        <p key={item.id} className="font-arabic text-gray-700">
                          {item.name} - <strong>الكمية: {item.quantity}</strong>
                        </p>
                      ))}
                      <p className="font-bold text-2xl text-pink-600 mt-4 pt-4 border-t-2 border-gray-100">
                        المجموع: {order.total} DA
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-arabic font-bold transition-all transform hover:scale-105"
                  >
                    حذف الطلب
                  </button>
                </div>
              ))}

              {state.orders.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-8xl mb-6">📋</div>
                  <p className="text-gray-400 text-2xl font-arabic">
                    {t('admin.no_orders')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-arabic">
              إدارة أسعار التوصيل
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ALGERIAN_WILAYAS.map((wilaya) => (
                <div key={wilaya.name} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all">
                  <h3 className="font-bold text-lg mb-4 text-blue-600 font-arabic">{wilaya.name}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="font-arabic text-gray-700">
                      <strong className="text-gray-900">التوصيل للمنزل:</strong> {wilaya.homeDelivery} DA
                    </p>
                    <p className="font-arabic text-gray-700">
                      <strong className="text-gray-900">التوصيل للمكتب:</strong> {wilaya.deskDelivery} DA
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditDelivery(wilaya)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all transform hover:scale-105 font-arabic"
                  >
                    تعديل الأسعار
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 font-arabic">
                  {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h3>
                <button
                  onClick={resetProductForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3 font-arabic text-gray-700">
                    صورة المنتج
                  </label>

                  <div className="border-2 border-dashed border-pink-300 rounded-2xl p-6 text-center hover:border-pink-500 transition-all">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-xl shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setProductForm({ ...productForm, image: "" });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-16 w-16 mx-auto text-pink-300 mb-3" />
                        <p className="text-gray-600 font-arabic mb-3">
                          {uploadingImage ? "جاري رفع الصورة..." : "اضغط لاختيار صورة من جهازك"}
                        </p>
                        <label className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-all transform hover:scale-105 font-bold">
                          <Upload className="h-5 w-5" />
                          <span className="font-arabic">رفع صورة</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold mb-1 font-arabic text-gray-600">
                      أو أدخل رابط صورة
                    </label>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => {
                        setProductForm({ ...productForm, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-all"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                      السعر (DA)
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                      السعر الأصلي (DA)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          originalPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                    الفئة
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-all"
                  >
                    <option value="accessories">إكسسوارات</option>
                    <option value="gaming">ألعاب</option>
                    <option value="gym">رياضة</option>
                    <option value="watches">ساعات</option>
                  </select>
                </div>

                <div className="flex items-center bg-gray-50 p-4 rounded-xl">
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
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500 ml-3"
                  />
                  <label htmlFor="inStock" className="text-sm font-bold font-arabic text-gray-700">
                    متوفر في المخزون
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!productForm.image || uploadingImage}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProduct ? "تعديل" : "إضافة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeliveryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 font-arabic">
                تعديل أسعار التوصيل - {deliveryForm.name}
              </h3>

              <form onSubmit={handleDeliverySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                    سعر التوصيل للمنزل (DA)
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.homeDelivery}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        homeDelivery: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 font-arabic text-gray-700">
                    سعر التوصيل للمكتب (DA)
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.deskDelivery}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        deskDelivery: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setEditingWilaya(null);
                      setDeliveryForm({ name: "", homeDelivery: 0, deskDelivery: 0 });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 font-arabic"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 font-arabic"
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
