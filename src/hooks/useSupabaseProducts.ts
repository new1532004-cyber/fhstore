import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Product } from '../types';

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const productsData = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image,
        category: product.category,
        inStock: product.in_stock
      }));

      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          original_price: productData.originalPrice || 0,
          image: productData.image,
          category: productData.category,
          in_stock: productData.inStock
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updateData: any = {};
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice;
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.category !== undefined) updateData.category = productData.category;
      if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  };
}
