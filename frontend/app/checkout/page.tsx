'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { api } from '@/lib/api';
import type { Order } from '@/types';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, isLoading, refetch } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (isLoading) {
    return <div className="py-32 text-center text-sm" style={{ color: '#9ca3af' }}>Cargando...</div>;
  }

  const items = cart?.items ?? [];
  const total = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-semibold" style={{ color: '#111111' }}>Tu carrito está vacío</p>
        <Link
          href="/"
          className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const handleOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await api.post<Order>('/orders', {});
      toast.success('¡Pedido realizado con éxito!');
      await refetch();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8" style={{ color: '#111111' }}>Confirmar pedido</h1>

      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}
      >
        <h2 className="font-semibold mb-4" style={{ color: '#111111' }}>Productos</h2>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span style={{ color: '#374151' }}>
                {item.product.name}{' '}
                <span style={{ color: '#9ca3af' }}>x{item.quantity}</span>
              </span>
              <span style={{ color: '#111111' }}>
                ${(Number(item.product.price) * item.quantity).toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>

        <div
          className="border-t mt-4 pt-4 flex justify-between font-semibold"
          style={{ borderColor: '#f3f4f6', color: '#111111' }}
        >
          <span>Total</span>
          <span>${total.toLocaleString('es-CO')} COP</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/cart"
          className="flex-1 py-3 rounded-xl text-sm font-medium text-center border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#e5e7eb', color: '#374151' }}
        >
          Volver al carrito
        </Link>
        <button
          onClick={handleOrder}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60 hover:opacity-90"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          {isSubmitting ? 'Procesando...' : 'Realizar pedido'}
        </button>
      </div>
    </div>
  );
}
