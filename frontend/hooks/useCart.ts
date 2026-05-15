'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Cart } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    setIsLoading(true);
    try {
      setCart(await api.get<Cart>('/cart'));
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId: number, quantity = 1) => {
    await api.post('/cart/items', { productId, quantity });
    await fetchCart();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId: number) => {
    await api.delete(`/cart/items/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    await fetchCart();
  };

  const itemCount = cart?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0;

  return { cart, isLoading, addItem, updateItem, removeItem, clearCart, refetch: fetchCart, itemCount };
}
