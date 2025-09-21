import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MapPin, Truck, Building } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { Customer, Order } from '../types';

export default function OrderForm() {
  const { state, dispatch, orderActions } = useStore();
  const { t, isRTL } = useLanguage();
  const [customer, setCustomer] = useState<Customer>({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    commune: '',
    deliveryType: 'home',
    address: ''
  });
  
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = state.selectedProduct;
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center glass rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold gradient-text mb-4">{t('no_product_selected')}</h2>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'store' })}
            className="btn-modern px-6 py-3"
          >
            {t('back_to_store')}
          </button>
        </div>
      </div>
    );
  }
  
  const subtotal = product.price * quantity;
  const total = subtotal + deliveryFee;
  
  useEffect(() => {
    if (customer.wilaya) {
      const wilayaData = ALGERIAN_WILAYAS.find(w => w.name === customer.wilaya);
      if (wilayaData) {
        setDeliveryFee(customer.deliveryType === 'home' ? wilayaData.homeDelivery : wilayaData.deskDelivery);
      }
    }
  }, [customer.wilaya, customer.deliveryType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: Order = {
      id: Date.now().toString(),
      customer,
      items: [{ ...product, quantity }],
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await orderActions.addOrder(order);
    alert(t('order_success'));
    dispatch({ type: 'SET_VIEW', payload: 'store' });
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null });
  };
  
  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              dispatch({ type: 'SET_VIEW', payload: 'store' });
            }}
            className={`${isRTL ? 'ml-4' : 'mr-4'} p-3 hover:bg-pink-100 rounded-full smooth-transition glow-pink bg-white/80 backdrop-blur-sm`}
          >
            <ArrowLeft className="h-5 w-5 text-pink-600" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('complete_order')}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Summary */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 glow-pink border border-pink-200">
            <h2 className="text-xl font-bold gradient-text mb-6">{t('your_order')}</h2>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl shadow-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">{product.name}</h3>
                <p className="gradient-text font-bold text-lg">{product.price} {t('da')}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 border-t border-pink-200 pt-6">
              <div className="flex justify-between text-base">
                <span>{t('subtotal')}</span>
                <span className="font-bold">{subtotal} {t('da')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>{t('delivery_fee')}</span>
                <span className="font-bold">{deliveryFee > 0 ? `${deliveryFee} ${t('da')}` : t('choose_wilaya')}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-pink-200 pt-4">
                <span>{t('total')}</span>
                <span className="gradient-text text-2xl">{total} {t('da')}</span>
              </div>
            </div>
          </div>
          
          {/* Order Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 glow-pink border border-pink-200">
            <h2 className="text-xl font-bold gradient-text mb-6">{t('customer_info')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('first_name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="w-full input-modern"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('last_name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="w-full input-modern"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full input-modern"
                  placeholder="0555 123 456"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {t('wilaya')}
                  </label>
                  <select
                    required
                    value={customer.wilaya}
                    onChange={(e) => setCustomer({ ...customer, wilaya: e.target.value })}
                    className="w-full input-modern"
                  >
                    <option value="">{t('choose_wilaya')}</option>
                    {ALGERIAN_WILAYAS.map((wilaya) => (
                      <option key={wilaya.name} value={wilaya.name}>
                        {wilaya.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('commune')}
                  </label>
                  <input
                    type="text"
                    value={customer.commune}
                    onChange={(e) => setCustomer({ ...customer, commune: e.target.value })}
                    className="w-full input-modern"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  {t('delivery_location')}
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border-2 cursor-pointer smooth-hover ${customer.deliveryType === 'home' ? 'border-pink-500 glow-pink' : 'border-pink-200'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="home"
                      checked={customer.deliveryType === 'home'}
                      onChange={(e) => setCustomer({ ...customer, deliveryType: e.target.value as 'home' | 'desk' })}
                      className={`${isRTL ? 'ml-3' : 'mr-3'} text-pink-500 focus:ring-pink-500`}
                    />
                    <Truck className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-pink-600`} />
                    <span className="font-bold">{t('home_delivery')}</span>
                  </label>
                  <label className={`flex items-center p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border-2 cursor-pointer smooth-hover ${customer.deliveryType === 'desk' ? 'border-pink-500 glow-pink' : 'border-pink-200'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="desk"
                      checked={customer.deliveryType === 'desk'}
                      onChange={(e) => setCustomer({ ...customer, deliveryType: e.target.value as 'home' | 'desk' })}
                      className={`${isRTL ? 'ml-3' : 'mr-3'} text-pink-500 focus:ring-pink-500`}
                    />
                    <Building className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-pink-600`} />
                    <span className="font-bold">{t('desk_delivery')}</span>
                  </label>
                </div>
              </div>
              
              {customer.deliveryType === 'home' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('address')}
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full input-modern"
                    rows={3}
                    placeholder={t('address_placeholder')}
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={!customer.wilaya}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed smooth-hover glow-pink shadow-lg"
              >
                {t('order_now')} - {total} {t('da')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}