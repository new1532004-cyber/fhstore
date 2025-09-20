export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  discount?: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune?: string;
  deliveryType: 'home' | 'desk';
  address?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface WilayaDelivery {
  name: string;
  homeDelivery: number;
  deskDelivery: number;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  currentView: 'store' | 'order' | 'admin';
  selectedProduct: Product | null;
}