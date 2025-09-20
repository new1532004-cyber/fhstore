import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ar' | 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    // Header
    'store.name': 'F.H Store',
    'admin.mode': 'وضع الإدارة',
    'client.mode': 'وضع العميل',
    
    // Products
    'products.title': 'منتجاتنا ❤️',
    'products.order': 'اطلب الآن',
    'products.no_products': 'لا توجد منتجات حالياً',
    'products.admin_can_add': 'يمكن للمدير إضافة منتجات من لوحة الإدارة',
    
    // Order
    'complete_order': 'إكمال الطلب',
    'your_order': 'طلبك',
    'customer_info': 'معلومات العميل',
    'first_name': 'الاسم الأول',
    'last_name': 'اسم العائلة',
    'phone': 'رقم الهاتف',
    'wilaya': 'ولايتك',
    'commune': 'بلديتك',
    'delivery_location': 'مكان التسليم',
    'home_delivery': 'التسليم للمنزل',
    'desk_delivery': 'التسليم لمكتب الشركة',
    'address': 'العنوان الكامل',
    'address_placeholder': 'أدخل عنوانك الكامل...',
    'subtotal': 'سعر المنتجات',
    'delivery_fee': 'رسوم التوصيل',
    'total': 'التكلفة الإجمالية',
    'order_now': 'اطلب الآن',
    'choose_wilaya': 'اختر الولاية',
    'order_success': 'تم إنشاء الطلب بنجاح! سنتصل بك قريباً.',
    'no_product_selected': 'لم يتم اختيار منتج',
    'back_to_store': 'العودة للمتجر',
    
    // Auth
    'admin_login': 'تسجيل دخول الإدارة',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'login': 'تسجيل الدخول',
    'logout': 'تسجيل الخروج',
    'logging_in': 'جاري تسجيل الدخول...',
    'login_error': 'خطأ في البريد الإلكتروني أو كلمة المرور',
    'demo_credentials': 'بيانات تجريبية:',
    
    // Admin
    'admin.title': 'لوحة الإدارة',
    'admin.products': 'المنتجات',
    'admin.orders': 'الطلبات',
    'admin.product_management': 'إدارة المنتجات',
    'admin.add_product': 'إضافة منتج',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.order_management': 'إدارة الطلبات',
    'admin.customer_info': 'معلومات العميل',
    'admin.ordered_products': 'المنتجات المطلوبة',
    'admin.actions': 'الإجراءات',
    'admin.call': 'اتصال',
    'admin.pending': 'في الانتظار',
    'admin.confirmed': 'مؤكد',
    'admin.shipped': 'تم الشحن',
    'admin.delivered': 'تم التسليم',
    'admin.cancelled': 'ملغي',
    'admin.no_orders': 'لا توجد طلبات',
    
    // Common
    'da': 'د.ج',
    'back': 'رجوع',
    'cancel': 'إلغاء',
    'save': 'حفظ',
    'add': 'إضافة',
    'name': 'الاسم',
    'phone': 'الهاتف',
    'wilaya': 'الولاية',
    'delivery': 'التوصيل',
    'home': 'المنزل',
    'desk': 'المكتب'
  },
  fr: {
    // Header
    'store.name': 'F.H Store', 
    'admin.mode': 'Mode Admin',
    'client.mode': 'Mode Client',
    
    // Products
    'products.title': 'Nos produits ❤️',
    'products.order': 'Commander',
    
    // Order
    'complete_order': 'Finaliser la commande',
    'your_order': 'Votre commande',
    'customer_info': 'Informations client',
    'first_name': 'Prénom',
    'last_name': 'Nom de famille',
    'phone': 'Numéro de téléphone',
    'wilaya': 'Votre wilaya',
    'commune': 'Votre commune',
    'delivery_location': 'Lieu de livraison',
    'home_delivery': 'À domicile',
    'desk_delivery': 'Au bureau de livraison',
    'address': 'Adresse complète',
    'address_placeholder': 'Entrez votre adresse complète...',
    'subtotal': 'Prix des produits',
    'delivery_fee': 'Frais de livraison',
    'total': 'Coût total',
    'order_now': 'Commander maintenant',
    'choose_wilaya': 'Choisir wilaya',
    'order_success': 'Commande créée avec succès! Nous vous contacterons bientôt.',
    'no_product_selected': 'Aucun produit sélectionné',
    'back_to_store': 'Retour au magasin',
    
    // Auth
    'admin_login': 'Connexion Admin',
    'email': 'Email',
    'password': 'Mot de passe',
    'login': 'Se connecter',
    'logout': 'Se déconnecter',
    'logging_in': 'Connexion...',
    'login_error': 'Email ou mot de passe incorrect',
    'demo_credentials': 'Identifiants de démonstration:',
    
    // Admin
    'admin.title': 'Panneau d\'administration',
    'admin.products': 'Produits',
    'admin.orders': 'Commandes',
    'admin.product_management': 'Gestion des produits',
    'admin.add_product': 'Ajouter produit',
    'admin.edit': 'Modifier',
    'admin.delete': 'Supprimer',
    'admin.order_management': 'Gestion des commandes',
    'admin.customer_info': 'Informations client',
    'admin.ordered_products': 'Produits commandés',
    'admin.actions': 'Actions',
    'admin.call': 'Appeler',
    'admin.pending': 'En attente',
    'admin.confirmed': 'Confirmée',
    'admin.shipped': 'Expédiée',
    'admin.delivered': 'Livrée',
    'admin.cancelled': 'Annulée',
    'admin.no_orders': 'Aucune commande trouvée',
    
    // Common
    'da': 'DA',
    'back': 'Retour',
    'cancel': 'Annuler',
    'save': 'Enregistrer',
    'add': 'Ajouter',
    'name': 'Nom',
    'phone': 'Téléphone',
    'wilaya': 'Wilaya',
    'delivery': 'Livraison',
    'home': 'Domicile',
    'desk': 'Bureau'
  },
  en: {
    // Header
    'store.name': 'F.H Store',
    'admin.mode': 'Admin Mode',
    'client.mode': 'Client Mode',
    
    // Products
    'products.title': 'Our products ❤️',
    'products.order': 'Order Now',
    
    // Order
    'complete_order': 'Complete Order',
    'your_order': 'Your Order',
    'customer_info': 'Customer Information',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'phone': 'Phone Number',
    'wilaya': 'Your Wilaya',
    'commune': 'Your Commune',
    'delivery_location': 'Delivery Location',
    'home_delivery': 'Home Delivery',
    'desk_delivery': 'Delivery Office',
    'address': 'Complete Address',
    'address_placeholder': 'Enter your complete address...',
    'subtotal': 'Product Prices',
    'delivery_fee': 'Delivery Fee',
    'total': 'Total Cost',
    'order_now': 'Order Now',
    'choose_wilaya': 'Choose Wilaya',
    'order_success': 'Order created successfully! We will contact you soon.',
    'no_product_selected': 'No Product Selected',
    'back_to_store': 'Back to Store',
    
    // Auth
    'admin_login': 'Admin Login',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'logout': 'Logout',
    'logging_in': 'Logging in...',
    'login_error': 'Invalid email or password',
    'demo_credentials': 'Demo credentials:',
    
    // Admin
    'admin.title': 'Administration panel',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.product_management': 'Product management',
    'admin.add_product': 'Add product',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.order_management': 'Order management',
    'admin.customer_info': 'Customer information',
    'admin.ordered_products': 'Ordered products',
    'admin.actions': 'Actions',
    'admin.call': 'Call',
    'admin.pending': 'Pending',
    'admin.confirmed': 'Confirmed',
    'admin.shipped': 'Shipped',
    'admin.delivered': 'Delivered',
    'admin.cancelled': 'Cancelled',
    'admin.no_orders': 'No orders found',
    
    // Common
    'da': 'DA',
    'back': 'Back',
    'cancel': 'Cancel',
    'save': 'Save',
    'add': 'Add',
    'name': 'Name',
    'phone': 'Phone',
    'wilaya': 'Wilaya',
    'delivery': 'Delivery',
    'home': 'Home',
    'desk': 'Office'
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const isRTL = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}