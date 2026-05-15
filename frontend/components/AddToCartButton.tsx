'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Props {
  productId: number;
  inStock: boolean;
}

export function AddToCartButton({ productId, inStock }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      toast.error('Inicia sesión para agregar al carrito');
      router.push('/login');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al agregar al carrito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || isLoading}
      className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
      style={{ backgroundColor: '#059669', color: '#ffffff' }}
    >
      <ShoppingCart size={18} />
      {isLoading ? 'Agregando...' : 'Agregar al carrito'}
    </button>
  );
}
