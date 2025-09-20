import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, Order, Customer } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';

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
  | { type: 'SET_VIEW'; payload: 'store' | 'order' | 'admin' }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'CREATE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string };

const initialState: StoreState = {
  products: SAMPLE_PRODUCTS,
  cart: [],
  orders: [],
  currentView: 'store',
  isAdmin: false,
  selectedProduct: null,
  loading: false
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'CREATE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
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