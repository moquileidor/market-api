'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { Order } from '@/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_STYLE: Record<Order['status'], { backgroundColor: string; color: string }> = {
  pending: { backgroundColor: '#fef9c3', color: '#854d0e' },
  paid: { backgroundColor: '#dcfce7', color: '#166534' },
  shipped: { backgroundColor: '#dbeafe', color: '#1e40af' },
  delivered: { backgroundColor: '#f0fdf4', color: '#15803d' },
  cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function OrderDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }

    api.get<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [user, authLoading, params.id, router]);

  if (authLoading || isLoading) {
    return <div className="py-32 text-center text-sm" style={{ color: '#9ca3af' }}>Cargando pedido...</div>;
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Package size={48} className="mb-4" style={{ color: '#d1d5db' }} />
        <p className="text-lg font-semibold" style={{ color: '#111111' }}>Pedido no encontrado</p>
        <Link href="/orders" className="mt-4 text-sm font-medium hover:underline" style={{ color: '#059669' }}>
          Ver mis órdenes
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[order.status];

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-black"
        style={{ color: '#6b7280' }}
      >
        <ArrowLeft size={15} />
        Mis órdenes
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#111111' }}>
          Pedido #{order.id}
        </h1>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={statusStyle}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
        {new Date(order.createdAt).toLocaleDateString('es-CO', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}
      >
        <h2 className="font-semibold mb-4" style={{ color: '#111111' }}>Productos</h2>

        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span style={{ color: '#374151' }}>
                {item.product?.name ?? `Producto #${item.productId}`}{' '}
                <span style={{ color: '#9ca3af' }}>x{item.quantity}</span>
              </span>
              <span style={{ color: '#111111' }}>
                ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>

        <div
          className="border-t mt-4 pt-4 flex justify-between font-semibold"
          style={{ borderColor: '#f3f4f6', color: '#111111' }}
        >
          <span>Total</span>
          <span>${Number(order.total).toLocaleString('es-CO')} COP</span>
        </div>
      </div>

      <Link
        href="/"
        className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#059669', color: '#ffffff' }}
      >
        Seguir comprando
      </Link>
    </div>
  );
}
