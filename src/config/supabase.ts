import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price: number;
          image: string;
          category: string;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          customer_first_name: string;
          customer_last_name: string;
          customer_phone: string;
          customer_wilaya: string;
          items: any[];
          total: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      delivery_prices: {
        Row: {
          id: string;
          wilaya_name: string;
          home_delivery: number;
          desk_delivery: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['delivery_prices']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['delivery_prices']['Insert']>;
      };
    };
  };
}
