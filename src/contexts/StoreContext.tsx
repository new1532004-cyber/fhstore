import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, Customer } from '../types';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { useSupabaseOrders } from '../hooks/useSupabaseOrders';

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentView: 'store' | 'checkout' | 'admin';
  isAdmin: boolean;
  selectedProduct: Product | null;
  loading: boolean;
}

type StoreAction = 
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_VIEW'; payload: 'store' | 'order' | 'admin' }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: StoreState = {
  products: [],
  cart: [],
  orders: [],
  currentView: 'store',
  isAdmin: false,
  selectedProduct: null,
  loading: false
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  productActions: {
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
  };
  orderActions: {
    addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
    updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
  };
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  } = useSupabaseProducts();
  const {
    orders,
    loading: ordersLoading,
    addOrder,
    updateOrder,
    deleteOrder
  } = useSupabaseOrders();

  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, [products]);

  useEffect(() => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  }, [orders]);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: productsLoading || ordersLoading });
  }, [productsLoading, ordersLoading]);

  const productActions = {
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  };

  const orderActions = {
    addOrder,
    updateOrder,
    deleteOrder
  };
  
  return (
    <StoreContext.Provider value={{ state, dispatch, productActions, orderActions }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}