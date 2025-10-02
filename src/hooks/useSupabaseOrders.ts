import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Order } from '../types';

export function useSupabaseOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = (data || []).map(order => ({
        id: order.id,
        customer: {
          firstName: order.customer_first_name,
          lastName: order.customer_last_name,
          phone: order.customer_phone,
          wilaya: order.customer_wilaya
        },
        items: order.items || [],
        total: order.total,
        status: order.status
      }));

      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_first_name: orderData.customer.firstName,
          customer_last_name: orderData.customer.lastName,
          customer_phone: orderData.customer.phone,
          customer_wilaya: orderData.customer.wilaya,
          items: orderData.items,
          total: orderData.total,
          status: orderData.status || 'pending'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  };

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const updateData: any = {};
      if (orderData.customer) {
        if (orderData.customer.firstName) updateData.customer_first_name = orderData.customer.firstName;
        if (orderData.customer.lastName) updateData.customer_last_name = orderData.customer.lastName;
        if (orderData.customer.phone) updateData.customer_phone = orderData.customer.phone;
        if (orderData.customer.wilaya) updateData.customer_wilaya = orderData.customer.wilaya;
      }
      if (orderData.items !== undefined) updateData.items = orderData.items;
      if (orderData.total !== undefined) updateData.total = orderData.total;
      if (orderData.status !== undefined) updateData.status = orderData.status;

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder
  };
}
