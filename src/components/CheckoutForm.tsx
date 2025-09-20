import React, { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { Customer, Order } from '../types';

export default function CheckoutForm() {
  const { state, dispatch } = useStore();
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
  
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;
  
  useEffect(() => {
    if (customer.wilaya) {
      const wilayaData = ALGERIAN_WILAYAS.find(w => w.name === customer.wilaya);
      if (wilayaData) {
        setDeliveryFee(customer.deliveryType === 'home' ? wilayaData.homeDelivery : wilayaData.deskDelivery);
      }
    }
  }, [customer.wilaya, customer.deliveryType]);
  
  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: Order = {
      id: Date.now().toString(),
      customer,
      items: [...state.cart],
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'CREATE_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    alert(t('checkout.success'));
    dispatch({ type: 'SET_VIEW', payload: 'store' });
  };
  
  if (state.cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center glass rounded-2xl p-8">
          <ShoppingBag className="h-20 w-20 text-pink-400 mx-auto mb-6 float" />
          <h2 className="text-3xl font-bold gradient-text mb-4">{t('cart.empty')}</h2>
          <p className="text-gray-600 mb-8 text-lg">{t('cart.empty.subtitle')}</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'store' })}
            className="btn-modern px-8 py-4 text-lg"
          >
            {t('cart.continue')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className={`flex items-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'store' })}
            className={`${isRTL ? 'ml-4' : 'mr-4'} p-3 hover:bg-pink-100 rounded-full smooth-transition glow-pink`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold gradient-text">{t('checkout.title')}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="glass rounded-2xl shadow-modern p-8 glow-pink">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">{t('checkout.your_order')}</h2>
            
            <div className="space-y-6 mb-8">
              {state.cart.map((item) => (
                <div key={item.id} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} p-4 rounded-xl glass-pink`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl shadow-modern"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="gradient-text font-bold">{item.price} {t('da')}</p>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-pink-100 rounded-lg smooth-transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-pink-100 rounded-lg smooth-transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-pink-200 pt-6 space-y-3">
              <div className="flex justify-between text-lg">
                <span>{t('checkout.subtotal')}</span>
                <span className="font-semibold">{subtotal} {t('da')}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>{t('checkout.delivery_fee')}</span>
                <span className="font-semibold">{deliveryFee > 0 ? `${deliveryFee} ${t('da')}` : t('checkout.choose_wilaya')}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-pink-200 pt-4">
                <span>{t('checkout.total')}</span>
                <span className="gradient-text text-2xl">{total} {t('da')}</span>
              </div>
            </div>
          </div>
          
          {/* Customer Form */}
          <div className="glass rounded-2xl shadow-modern p-8 glow-pink">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">{t('checkout.form_title')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('checkout.first_name')}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('checkout.last_name')}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('checkout.phone')}
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full input-modern"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('checkout.wilaya')}
                  </label>
                  <select
                    required
                    value={customer.wilaya}
                    onChange={(e) => setCustomer({ ...customer, wilaya: e.target.value })}
                    className="w-full input-modern"
                  >
                    <option value="">{t('checkout.choose_wilaya')}</option>
                    {ALGERIAN_WILAYAS.map((wilaya) => (
                      <option key={wilaya.name} value={wilaya.name}>
                        {wilaya.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('checkout.commune')}
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
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  {t('checkout.delivery_location')}
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-3 rounded-xl glass-pink cursor-pointer smooth-hover ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="home"
                      checked={customer.deliveryType === 'home'}
                      onChange={(e) => setCustomer({ ...customer, deliveryType: e.target.value as 'home' | 'desk' })}
                      className={`${isRTL ? 'ml-3' : 'mr-3'} text-pink-500 focus:ring-pink-500`}
                    />
                    <span className="font-medium">{t('checkout.home_delivery')}</span>
                  </label>
                  <label className={`flex items-center p-3 rounded-xl glass-pink cursor-pointer smooth-hover ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="desk"
                      checked={customer.deliveryType === 'desk'}
                      onChange={(e) => setCustomer({ ...customer, deliveryType: e.target.value as 'home' | 'desk' })}
                      className={`${isRTL ? 'ml-3' : 'mr-3'} text-pink-500 focus:ring-pink-500`}
                    />
                    <span className="font-medium">{t('checkout.desk_delivery')}</span>
                  </label>
                </div>
              </div>
              
              {customer.deliveryType === 'home' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('checkout.address')}
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full input-modern"
                    rows={3}
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={!customer.wilaya}
                className="w-full btn-modern py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('checkout.order_now')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}